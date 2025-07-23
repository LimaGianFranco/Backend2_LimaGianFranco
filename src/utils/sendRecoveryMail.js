import jwt from 'jsonwebtoken';
import { transporter } from '../config/email.js';

export const sendRecoveryMail = async (userEmail, userId) => {
  // Generar el token de recuperación con vencimiento de 1 hora
  const token = jwt.sign({ id: userId }, process.env.SECRET_JWT, { expiresIn: '1h' });

  // Crear el enlace para restablecer la contraseña
  const recoveryLink = `http://localhost:5173/reset-password?token=${token}`;

  try {
    // Enviar el correo
    await transporter.sendMail({
      from: `"Ecommerce" <${process.env.EMAIL_USER}>`, // Remitente
      to: userEmail, // Destinatario
      subject: 'Recuperación de contraseña', // Asunto
      html: `<p>Para restablecer tu contraseña, hacé clic en el siguiente enlace:</p>
             <a href="${recoveryLink}">${recoveryLink}</a>` // Cuerpo del correo con el enlace
    });

    console.log(`Correo de recuperación enviado a ${userEmail}`);
    return token; // Retorna el token generado en caso de éxito

  } catch (error) {
    console.error('Error al enviar correo de recuperación:', error); // Mostrar el error en la consola para depuración
    throw new Error('No se pudo enviar el correo de recuperación.'); // Lanzar error para manejarlo en el controlador
  }
};
