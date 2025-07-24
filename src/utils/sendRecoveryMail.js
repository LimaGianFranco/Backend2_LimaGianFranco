import jwt from 'jsonwebtoken';
import { transporter } from '../config/email.js';

export const sendRecoveryMail = async (userEmail, userId) => {
  const token = jwt.sign({ id: userId }, process.env.SECRET_JWT, { expiresIn: '1h' });
  const recoveryLink = `http://localhost:5173/reset-password?token=${token}`;

  try {
   
    await transporter.sendMail({
      from: `"Ecommerce" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: 'Recuperación de contraseña', 
      html: `<p>Para restablecer tu contraseña, hacé clic en el siguiente enlace:</p>
             <a href="${recoveryLink}">${recoveryLink}</a>` 
    });

    console.log(`Correo de recuperación enviado a ${userEmail}`);
    return token;

  } catch (error) {
    console.error('Error al enviar correo de recuperación:', error); 
    throw new Error('No se pudo enviar el correo de recuperación.');
  }
};
