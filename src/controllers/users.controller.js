import { UserModel } from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const registerUser = async (req, res) => {
  const { first_name, last_name, email, age, password } = req.body;

  try {
    const exists = await UserModel.findOne({ email });
    if (exists) {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = await UserModel.create({
      first_name,
      last_name,
      email,
      age,
      password: hashedPassword,
    });

    console.log('Usuario creado:', newUser);

    res.status(201).json({
      message: 'Usuario creado exitosamente',
      user: {
        first_name: newUser.first_name,
        last_name: newUser.last_name,
        email: newUser.email,
        age: newUser.age,
        role: newUser.role, 
      }
    });
  } catch (err) {
    console.error('Error al registrar usuario:', err);
    res.status(500).json({ error: 'Error al registrar el usuario. Intenta de nuevo más tarde.' });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Usuario no encontrado' });
    }

    const passwordValid = bcrypt.compareSync(password, user.password);
    if (!passwordValid) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role }, 
      process.env.JWT_SECRET,
      { expiresIn: '1h' } 
    );
    res.status(200).json({
      message: 'Login exitoso',
      token,
    });

  } catch (error) {
    console.error(' Error en login:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};
