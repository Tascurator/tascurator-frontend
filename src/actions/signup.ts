'use server';

import { signupSchema, TSignupSchema } from '@/constants/schema';
import prisma from '@/lib/prisma';
import {
  getLandlordByEmail,
  getVerificationTokenDataByToken,
} from '@/utils/prisma-helpers';
import { hashPassword } from '@/utils/password-hashing';
import { sendVerificationEmail } from '@/utils/send-email';
import { isWithin30MinutesOfEmailSent } from '@/utils/validate-expiration-time';
import { SERVER_ERROR_MESSAGES } from '@/constants/server-error-messages';
const {
  CREDENTIAL_FIELDS_INVALID,
  EXISTING_EMAIL,
  COOL_DOWN_EMAIL_VERIFICATION,
  INVALID_TOKEN_VERIFICATION,
} = SERVER_ERROR_MESSAGES;

export const signup = async (credentials: TSignupSchema) => {
  const validatedFields = signupSchema.safeParse(credentials);

  if (!validatedFields.success) {
    throw new Error(CREDENTIAL_FIELDS_INVALID);
  }

  const { email, password } = validatedFields.data;

  // Check if the email is already in use
  const existingUser = await getLandlordByEmail(email);
  if (existingUser) throw new Error(EXISTING_EMAIL);

  const hashedPassword = await hashPassword(password);

  await prisma.landlord.create({
    data: {
      email,
      password: hashedPassword,
    },
  });

  // Send the confirmation email
  const tokenData = await sendVerificationEmail(email);
  return tokenData;
};

export const resendVerificationEmailByToken = async (token: string) => {
  const existingToken = await getVerificationTokenDataByToken(token);

  // Check if the token exists in the database and is valid
  if (!existingToken) {
    throw new Error(INVALID_TOKEN_VERIFICATION);
  }

  // Check if the token is still valid and 30 minutes have passed since the last email was sent
  if (existingToken && isWithin30MinutesOfEmailSent(existingToken.expiresAt)) {
    throw new Error(COOL_DOWN_EMAIL_VERIFICATION);
  }

  const tokenData = await sendVerificationEmail(existingToken.email);
  const newToken = tokenData.token;

  return { token: newToken };
};

export const resendVerificationEmailByEmail = async (email: string) => {
  const tokenData = await sendVerificationEmail(email);
  return tokenData;
};
