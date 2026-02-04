import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID!;
const authToken = process.env.TWILIO_AUTH_TOKEN!;
const verifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID!;

const client = twilio(accountSid, authToken);

export async function sendOTP(phone: string): Promise<{ success: boolean; error?: string }> {
  try {
    await client.verify.v2
      .services(verifyServiceSid)
      .verifications.create({
        to: phone,
        channel: 'sms',
      });

    return { success: true };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erro ao enviar OTP';
    console.error('Erro ao enviar OTP:', message);
    return { success: false, error: message };
  }
}

export async function verifyOTP(
  phone: string,
  code: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const check = await client.verify.v2
      .services(verifyServiceSid)
      .verificationChecks.create({
        to: phone,
        code,
      });

    if (check.status === 'approved') {
      return { success: true };
    }

    return { success: false, error: 'Codigo invalido' };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erro ao verificar OTP';
    console.error('Erro ao verificar OTP:', message);
    return { success: false, error: message };
  }
}
