import prisma from '@/lib/prisma';
import { randomUUID } from 'node:crypto';

export const generatePasswordResetToken = async (email: string) => {
  const token = randomUUID();
  const expiresAt = new Date(new Date().getTime() + 3600 * 1000); // 1 hour from now;

  const existingToken = await getPasswordResetTokenByEmail(email);

  if (existingToken) {
    await prisma.passwordResetToken.delete({
      where: {
        id: existingToken.id,
      },
    });
  }

  return prisma.passwordResetToken.create({
    data: {
      email,
      token,
      expiresAt,
    },
  });
};

export const getPasswordResetTokenByEmail = async (email: string) => {
  try {
    return await prisma.passwordResetToken.findFirst({
      where: {
        email,
      },
    });
  } catch {
    return null;
  }
};
