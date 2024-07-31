import { v4 as uuidv4 } from 'uuid';

import prisma from '@/lib/prisma';
import { getVerificationTokenByEmail } from './prisma-helper';

export const generateVerificationToken = async (email: string) => {
  const token = uuidv4();
  // Token expires in 3 hours
  const expires = new Date(new Date().getTime() + 1000 * 60 * 60 * 3);

  const existingToken = await getVerificationTokenByEmail(email);

  // If a token already exists, delete it
  if (existingToken) {
    await prisma.verificationToken.delete({
      where: { id: existingToken.id },
    });
  }

  // Create a new verification token
  const verificationToken = await prisma.verificationToken.create({
    data: {
      token,
      email,
      expires,
    },
  });

  return verificationToken;
};
