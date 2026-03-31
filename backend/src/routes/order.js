import express from 'express';
import { createOrder, getOrders, simulateWhatsApp } from '../controllers/order.js';

const router = express.Router();

router.post('/', createOrder);
router.get('/', getOrders);
router.post('/simulate', simulateWhatsApp);

export default router;
