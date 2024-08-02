'use server';

import { signupSchema, TSignupSchema } from '@/constants/schema';
import prisma from '@/lib/prisma';
import { getLandlordByEmail } from '@/utils/prisma-helpers';
import { generateVerificationToken } from '@/utils/tokens';
import { sendEmail } from '@/lib/resend';
import { EMAILS } from '@/constants/emails';
const { SIGNUP_CONFIRMATION } = EMAILS;
import { TOAST_ERROR_MESSAGES } from '@/constants/toast-texts';
import { hashPassword } from '@/utils/password-hashing';
const { CREDENTIAL_FIELDS_INVALID, EXISTING_EMAIL } = TOAST_ERROR_MESSAGES;

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
  const verificationToken = await generateVerificationToken(email);
  await sendEmail({
    to: verificationToken.email,
    subject: SIGNUP_CONFIRMATION.subject,
    html: SIGNUP_CONFIRMATION.html(
      `${process.env.NEXT_PUBLIC_APPLICATION_URL!}/signup?token=${verificationToken.token}`,
    ),
  });

  return { success: 'Confirmation email sent.' };
};
