import { Router } from 'express';
import { authToken } from '../middlewares/auth.middleware.js';
import { addToCart, getCart } from '../controllers/cart.controller.js';
import { createTicket } from '../controllers/ticket.controller.js';

const router = Router();

router.post('/add-to-cart', authToken, addToCart);
router.get('/', authToken, getCart); 
router.post('/checkout', authToken, createTicket);

export default router;
