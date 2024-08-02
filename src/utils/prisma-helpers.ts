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

export const getUserById = async (id: string) => {
  try {
    const user = await prisma.landlord.findUnique({
      where: { id },
    });
    return user;
  } catch (error) {
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
export const getVerificationTokenByToken = async (token: string) => {
  try {
    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token },
    });
    return verificationToken;
  } catch (error) {
    return null;
  }
};

export const getVerificationTokenByEmail = async (email: string) => {
  try {
    const verificationToken = await prisma.verificationToken.findFirst({
      where: { email },
    });
    return verificationToken;
  } catch (error) {
    return null;
  }
};
