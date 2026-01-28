import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: parseInt(process.env.MAIL_PORT || '587'),
  secure: process.env.MAIL_PORT === '465',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

export async function sendWelcomeEmail(email: string, name: string, verificationToken: string) {
  try {
    const verificationUrl = `${process.env.NEXTAUTH_URL}/api/auth/verify?token=${verificationToken}`;

    await transporter.sendMail({
      from: process.env.MAIL_FROM,
      to: email,
      subject: 'Verifikasi Akun - SmartLabs',
      html: `
        <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 40px auto; background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 40px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
          
          <div style="margin-bottom: 24px;">
             <h1 style="color: #111827; margin: 0; font-size: 24px; font-weight: 700;">SmartLabs</h1>
          </div>

          <p style="color: #374151; font-size: 16px; line-height: 24px; margin-bottom: 16px;">
            Halo <strong>${name}</strong>,
          </p>
          
          <p style="color: #374151; font-size: 16px; line-height: 24px; margin-bottom: 24px;">
            Terima kasih telah mendaftar di SmartLabs. Untuk mulai menggunakan semua fitur canggih kami, silakan verifikasi alamat email Anda terlebih dahulu.
          </p>

          <div style="margin: 32px 0; text-align: left;">
            <a href="${verificationUrl}" 
               style="background-color: #2563eb; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px; display: inline-block;">
              Verifikasi Email
            </a>
          </div>

          <p style="color: #6b7280; font-size: 14px; margin-bottom: 8px;">
            Atau salin tautan berikut ke browser Anda:
          </p>
          <p style="margin: 0;">
            <a href="${verificationUrl}" style="color: #2563eb; text-decoration: none; font-size: 14px; word-break: break-all;">
              ${verificationUrl}
            </a>
          </p>

          <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #f3f4f6;">
            <p style="color: #9ca3af; font-size: 12px; margin: 0; line-height: 1.5;">
              Tautan ini berlaku selama 24 jam. Jika Anda tidak merasa mendaftar di SmartLabs, silakan abaikan email ini.
            </p>
          </div>
        </div>
      `,
    });
    return { success: true };
  } catch (error) {
    console.error('Email sending failed:', error);
    return { success: false, error };
  }
}

export async function sendPasswordResetEmail(email: string, name: string, resetToken: string) {
  try {
    const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}`;

    await transporter.sendMail({
      from: process.env.MAIL_FROM,
      to: email,
      subject: 'Reset Password - SmartLabs',
      html: `
        <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 40px auto; background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 40px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
          
          <div style="margin-bottom: 24px;">
             <h1 style="color: #111827; margin: 0; font-size: 24px; font-weight: 700;">SmartLabs</h1>
          </div>

          <h2 style="color: #1f2937; font-size: 20px; font-weight: 600; margin-top: 0; margin-bottom: 16px;">
            Permintaan Reset Password
          </h2>

          <p style="color: #374151; font-size: 16px; line-height: 24px; margin-bottom: 24px;">
            Kami menerima permintaan untuk mengubah password akun Anda (<strong>${name}</strong>). Klik tombol di bawah ini untuk membuat password baru.
          </p>

          <div style="margin: 32px 0; text-align: left;">
            <a href="${resetUrl}" 
               style="background-color: #dc2626; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px; display: inline-block;">
              Reset Password
            </a>
          </div>

          <p style="color: #6b7280; font-size: 14px; margin-bottom: 8px;">
            Atau salin tautan berikut ke browser Anda:
          </p>
          <p style="margin: 0;">
            <a href="${resetUrl}" style="color: #2563eb; text-decoration: none; font-size: 14px; word-break: break-all;">
              ${resetUrl}
            </a>
          </p>

          <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #f3f4f6;">
             <p style="color: #9ca3af; font-size: 12px; margin: 0; line-height: 1.5;">
              Tautan ini berlaku selama 1 jam. Jika Anda tidak meminta reset password, abaikan email ini. Akun Anda tetap aman.
            </p>
          </div>
        </div>
      `,
    });
    return { success: true };
  } catch (error) {
    console.error('Password reset email failed:', error);
    return { success: false, error };
  }
}