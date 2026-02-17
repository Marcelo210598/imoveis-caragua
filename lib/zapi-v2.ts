import { prisma } from './prisma';

const ZAPI_INSTANCE_ID = process.env.ZAPI_INSTANCE_ID!;
const ZAPI_INSTANCE_TOKEN = process.env.ZAPI_INSTANCE_TOKEN!;

/**
 * Gera um código OTP de 6 dígitos
 */
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Envia OTP via WhatsApp usando Z-API (Versão simplificada)
 */
export async function sendOTP(phone: string): Promise<{ success: boolean; error?: string; devCode?: string }> {
  try {
    if (!ZAPI_INSTANCE_ID || !ZAPI_INSTANCE_TOKEN) {
      return { success: false, error: 'Credenciais Z-API não configuradas' };
    }

    const code = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    // Salvar código no banco PRIMEIRO
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

    // Mensagem
    const message = `🏠 *Litoral Norte Imóveis*\n\nSeu código de acesso é: *${code}*\n\nVálido por 10 minutos.\n\nSe não solicitou, ignore esta mensagem.`;

    // API URL direta (formato que você me mandou)
    const apiUrl = `https://api.z-api.io/instances/${ZAPI_INSTANCE_ID}/token/${ZAPI_INSTANCE_TOKEN}/send-text/${whatsappPhone}`;

    console.log('📤 Enviando OTP via Z-API:', { phone: whatsappPhone, apiUrl: apiUrl.replace(ZAPI_INSTANCE_TOKEN, '***') });

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Erro Z-API Response:', errorText);
      return { success: false, error: `Erro Z-API: ${response.status}` };
    }

    const data = await response.json();
    console.log('✅ OTP enviado:', data);

    if (process.env.NODE_ENV === 'development') {
      return { success: true, devCode: code };
    }

    return { success: true };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erro ao enviar OTP';
    console.error('❌ Erro ao enviar OTP Z-API:', message);
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

    await prisma.verificationCode.update({
      where: { id: verification.id },
      data: { used: true },
    });

    return { success: true };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erro ao verificar OTP';
    console.error('❌ Erro ao verificar OTP:', message);
    return { success: false, error: message };
  }
}
