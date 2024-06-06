import express from 'express';
import { authGuard } from '../middleware/auth.js';
import { sendMessage, getAllMessage } from '../controllers/messageController.js';

const router = express.Router()

router.post('/', authGuard, sendMessage);
router.get('/:chatId', authGuard, getAllMessage);


export default router;
