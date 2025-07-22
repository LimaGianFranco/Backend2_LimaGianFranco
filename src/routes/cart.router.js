import { Router } from 'express';
import { authToken } from '../middlewares/auth.middleware.js';
import { addToCart } from '../controllers/cart.controller.js';
import { checkout } from '../controllers/ticket.controller.js';

const router = Router();

router.post('/add-to-cart', authToken, addToCart);
router.post('/checkout', authToken, checkout);

export default router;
