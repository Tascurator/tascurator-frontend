import { generateVerificationToken } from '@/utils/tokens';
import { sendEmail } from '@/lib/resend';
import { SERVER_ERROR_MESSAGES } from '@/constants/server-error-messages';
import { getBaseUrl } from '@/utils/base-url';

export const sendVerificationEmail = async (email: string) => {
  try {
    const verificationToken = await generateVerificationToken(email);
    await sendEmail({
      to: verificationToken.email,
      type: 'SIGNUP_CONFIRMATION',
      callbackUrl: `${getBaseUrl()}/signup?token=${verificationToken.token}`,
    });
    return verificationToken;
  } catch (error) {
    throw new Error(SERVER_ERROR_MESSAGES.EMAIL_SEND_ERROR);
  }
};
