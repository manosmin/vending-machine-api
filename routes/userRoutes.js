import express from 'express';
import { getUser, updateUser, deleteUser, getAllUsers } from '../controllers/userController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/profile', authMiddleware, getUser);
router.get('/', authMiddleware, getAllUsers);
router.put('/profile', authMiddleware, updateUser);
router.delete('/profile', authMiddleware, deleteUser);

export default router;
