import express from 'express';
import { getContexts, createContext, updateContext, deleteContext } from '../controllers/contextController.js';
import { processContext } from '../controllers/aiController.js';

const router = express.Router();

router.get('/', getContexts);
router.post('/', createContext);
router.put('/:id', updateContext);
router.delete('/:id', deleteContext);
router.post('/:id/process', processContext);

export default router; 