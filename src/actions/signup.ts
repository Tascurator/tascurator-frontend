'use server';

import { signupSchema, TSignupSchema } from '@/constants/schema';
import prisma from '@/lib/prisma';
import {
  getLandlordByEmail,
  getVerificationTokenDataByToken,
} from '@/utils/prisma-helpers';
import { hashPassword } from '@/utils/password-hashing';
import { sendVerificationEmail } from '@/utils/send-email';
import { SERVER_ERROR_MESSAGES } from '@/constants/server-error-messages';
const {
  CREDENTIAL_FIELDS_INVALID,
  EXISTING_EMAIL,
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

  const tokenData = await sendVerificationEmail(existingToken.email);

  return tokenData;
};

export const resendVerificationEmailByEmail = async (email: string) => {
  const tokenData = await sendVerificationEmail(email);
  return tokenData;
};
