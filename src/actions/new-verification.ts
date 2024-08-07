'use server';

import prisma from '@/lib/prisma';
import { getLandlordByEmail } from '@/utils/prisma-helpers';
import { getVerificationTokenDataByToken } from '@/utils/prisma-helpers';
import { isTokenValid } from '@/utils/tokens';
import { SERVER_ERROR_MESSAGES } from '@/constants/server-error-messages';
const {
  INVALID_TOKEN_VERIFICATION,
  EXPIRED_TOKEN_VERIFICATION,
  NOT_EXISTING_USER,
} = SERVER_ERROR_MESSAGES;

export const newVerification = async (token: string) => {
  const existingToken = await getVerificationTokenDataByToken(token);

  // Check if the token exists in the database and is valid
  if (!existingToken) {
    return { error: INVALID_TOKEN_VERIFICATION };
  }

  // Check if the token has expired
  if (!isTokenValid(token, existingToken.expiresAt)) {
    return { error: EXPIRED_TOKEN_VERIFICATION };
  }

  // Check if the user exists
  const existingUser = await getLandlordByEmail(existingToken.email);
  if (!existingUser) {
    return { error: NOT_EXISTING_USER };
  }

  // Update the user's email and emailVerified fields
  await prisma.landlord.update({
    where: { id: existingUser.id },
    data: { emailVerified: new Date() },
  });

  // Delete the verification token
  await prisma.verificationToken.delete({ where: { id: existingToken.id } });

  return { success: true };
};
