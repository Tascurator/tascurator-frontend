import prisma from '@/lib/prisma';

// Get a user by their email (used for checking if a user already exists)
export const getUserByEmail = async (email: string) => {
  try {
    const user = await prisma.landlord.findUnique({
      where: { email },
    });
    return user;
  } catch (error) {
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
