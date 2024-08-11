'use server';

import {
  forgotPasswordSchema,
  resetPasswordSchema,
  TForgotPassword,
  TResetPassword,
} from '@/constants/schema';
import { generatePasswordResetToken, isTokenValid } from '@/utils/tokens';
import {
  getLandlordByEmail,
  getPasswordResetTokenDataByToken,
} from '@/utils/prisma-helpers';
import { sendEmail } from '@/lib/resend';
import { EMAILS } from '@/constants/emails';
import prisma from '@/lib/prisma';
import { hashPassword } from '@/utils/password-hashing';
import { SERVER_ERROR_MESSAGES } from '@/constants/server-error-messages';

const { PASSWORD_RESET, PASSWORD_RESET_SUCCESS } = EMAILS;

const { INVALID_TOKEN_RESET_PASSWORD, COMPLETION_ERROR } =
  SERVER_ERROR_MESSAGES;

/**
 * Send email to the landlord with a link to reset their password
 *
 * @param data - The object containing the email address
 */
export const sendForgotPasswordEmail = async (data: TForgotPassword) => {
  const validData = forgotPasswordSchema.safeParse(data);

  if (!validData.success) {
    throw new Error(COMPLETION_ERROR('sending the email'));
  }

  const doesExist = await getLandlordByEmail(data.email);

  /**
   * Even if the landlord does not exist, we should not show this information to the landlord. We pretend that the email was sent.
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

/**
 * Reset the landlord's password with the token and given data
 *
 * @param token - The token that was sent to the landlord
 * @param data - The object containing the new password
 */
export const resetPassword = async (token: string, data: TResetPassword) => {
  const validData = resetPasswordSchema.safeParse(data);

  if (!validData.success) {
    throw new Error(COMPLETION_ERROR('resetting the password'));
  }

  /**
   * Find the token in the database
   */
  const tokenData = await getPasswordResetTokenDataByToken(token);

  /**
   * If the token does not exist or is expired, throw an error
   */
  if (!tokenData || !isTokenValid(token, tokenData.expiresAt)) {
    throw new Error(INVALID_TOKEN_RESET_PASSWORD);
  }

  try {
    const deletedTokenData = await prisma.$transaction(async (prisma) => {
      /**
       * Hash the new password
       */
      const hashedPassword = await hashPassword(data.password);

      /**
       * Update the landlord's password
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
    throw new Error(COMPLETION_ERROR('resetting the password'));
  }
};

/**
 * Send email to the landlord that their password was successfully reset
 *
 * @param email - The email address of the landlord
 */
export const sendPasswordResetSuccessEmail = async (email: string) => {
  await sendEmail({
    to: email,
    subject: PASSWORD_RESET_SUCCESS.subject,
    html: PASSWORD_RESET_SUCCESS.html(
      `${process.env.NEXT_PUBLIC_APPLICATION_URL}/login`,
    ),
  });
};
