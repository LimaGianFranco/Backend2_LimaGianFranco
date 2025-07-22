import { ResetPasswordToken } from '../models/resetPasswordToken.model.js';
import { UserModel } from '../models/user.model.js';
import bcrypt from 'bcryptjs';

export const sendResetPasswordEmail = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const token = crypto.randomBytes(32).toString('hex');
    const resetPasswordToken = new ResetPasswordToken({
      userId: user._id,
      token,
    });
    await resetPasswordToken.save();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const resetLink = `http://localhost:8080/reset-password/${token}`;
    
    await transporter.sendMail({
      from: 'no-reply@ecommerce.com',
      to: email,
      subject: 'Restablecer contraseña',
      text: `Haz clic en el siguiente enlace para restablecer tu contraseña: ${resetLink}`,
    });

    res.status(200).json({ message: 'Correo de recuperación enviado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al enviar correo' });
  }
};

export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const resetToken = await ResetPasswordToken.findOne({ token });
    if (!resetToken) {
      return res.status(400).json({ error: 'Token de recuperación no válido o expirado' });
    }

    const user = await UserModel.findById(resetToken.userId);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    if (bcrypt.compareSync(password, user.password)) {
      return res.status(400).json({ error: 'No puedes restablecer la contraseña a la misma que tenías' });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    user.password = hashedPassword;
    await user.save();
    await resetToken.delete(); 

    res.status(200).json({ message: 'Contraseña restablecida exitosamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al restablecer la contraseña' });
  }
};
