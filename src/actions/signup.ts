'use server';

import { signupSchema, TSignupSchema } from '@/constants/schema';
import prisma from '@/lib/prisma';
import {
  getLandlordByEmail,
  getVerificationTokenDataByToken,
} from '@/utils/prisma-helpers';
import { generateVerificationToken } from '@/utils/tokens';
import { sendEmail } from '@/lib/resend';
import { hashPassword } from '@/utils/password-hashing';
import { EMAILS } from '@/constants/emails';
const { SIGNUP_CONFIRMATION } = EMAILS;
import { SERVER_ERROR_MESSAGES } from '@/constants/server-error-messages';
const {
  CREDENTIAL_FIELDS_INVALID,
  EXISTING_EMAIL,
  NOT_EXISTING_USER,
  INVALID_TOKEN_VERIFICATION,
} = SERVER_ERROR_MESSAGES;

export const signup = async (credentials: TSignupSchema) => {
  const validatedFields = signupSchema.safeParse(credentials);

  if (!validatedFields.success) {
    return { error: CREDENTIAL_FIELDS_INVALID };
  }

  const { email, password } = validatedFields.data;

  // Check if the email is already in use
  const existingUser = await getLandlordByEmail(email);
  if (existingUser) return { error: EXISTING_EMAIL };

  const hashedPassword = await hashPassword(password);

  await prisma.landlord.create({
    data: {
      email,
      password: hashedPassword,
    },
  });

  // Send the confirmation email
  await sendVerificationEmail(email);
};

export const sendVerificationEmail = async (email: string) => {
  const verificationToken = await generateVerificationToken(email);
  await sendEmail({
    to: verificationToken.email,
    subject: SIGNUP_CONFIRMATION.subject,
    html: SIGNUP_CONFIRMATION.html(
      `${process.env.NEXT_PUBLIC_APPLICATION_URL!}/signup?token=${verificationToken.token}`,
    ),
  });
};

export const resendVerificationEmail = async (token: string) => {
  const existingToken = await getVerificationTokenDataByToken(token);

  // Check if the token exists in the database and is valid
  if (!existingToken) {
    return { error: INVALID_TOKEN_VERIFICATION };
  }

  // Check if the user exists
  const existingUser = await getLandlordByEmail(existingToken.email);
  if (!existingUser) {
    return { error: NOT_EXISTING_USER };
  }

  await sendVerificationEmail(existingToken.email);
};
