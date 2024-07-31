import prisma from '@/lib/prisma';

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
