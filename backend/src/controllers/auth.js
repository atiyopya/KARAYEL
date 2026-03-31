import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../utils/db.js';

export const register = async (req, res) => {
  const { email, password, firstname, lastname, tenantName, tenantSlug } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 12);

    // Create Tenant and Admin User in a transaction
    const result = await prisma.$transaction(async (tx) => {
      const tenant = await tx.tenant.create({
        data: {
          name: tenantName,
          slug: tenantSlug,
        },
      });

      const user = await tx.user.create({
        data: {
          email,
          password: hashedPassword,
          firstname,
          lastname,
          role: 'ADMIN',
          tenantId: tenant.id,
        },
      });

      return { user, tenant };
    });

    res.status(201).json({ message: 'Tenant and Admin created successfully', result });
  } catch (error) {
    res.status(500).json({ message: 'Error registering tenant', error: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: { tenant: true },
    });

    if (!user) return res.status(404).json({ message: 'User not found' });

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { email: user.email, id: user.id, role: user.role, tenantId: user.tenantId },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '1d' }
    );

    res.status(200).json({ result: { id: user.id, email: user.email, role: user.role, tenant: user.tenant }, token });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};
