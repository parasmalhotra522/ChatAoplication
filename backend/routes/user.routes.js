import express from 'express';
import { registerUser, authUser, allUsers } from '../controllers/userController.js';
import { authGuard } from '../middleware/auth.js';
const router = express.Router();

router.get("/", authGuard, allUsers);
router.post("/register", registerUser);
router.post("/login", authUser);


export default router;


