import express from 'express';
import { getData, createUserController } from '../controllers/dataController.js';

const router = express.Router();

router.get('/data', getData);
router.post('/users', createUserController);

export default router;