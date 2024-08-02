import prisma from '@/lib/prisma';

/**
 * Get a landlord by email address
 *
 * @param email - The email address of the landlord
 * @returns A promise that resolves with the landlord
 */
export const getLandlordByEmail = async (email: string) => {
  try {
    return await prisma.landlord.findUnique({
      where: {
        email,
      },
    });
  } catch {
    return null;
  }
};

/**
 * Get a password reset token by email address
 *
 * @param email - The email address of the landlord
 * @returns A promise that resolves with the password reset token
 */
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

/**
 * Get the associated password reset token data for a given token
 *
 * @param token - The token to search for
 * @returns A promise that resolves with the password reset token data
 */
export const getPasswordResetTokenDataByToken = async (token: string) => {
  try {
    return await prisma.passwordResetToken.findUnique({
      where: {
        token,
      },
    });
  } catch {
    return null;
  }
};
