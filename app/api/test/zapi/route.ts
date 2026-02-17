import { NextRequest, NextResponse } from 'next/server';
import { testZAPIConnection, sendOTP } from '@/lib/zapi';

/**
 * Endpoint de teste para Z-API
 * GET /api/test/zapi - Testa conexão
 * POST /api/test/zapi - Envia OTP de teste
 */
export async function GET() {
  try {
    const result = await testZAPIConnection();

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error,
          message: 'Credenciais Z-API inválidas. Verifique ZAPI_INSTANCE_ID e ZAPI_INSTANCE_TOKEN no .env'
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Conexão Z-API estabelecida com sucesso!',
      instanceInfo: result.instanceInfo,
    });
  } catch (error) {
    console.error('Erro ao testar Z-API:', error);
    return NextResponse.json(
      { success: false, error: 'Erro interno ao testar conexão' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { phone } = await request.json();

    if (!phone) {
      return NextResponse.json(
        { error: 'Telefone obrigatorio para teste' },
        { status: 400 }
      );
    }

    // Formatar telefone
    const cleanPhone = phone.replace(/\D/g, '');
    const formattedPhone = cleanPhone.startsWith('55')
      ? `+${cleanPhone}`
      : `+55${cleanPhone}`;

    const result = await sendOTP(formattedPhone);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'OTP enviado via WhatsApp!',
      phone: formattedPhone,
      devCode: result.devCode, // Apenas em dev mode
    });
  } catch (error) {
    console.error('Erro ao enviar OTP de teste:', error);
    return NextResponse.json(
      { success: false, error: 'Erro interno' },
      { status: 500 }
    );
  }
}
