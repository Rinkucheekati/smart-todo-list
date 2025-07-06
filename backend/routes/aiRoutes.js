import express from 'express';
import { getSuggestions } from '../controllers/aiController.js';

const router = express.Router();

router.get('/suggestions', getSuggestions);

export default router; 