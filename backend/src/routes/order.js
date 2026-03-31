import express from 'express';
import { createOrder, getOrders, simulateWhatsApp, updateOrderStatus } from '../controllers/order.js';

const router = express.Router();

router.post('/', createOrder);
router.get('/', getOrders);
router.patch('/:id/status', updateOrderStatus);
router.post('/simulate', simulateWhatsApp);

export default router;
