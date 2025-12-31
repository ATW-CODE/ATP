import express from 'express';
import authenticate from '../middleware/auth.middleware.js';
import { getPrinters } from '../controllers/printer.controller.js';

const router = express.Router();

router.get("/", authenticate, getPrinters);

export default router;
