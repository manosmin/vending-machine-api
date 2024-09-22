import express from 'express';
import { addProduct, getProducts, updateProduct, deleteProduct } from '../controllers/productController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { roleMiddleware } from '../middlewares/roleMiddleware.js';

const router = express.Router();

router.get('/', authMiddleware, getProducts);
router.post('/', authMiddleware, roleMiddleware('seller'), addProduct);
router.put('/:productId', authMiddleware, roleMiddleware('seller'), updateProduct);
router.delete('/:productId', authMiddleware, roleMiddleware('seller'), deleteProduct);

export default router;
