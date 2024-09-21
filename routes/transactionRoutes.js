import express from 'express';
import { deposit, buy, reset } from '../controllers/transactionController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { roleMiddleware } from '../middlewares/roleMiddleware.js';

const router = express.Router();

router.post('/deposit', authMiddleware, roleMiddleware('buyer'), deposit);
router.post('/buy', authMiddleware, roleMiddleware('buyer'), buy);
router.post('/reset', authMiddleware, roleMiddleware('buyer'), reset);

export default router;
