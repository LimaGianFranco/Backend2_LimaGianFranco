import { UserModel } from '../dao/models/user.model.js';
import { sendRecoveryMail } from '../services/emailService.js';
import { createHash } from '../utils/hash.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
export const sendResetPasswordEmail = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    await sendRecoveryMail(user.email, user._id);
    res.status(200).json({ message: 'Correo de recuperación enviado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al enviar correo de recuperación' });
  }
};
export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.SECRET_JWT);
    const user = await UserModel.findById(decoded.id);
    if (!user) {
      return res.status(400).json({ error: 'Usuario no encontrado' });
    }

    if (user.resetPasswordExpires < Date.now()) {
      return res.status(400).json({ error: 'Token expirado' });
    }

    const isSamePassword = bcrypt.compareSync(password, user.password);
    if (isSamePassword) {
      return res.status(400).json({ error: 'La nueva contraseña no puede ser la misma que la anterior' });
    }

    const hashedPassword = createHash(password);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: 'Contraseña restablecida con éxito' });
  } catch (error) {
    res.status(500).json({ error: 'Error al restablecer la contraseña' });
  }
};
