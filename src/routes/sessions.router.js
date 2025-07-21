// sessions.router.js

import { Router } from 'express';
import { registerUser, loginUser, getCurrentUser } from '../controllers/users.controller.js'; // Importar getCurrentUser
import { body } from 'express-validator';
import { validateFields } from '../middlewares/validateFields.js';
import { authToken, authorizeRoles } from '../middlewares/auth.middleware.js';

const router = Router();

router.post(
  '/register',
  [
    body('first_name').notEmpty().withMessage('El nombre es obligatorio'),
    body('last_name').notEmpty().withMessage('El apellido es obligatorio'),
    body('email').isEmail().withMessage('Email inválido'),
    body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
    validateFields
  ],
  registerUser
);

router.post('/login', loginUser);

router.get('/current', authToken, getCurrentUser); // Ahora usamos la función getCurrentUser

router.get('/admin-dashboard', authToken, authorizeRoles('admin'), (req, res) => {
  res.send('Dashboard de administrador');
});

export default router;
