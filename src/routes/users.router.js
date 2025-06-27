import { Router } from 'express';
import { registerUser, loginUser } from '../controllers/users.controller.js';
import { body } from 'express-validator';
import { validateFields } from '../middlewares/validateFields.js';
import { authToken, authorizeRoles } from '../middlewares/auth.middleware.js';

const router = Router();
router.post(
  '/register',
  [
    body('email').isEmail().withMessage('Email inválido'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('La contraseña debe tener al menos 6 caracteres'),
    validateFields, 
  ],
  registerUser
);

router.post('/login', loginUser);
router.get('/current', authToken, (req, res) => {
  res.json({ user: req.user });  
});
router.get('/admin-dashboard', authToken, authorizeRoles('admin'), (req, res) => {
  res.send('Dashboard de administrador');
});

export default router;
