import { generateVerificationToken } from '@/utils/tokens';
import { sendEmail } from '@/lib/resend';
import { EMAILS } from '@/constants/emails';
const { SIGNUP_CONFIRMATION } = EMAILS;

export const sendVerificationEmail = async (email: string) => {
  const verificationToken = await generateVerificationToken(email);
  await sendEmail({
    to: verificationToken.email,
    subject: SIGNUP_CONFIRMATION.subject,
    html: SIGNUP_CONFIRMATION.html(
      `${process.env.NEXT_PUBLIC_APPLICATION_URL!}/signup?token=${verificationToken.token}`,
    ),
  });

  return verificationToken;
};
