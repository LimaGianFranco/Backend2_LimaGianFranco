import { UserModel } from '../models/user.model.js';
import { isValidPassword } from '../utils/hash.js';
import { generateToken } from '../services/jwt.service.js';

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await UserModel.findOne({ email });

  if (!user || !isValidPassword(user, password)) {
    return res.status(401).json({ error: 'Credenciales inválidas' });
  }

  const token = generateToken(user);
  res.json({ token });
};

export const getCurrent = async (req, res) => {
  res.json({ user: req.user });
};
