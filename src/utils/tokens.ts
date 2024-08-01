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

/**
 * Check if the token is valid by checking the expiration time
 *
 * @param token - The token to check
 * @param expirationTime - The expiration time of the token
 * @returns A boolean indicating if the token is valid
 */
export const isTokenValid = (token: string, expirationTime: Date) =>
  new Date() < expirationTime;
