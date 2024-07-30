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
