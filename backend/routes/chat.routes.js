import express from 'express';
import { authGuard } from '../middleware/auth.js';
import { accessChats, fetchAllChats, createGroupChat, renameGroup, addToGroup, removeUserFromGroup } from '../controllers/chatController.js';

const router = express.Router();
// --- Creating one on one chat a message to the Chat ---
router.post('/', authGuard, accessChats);


// --- Retreive all the Chat Data ---
router.get('/', authGuard, fetchAllChats)


// --- Create a Group Chat ---
router.post('/createGroup', authGuard, createGroupChat)

// ---  Rename Group Chat ---
router.put('/renameGroup' , authGuard, renameGroup)

// --- Add a new Member to the Group ---
router.put('/addToGroup', authGuard, addToGroup)

// --- Remove a member from the Group
router.put('/removeMemberFromGroup', authGuard, removeUserFromGroup);

export default router;