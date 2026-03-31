import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import prisma from './utils/db.js';
import authRoutes from './routes/auth.js';
import orderRoutes from './routes/order.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/whatsapp', orderRoutes); // Reusing order routes for WhatsApp simulation

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Kareyel API is running' });
});

// Middleware for Tenant Isolation (Basic check)
app.use((req, res, next) => {
  const tenantId = req.headers['x-tenant-id'];
  if (tenantId) {
    req.tenantId = tenantId;
  }
  next();
});

app.listen(PORT, () => {
  console.log(`🚀 Kareyel Server running on port ${PORT}`);
});
