import { NextRequest, NextResponse } from 'next/server';
import { verifyOTP } from '@/lib/twilio';
import { signIn } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { phone, code } = await request.json();

    if (!phone || !code) {
      return NextResponse.json(
        { error: 'Telefone e codigo obrigatorios' },
        { status: 400 }
      );
    }

    // Formatar telefone
    const cleanPhone = phone.replace(/\D/g, '');
    const formattedPhone = cleanPhone.startsWith('55')
      ? `+${cleanPhone}`
      : `+55${cleanPhone}`;

    // Verificar OTP no Twilio
    const result = await verifyOTP(formattedPhone, code);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Codigo invalido' },
        { status: 400 }
      );
    }

    // Fazer sign in via NextAuth (cria ou busca user)
    try {
      await signIn('phone-otp', {
        phone: formattedPhone,
        redirect: false,
      });
    } catch {
      // signIn pode lançar NEXT_REDIRECT que é esperado
    }

    return NextResponse.json({
      success: true,
      phone: formattedPhone,
    });
  } catch (error) {
    console.error('Erro em verify-otp:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
