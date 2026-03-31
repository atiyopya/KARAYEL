import { PrismaClient } from '@prisma/client';
import { parseWhatsAppMessage } from '../utils/whatsappParser.js';
import prisma from '../utils/db.js';
import { sendWhatsAppMessage, buildStatusMessage } from '../utils/whatsappNotify.js';

export const createOrder = async (req, res) => {
  const { tenantId, customerId, mockupId, items, source, totalAmount, paymentMethod, customerName, customerPhone } = req.body;

  try {
    const orderNumber = `ORD-${Date.now()}`;
    const result = await prisma.order.create({
      data: {
        orderNumber,
        tenantId,
        customerId,
        mockupId,
        source: source || 'WEB',
        totalAmount,
        paymentMethod,
        customerName: customerName || null,
        customerPhone: customerPhone || null,
        items: {
          create: items,
        },
      },
      include: { items: true },
    });

    // Send WhatsApp confirmation on order creation
    if (customerPhone) {
      try {
        const msg = buildStatusMessage(orderNumber, 'PENDING', customerName);
        await sendWhatsAppMessage(customerPhone, msg);
      } catch (waErr) {
        console.error('[WhatsApp] Failed to send order confirmation:', waErr.message);
      }
    }

    res.status(201).json({ message: 'Order created successfully', result });
  } catch (error) {
    res.status(500).json({ message: 'Error creating order', error: error.message });
  }
};

export const getOrders = async (req, res) => {
  const { tenantId } = req.query;

  try {
    const orders = await prisma.order.findMany({
      where: { tenantId },
      include: {
        items: true,
        customer: { select: { firstname: true, lastname: true, email: true } },
        mockup: { include: { variant: { include: { product: true } } } },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders', error: error.message });
  }
};

export const simulateWhatsApp = async (req, res) => {
  const { message, tenantId, customerId, mockupId } = req.body;

  try {
    const parsed = parseWhatsAppMessage(message);
    
    const items = Object.entries(parsed.sizes).map(([size, quantity]) => ({
      size,
      quantity,
    }));

    res.status(200).json({
      message: 'WhatsApp message parsed successfully',
      parsed,
      suggestedItems: items,
      totalQuantityFound: parsed.totalQuantity
    });
  } catch (error) {
    res.status(500).json({ message: 'Error simulating WhatsApp', error: error.message });
  }
};

/**
 * PATCH /api/orders/:id/status
 * Update order status and send WhatsApp notification
 */
export const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status, customerPhone, customerName, orderNumber } = req.body;

  try {
    // Send WhatsApp notification
    if (customerPhone) {
      try {
        const msg = buildStatusMessage(orderNumber || id, status, customerName);
        await sendWhatsAppMessage(customerPhone, msg);
        console.log(`[WhatsApp] Notification sent for order ${id} status: ${status}`);
      } catch (waErr) {
        console.error('[WhatsApp] Notification failed:', waErr.message);
        // Don't fail the whole request if WhatsApp fails
      }
    } else {
      // Log simulation even without phone
      const msg = buildStatusMessage(orderNumber || id, status, customerName);
      console.log('[WhatsApp SIMULATION - no phone provided]');
      console.log(msg);
    }

    res.status(200).json({ 
      message: 'Status updated and notification sent',
      orderId: id,
      newStatus: status 
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating order status', error: error.message });
  }
};
