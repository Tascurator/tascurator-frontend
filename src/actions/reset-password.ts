'use server';

import { forgotPasswordSchema, TForgotPassword } from '@/constants/schema';
import { generatePasswordResetToken } from '@/utils/tokens';
import { getLandlordByEmail } from '@/utils/prisma-helper';
import { sendEmail } from '@/lib/resend';
import { EMAILS } from '@/constants/emails';

const { PASSWORD_RESET, PASSWORD_RESET_SUCCESS } = EMAILS;

export const sendForgotPasswordEmail = async (data: TForgotPassword) => {
  const validData = forgotPasswordSchema.safeParse(data);

  if (!validData.success) {
    throw new Error('Invalid data');
  }

  const doesExist = await getLandlordByEmail(data.email);

  /**
   * Even if the user does not exist, we should not show this information to the user. We pretend that the email was sent.
   */
  if (!doesExist) return;

  /**
   * Generate a password reset token for the email
   */
  const token = await generatePasswordResetToken(data.email);

  /**
   * Send the email with the token
   */
  await sendEmail({
    to: data.email,
    subject: PASSWORD_RESET.subject,
    html: PASSWORD_RESET.html(
      `${process.env.NEXT_PUBLIC_APPLICATION_URL}/reset-password?token=${token.token}`,
    ),
  });
};

export const sendPasswordResetSuccessEmail = async (email: string) => {
  await sendEmail({
    to: email,
    subject: PASSWORD_RESET_SUCCESS.subject,
    html: PASSWORD_RESET_SUCCESS.html(
      `${process.env.NEXT_PUBLIC_APPLICATION_URL}/login`,
    ),
  });
};
