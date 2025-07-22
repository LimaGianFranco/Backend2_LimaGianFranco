import { Router } from 'express';
import { body } from 'express-validator';
import { sendResetPasswordEmail, resetPassword } from '../controllers/resetPassword.controller.js';
import { validateFields } from '../middlewares/validateFields.js';

const router = Router();

router.post(
  '/forgot-password',
  [body('email').isEmail().withMessage('Email inválido'), validateFields],
  sendResetPasswordEmail
);

router.post(
  '/reset-password/:token',
  [
    body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
    validateFields
  ],
  resetPassword
);

export default router;
