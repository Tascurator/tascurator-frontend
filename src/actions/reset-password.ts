'use server';

import {
  forgotPasswordSchema,
  resetPasswordSchema,
  TForgotPassword,
  TResetPassword,
} from '@/constants/schema';
import { generatePasswordResetToken } from '@/utils/tokens';
import {
  getLandlordByEmail,
  getPasswordResetDataByToken,
} from '@/utils/prisma-helpers';
import { sendEmail } from '@/lib/resend';
import { EMAILS } from '@/constants/emails';
import prisma from '@/lib/prisma';
import { hashPassword } from '@/utils/password-hashing';

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
      `${process.env.NEXT_PUBLIC_APPLICATION_URL}/forgot-password?token=${token.token}`,
    ),
  });
};

export const resetPassword = async (token: string, data: TResetPassword) => {
  const validData = resetPasswordSchema.safeParse(data);

  if (!validData.success) {
    throw new Error('Invalid data');
  }

  /**
   * Find the token in the database
   */
  const tokenData = await getPasswordResetDataByToken(token);

  /**
   * If the token does not exist or is expired, throw an error
   */
  if (!tokenData || tokenData.expiresAt < new Date()) {
    throw new Error('Invalid or expired token');
  }

  try {
    const deletedTokenData = await prisma.$transaction(async (prisma) => {
      /**
       * Hash the new password
       */
      const hashedPassword = await hashPassword(data.password);

      /**
       * Update the user's password
       */
      await prisma.landlord.update({
        where: {
          email: tokenData.email,
        },
        data: {
          password: hashedPassword,
        },
      });

      return prisma.passwordResetToken.delete({
        where: {
          id: tokenData.id,
        },
      });
    });

    /**
     * Send a success email
     */
    await sendPasswordResetSuccessEmail(deletedTokenData.email);
  } catch (error) {
    throw new Error('Failed to reset password');
  }
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
