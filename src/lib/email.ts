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
      subject: 'Verifikasi Akun - AI Laporan Generator 🎉',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #2563eb;">Verifikasi Email Anda, ${name}!</h1>
          <p>Terima kasih telah mendaftar di AI Laporan Generator.</p>
          <p><strong>⚠️ Penting:</strong> Untuk mengaktifkan akun Anda, silakan klik tombol verifikasi di bawah ini:</p>
          
          <div style="margin: 30px 0; text-align: center;">
            <a href="${verificationUrl}" 
               style="background: #16a34a; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
              ✅ Verifikasi Email Sekarang
            </a>
          </div>
          
          <p>Atau salin link berikut ke browser Anda:</p>
          <p style="background: #f3f4f6; padding: 10px; border-radius: 5px; word-break: break-all;">
            <a href="${verificationUrl}">${verificationUrl}</a>
          </p>
          
          <hr style="margin: 30px 0;">
          <p style="color: #666; font-size: 14px;">
            <strong>Catatan:</strong> Link verifikasi ini berlaku selama 24 jam. 
            Setelah verifikasi, Anda dapat login dan mulai membuat laporan praktikum!
          </p>
          <p style="color: #666; font-size: 12px;">Jika Anda tidak mendaftar, abaikan email ini.</p>
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
      subject: 'Reset Password - AI Laporan Generator 🔐',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #dc2626;">Reset Password untuk ${name}</h1>
          <p>Kami menerima permintaan untuk reset password akun Anda.</p>
          <p><strong>⚠️ Penting:</strong> Klik tombol di bawah ini untuk reset password:</p>
          
          <div style="margin: 30px 0; text-align: center;">
            <a href="${resetUrl}" 
               style="background: #dc2626; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
              🔐 Reset Password Sekarang
            </a>
          </div>
          
          <p>Atau salin link berikut ke browser Anda:</p>
          <p style="background: #f3f4f6; padding: 10px; border-radius: 5px; word-break: break-all;">
            <a href="${resetUrl}">${resetUrl}</a>
          </p>
          
          <hr style="margin: 30px 0;">
          <p style="color: #666; font-size: 14px;">
            <strong>Catatan:</strong> Link reset password ini berlaku selama 1 jam. 
            Jika Anda tidak meminta reset password, abaikan email ini.
          </p>
          <p style="color: #666; font-size: 12px;">Untuk keamanan, jangan bagikan link ini kepada orang lain.</p>
        </div>
      `,
    });
    return { success: true };
  } catch (error) {
    console.error('Password reset email failed:', error);
    return { success: false, error };
  }
}