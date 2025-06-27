import { Router } from 'express';
import { login, getCurrent } from '../controllers/sessions.controller.js';
import { authToken } from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/login', login);
router.get('/current', authToken, getCurrent);

export default router;
