import prisma from '@/lib/prisma';
import { randomUUID } from 'node:crypto';
import { CONSTRAINTS } from '@/constants/constraints';
import { getPasswordResetTokenByEmail } from '@/utils/prisma-helpers';

export const generatePasswordResetToken = async (email: string) => {
  const token = randomUUID();
  const expiresAt = new Date(
    new Date().getTime() + CONSTRAINTS.PASSWORD_RESET_TOKEN_EXPIRATION_TIME,
  );

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
