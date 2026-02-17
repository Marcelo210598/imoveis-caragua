import { prisma } from './prisma';

const ZAPI_INSTANCE_ID = process.env.ZAPI_INSTANCE_ID!;
const ZAPI_INSTANCE_TOKEN = process.env.ZAPI_INSTANCE_TOKEN!;
const ZAPI_CLIENT_TOKEN = process.env.ZAPI_CLIENT_TOKEN!;
const ZAPI_BASE_URL = 'https://api.z-api.io';

/**
 * Gera um código OTP de 6 dígitos
 */
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Envia OTP via WhatsApp usando Z-API
 */
export async function sendOTP(phone: string): Promise<{ success: boolean; error?: string; devCode?: string }> {
  try {
    // Validar credenciais
    if (!ZAPI_INSTANCE_ID || !ZAPI_INSTANCE_TOKEN || !ZAPI_CLIENT_TOKEN) {
      return { success: false, error: 'Credenciais Z-API não configuradas' };
    }

    // Gerar código de 6 dígitos
    const code = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutos

    // Salvar código no banco
    await prisma.verificationCode.create({
      data: {
        phone,
        code,
        expiresAt,
        used: false,
      },
    });

    // Formatar telefone para WhatsApp (sem +, com 55 na frente)
    const cleanPhone = phone.replace(/\D/g, '');
    const whatsappPhone = cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`;

    // Mensagem personalizada
    const message = `🏠 *Litoral Norte Imóveis*\n\nSeu código de acesso é: *${code}*\n\nVálido por 10 minutos.\n\nSe não solicitou, ignore esta mensagem.`;

    // Enviar via Z-API
    const response = await fetch(`${ZAPI_BASE_URL}/instances/${ZAPI_INSTANCE_ID}/token/${ZAPI_INSTANCE_TOKEN}/send-text`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Client-Token': ZAPI_CLIENT_TOKEN,
      },
      body: JSON.stringify({
        phone: whatsappPhone,
        message,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Erro Z-API:', errorData);
      return { success: false, error: 'Erro ao enviar WhatsApp' };
    }

    const data = await response.json();
    console.log('OTP enviado via Z-API:', data);

    // Em dev mode, retorna o código para facilitar testes
    if (process.env.NODE_ENV === 'development') {
      return { success: true, devCode: code };
    }

    return { success: true };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erro ao enviar OTP';
    console.error('Erro ao enviar OTP Z-API:', message);
    return { success: false, error: message };
  }
}

/**
 * Verifica OTP enviado
 */
export async function verifyOTP(
  phone: string,
  code: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Buscar código válido mais recente para este telefone
    const verification = await prisma.verificationCode.findFirst({
      where: {
        phone,
        code,
        used: false,
        expiresAt: {
          gte: new Date(),
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (!verification) {
      return { success: false, error: 'Código inválido ou expirado' };
    }

    // Marcar como usado
    await prisma.verificationCode.update({
      where: { id: verification.id },
      data: { used: true },
    });

    return { success: true };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erro ao verificar OTP';
    console.error('Erro ao verificar OTP Z-API:', message);
    return { success: false, error: message };
  }
}

/**
 * Teste de conexão com Z-API
 */
export async function testZAPIConnection(): Promise<{ success: boolean; error?: string; instanceInfo?: any }> {
  try {
    const response = await fetch(`${ZAPI_BASE_URL}/instances/${ZAPI_INSTANCE_ID}/token/${ZAPI_INSTANCE_TOKEN}/status`, {
      method: 'GET',
      headers: {
        'Client-Token': ZAPI_CLIENT_TOKEN,
      },
    });

    if (!response.ok) {
      return { success: false, error: 'Instância Z-API inválida ou token incorreto' };
    }

    const data = await response.json();
    return { success: true, instanceInfo: data };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erro ao conectar Z-API';
    return { success: false, error: message };
  }
}
