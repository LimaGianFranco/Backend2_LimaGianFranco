import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const SECRET = process.env.SECRET_JWT;

export const generateToken = (user) => {
  return jwt.sign({ user }, SECRET, { expiresIn: '24h' });
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, SECRET);
  } catch (error) {
    return null;
  }
};
