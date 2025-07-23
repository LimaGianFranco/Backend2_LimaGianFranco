import { Router } from 'express';
import { getAllProducts, addProduct, deleteProduct, updateProduct } from '../controllers/product.controller.js';
import { authToken, authorizeRoles } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/', getAllProducts);

router.post('/', authToken, authorizeRoles('admin'), addProduct);

router.delete('/:id', authToken, authorizeRoles('admin'), deleteProduct);

router.put('/:id', authToken, authorizeRoles('admin'), updateProduct);

export default router;
