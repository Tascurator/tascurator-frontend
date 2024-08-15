import { generateVerificationToken } from '@/utils/tokens';
import { sendEmail } from '@/lib/resend';
import { EMAILS } from '@/constants/emails';
const { SIGNUP_CONFIRMATION } = EMAILS;
import { SERVER_ERROR_MESSAGES } from '@/constants/server-error-messages';
import { getBaseUrl } from './base-url';

export const sendVerificationEmail = async (email: string) => {
  try {
    const verificationToken = await generateVerificationToken(email);
    await sendEmail({
      to: verificationToken.email,
      subject: SIGNUP_CONFIRMATION.subject,
      html: SIGNUP_CONFIRMATION.html(
        `${getBaseUrl()}/signup?token=${verificationToken.token}`,
      ),
    });
    return verificationToken;
  } catch (error) {
    throw new Error(SERVER_ERROR_MESSAGES.EMAIL_SEND_ERROR);
  }
};
