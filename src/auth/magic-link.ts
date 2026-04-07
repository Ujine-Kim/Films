import { Resend } from 'resend';
import { findOrCreateUser, saveCode, verifyCode as dbVerifyCode } from '../db';

let resend: Resend | null = null;

function getResend() {
  if (!resend) {
    const key = process.env.RESEND_API_KEY;
    if (key) resend = new Resend(key);
  }
  return resend;
}

function generateCode(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export async function sendMagicCode(email: string): Promise<string> {
  const code = generateCode();
  await saveCode(email, code);

  const r = getResend();
  if (r) {
    await r.emails.send({
      from: 'Phenomenon Films <noreply@phenomenonfilms.art>',
      to: email,
      subject: `Your login code: ${code}`,
      html: `
        <div style="font-family: Georgia, serif; max-width: 400px; margin: 0 auto; padding: 40px 20px; color: #1a1a1a;">
          <h2 style="font-weight: normal; margin-bottom: 8px;">Phenomenon Films</h2>
          <p style="color: #666; margin-bottom: 32px;">Your verification code:</p>
          <div style="font-size: 32px; letter-spacing: 8px; font-weight: bold; text-align: center; padding: 20px; background: #f5f5f0; border-radius: 8px;">
            ${code}
          </div>
          <p style="color: #999; font-size: 13px; margin-top: 24px;">This code expires in 10 minutes.</p>
        </div>
      `,
    });
  } else {
    console.log(`[DEV] Magic code for ${email}: ${code}`);
  }
  return code;
}

export async function verifyMagicCode(email: string, code: string) {
  const valid = await dbVerifyCode(email, code);
  if (!valid) return null;
  return findOrCreateUser(email);
}
