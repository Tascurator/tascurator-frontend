import { type NextAuthConfig, CredentialsSignin } from 'next-auth';
import Credentials from '@auth/core/providers/credentials';
import { loginSchema } from '@/constants/schema';
import bcrypt from 'bcryptjs';
import { getLandlordByEmail } from '@/utils/prisma-helpers';
import { generateVerificationToken } from '@/utils/tokens';
import { sendEmail } from '@/lib/resend';
import { EMAILS } from '@/constants/emails';
const { SIGNUP_CONFIRMATION } = EMAILS;
class EmailNotVerifiedError extends CredentialsSignin {
  code = 'email_not_verified';
}

export default {
  providers: [
    Credentials({
      /**
       * Authorize the user based on the credentials
       * This checks if the user exists and the password is correct
       */
      authorize: async (credentials) => {
        const validatedFields = loginSchema.safeParse(credentials);

        if (validatedFields.success) {
          const { email, password } = validatedFields.data;

          const user = await getLandlordByEmail(email);

          // If the user does not exist or the email or password is not provided
          if (!user || !user.email || !user.password) return null;

          // If the user has not verified their email, throw an error
          if (!user.emailVerified) {
            const verificationToken = await generateVerificationToken(
              user.email,
            );
            await sendEmail({
              to: verificationToken.email,
              subject: SIGNUP_CONFIRMATION.subject,
              html: SIGNUP_CONFIRMATION.html(
                `${process.env.NEXT_PUBLIC_APPLICATION_URL!}/signup?token=${verificationToken.token}`,
              ),
            });
            throw new EmailNotVerifiedError();
          }

          const passwordValid = await bcrypt.compare(password, user.password);

          if (passwordValid) return user;
        }

        return null;
      },
    }),
  ],
} satisfies NextAuthConfig;
