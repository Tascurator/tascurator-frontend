import prisma from '@/lib/prisma';
import { randomUUID } from 'node:crypto';
import { getPasswordResetTokenByEmail } from '@/utils/prisma-helpers';

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
