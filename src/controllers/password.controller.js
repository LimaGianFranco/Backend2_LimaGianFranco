import nodemailer from 'nodemailer';
import { UserModel } from '../dao/models/user.model.js'; 
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

const transporter = nodemailer.createTransport({
  service: 'gmail', 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000;
    await user.save();

    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    const mailOptions = {
      to: user.email,
      from: process.env.EMAIL_USER,
      subject: 'Restablece tu contraseña',
      html: `<p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p><a href="${resetLink}">Restablecer contraseña</a>`
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Correo de recuperación enviado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al enviar correo de recuperación' });
  }
};

export const resetPassword = async (req, res) => {
  const { token } = req.params; 
  const { password } = req.body;

  try {
    const user = await UserModel.findOne({ resetPasswordToken: token });
    if (!user || user.resetPasswordExpires < Date.now()) {
      return res.status(400).json({ error: 'Token inválido o expirado' });
    }

    const isSamePassword = bcrypt.compareSync(password, user.password);
    if (isSamePassword) {
      return res.status(400).json({ error: 'La nueva contraseña no puede ser la misma que la anterior' });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined; 
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: 'Contraseña restablecida con éxito' });
  } catch (error) {
    res.status(500).json({ error: 'Error al restablecer la contraseña' });
  }
};
