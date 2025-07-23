import { UserModel } from '../dao/models/user.model.js';
import { createHash } from '../utils/hash.js';
import { generateToken } from '../services/jwt.service.js';

export const registerUser = async (req, res) => {
  const { first_name, last_name, email, password } = req.body;

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
      role: 'user', 
    });

    await newUser.save();
    const token = generateToken(newUser);

    res.status(201).json({ message: 'Usuario registrado exitosamente', token });
  } catch (error) {
    console.error('Error al registrar el usuario:', error);
    res.status(500).json({ error: 'Error al procesar la solicitud de registro' });
  }
};
export const registerAdmin = async (req, res) => {
  const { first_name, last_name, email, password } = req.body;

  try {
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'El administrador ya está registrado' });
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
    console.error('Error al registrar el administrador:', error);
    res.status(500).json({ error: 'Error al procesar la solicitud de registro de admin' });
  }
};
