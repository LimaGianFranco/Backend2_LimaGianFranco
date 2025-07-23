import { UserModel } from '../dao/models/user.model.js';
import { isValidPassword, createHash } from '../utils/hash.js';
import { generateToken } from '../services/jwt.service.js';
import { sendRecoveryMail } from '../utils/sendRecoveryMail.js';
import UserDTO from '../dto/user.dto.js';

export const registerUser = async (req, res) => {
  const { first_name, last_name, email, password, role } = req.body;

  try {
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'El usuario ya está registrado' });
    }

    const hashedPassword = createHash(password);
    const newUser = new UserModel({
      first_name,
      last_name,
      email,
      password: hashedPassword,
      role: role || 'user', 
    });

    await newUser.save();
    const token = generateToken(newUser);
    res.status(201).json({ message: 'Usuario registrado exitosamente', token });
  } catch (error) {
    res.status(500).json({ error: 'Error al procesar la solicitud de registro' });
  }
};

export const registerAdmin = async (req, res) => {
  const { first_name, last_name, email, password } = req.body;

  try {
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'El usuario ya está registrado' });
    }

    const hashedPassword = createHash(password);
    const newAdmin = new UserModel({
      first_name,
      last_name,
      email,
      password: hashedPassword,
      role: 'admin',
    });

    await newAdmin.save();
    const token = generateToken(newAdmin);
    res.status(201).json({ message: 'Administrador registrado exitosamente', token });
  } catch (error) {
    res.status(500).json({ error: 'Error al procesar la solicitud de registro de admin' });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await UserModel.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Usuario no encontrado' });

    const passwordIsValid = isValidPassword(user, password);
    if (!passwordIsValid) return res.status(401).json({ error: 'Credenciales inválidas' });

    const token = generateToken(user);
    res.json({ message: 'Login exitoso', token });
  } catch (error) {
    res.status(500).json({ error: 'Error al procesar la solicitud de login' });
  }
};

export const getCurrent = async (req, res) => {
  if (!req.user) return res.status(401).json({ error: 'No autorizado' });

  const userDTO = new UserDTO(req.user);
  res.json({ user: userDTO });
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await UserModel.findOne({ email });
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    await sendRecoveryMail(user.email, user._id);
    res.status(200).json({ message: 'Correo de recuperación enviado' });
  } catch (err) {
    res.status(500).json({ error: 'Error al enviar correo de recuperación' });
  }
};
