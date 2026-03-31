import { PrismaClient } from '@prisma/client';
import { parseWhatsAppMessage } from '../utils/whatsappParser.js';
import prisma from '../utils/db.js';

export const createOrder = async (req, res) => {
  const { tenantId, customerId, mockupId, items, source, totalAmount, paymentMethod } = req.body;

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
        items: {
          create: items, // [{ size: 'XL', quantity: 5 }, { size: 'M', quantity: 2 }]
        },
      },
      include: { items: true },
    });

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
    
    // Map parsed results to OrderItem format
    const items = Object.entries(parsed.sizes).map(([size, quantity]) => ({
      size,
      quantity,
    }));

    // For simulation, we'll just return the parsed result first.
    // In a real flow, we would then call createOrder or save it directly.
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
