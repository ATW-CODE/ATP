import express from 'express';
import authenticate from '../middleware/auth.middleware.js'; 
import { getMe } from '../controllers/user.controller.js';

const router = express.Router();

router.get('/me', authenticate, getMe);

export default router;
