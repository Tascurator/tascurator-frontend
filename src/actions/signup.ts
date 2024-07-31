'use server';

import { signupSchema, TSignupSchema } from '@/constants/schema';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { getUserByEmail } from '@/utils/prisma-helper';
import { generateVerificationToken } from '@/utils/tokens';
import { TOAST_ERROR_MESSAGES } from '@/constants/toast-texts';
const { CREDENTIAL_FIELDS_INVALID, EXISTING_EMAIL } = TOAST_ERROR_MESSAGES;

export const signup = async (credentials: TSignupSchema) => {
  const validatedFields = signupSchema.safeParse(credentials);

  if (!validatedFields.success) {
    return { error: CREDENTIAL_FIELDS_INVALID };
  }

  const { email, password } = validatedFields.data;

  // Check if the email is already in use
  const existingUser = await getUserByEmail(email);
  if (existingUser) return { error: EXISTING_EMAIL };

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.landlord.create({
    data: {
      email,
      password: hashedPassword,
    },
  });

  const verificationToken = await generateVerificationToken(email);
  console.log(verificationToken);
  // TODO: Send an email to the user

  return { success: 'Confirmation email sent.' };
};
