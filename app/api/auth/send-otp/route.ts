import { NextRequest, NextResponse } from 'next/server';
import { sendOTP } from '@/lib/zapi';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { phone } = await request.json();

    if (!phone || typeof phone !== 'string') {
      return NextResponse.json(
        { error: 'Telefone obrigatorio' },
        { status: 400 }
      );
    }

    // Formatar telefone para E.164 (+55...)
    const cleanPhone = phone.replace(/\D/g, '');
    const formattedPhone = cleanPhone.startsWith('55')
      ? `+${cleanPhone}`
      : `+55${cleanPhone}`;

    if (formattedPhone.length < 13 || formattedPhone.length > 14) {
      return NextResponse.json(
        { error: 'Telefone invalido. Use DDD + numero.' },
        { status: 400 }
      );
    }

    // Rate limit: max 3 OTPs por hora por telefone
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const recentCodes = await prisma.verificationCode.count({
      where: {
        phone: formattedPhone,
        createdAt: { gte: oneHourAgo },
      },
    });

    if (recentCodes >= 3) {
      return NextResponse.json(
        { error: 'Muitas tentativas. Tente novamente em 1 hora.' },
        { status: 429 }
      );
    }

    const result = await sendOTP(formattedPhone);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Erro ao enviar codigo' },
        { status: 500 }
      );
    }

    // Em desenvolvimento, retorna o código para facilitar testes
    const response: any = {
      success: true,
      phone: formattedPhone,
    };

    if (result.devCode && process.env.NODE_ENV === 'development') {
      response.devCode = result.devCode;
      response.message = 'MODO DEV: Código retornado na resposta para testes';
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error('Erro em send-otp:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
