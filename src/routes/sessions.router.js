import { Router } from 'express';
import { 
  registerUser, 
  registerAdmin, 
  login, 
  getCurrent 
} from '../controllers/sessions.controller.js'; 

import { 
  forgotPassword, 
  resetPassword 
} from '../controllers/password.controller.js';

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

router.post('/register-admin', registerAdmin);
router.post('/login', login);
router.get('/current', authToken, getCurrent);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.get(
  '/admin-dashboard',
  authToken,
  authorizeRoles('admin'),
  (req, res) => {
    res.send('Dashboard de administrador');
  }
);

export default router;
