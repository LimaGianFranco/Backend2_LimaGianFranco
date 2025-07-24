import { Router } from 'express';
import { authToken } from '../middlewares/auth.middleware.js';
import { createTicket } from '../controllers/ticket.controller.js';

const router = Router();
router.post('/checkout', authToken, createTicket);

export default router;
