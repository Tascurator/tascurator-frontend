import { type NextAuthConfig, CredentialsSignin } from 'next-auth';
import Credentials from '@auth/core/providers/credentials';
import { loginSchema } from '@/constants/schema';
import bcrypt from 'bcryptjs';
import {
  getLandlordByEmail,
  getVerificationTokenByEmail,
} from '@/utils/prisma-helpers';
import { sendVerificationEmail } from '@/utils/send-email';
import { isWithin30MinutesOfEmailSent } from '@/utils/validate-expiration-time';
class EmailNotVerifiedError extends CredentialsSignin {
  code = 'email_not_verified';
}

class EmailNotVerifiedCoolDownError extends CredentialsSignin {
  code = 'email_not_verified_cooldown';
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
          if (!user) return null;

          // If the user has not verified their email, throw an error
          if (!user.emailVerified) {
            const verificationToken = await getVerificationTokenByEmail(email);
            // if expiresAt is less than 30 mins ago, don't send a new verification email and just show the error
            if (
              verificationToken &&
              isWithin30MinutesOfEmailSent(verificationToken.expiresAt)
            ) {
              throw new EmailNotVerifiedCoolDownError();
            } else {
              await sendVerificationEmail(user.email);
              throw new EmailNotVerifiedError();
            }
          }

          const passwordValid = await bcrypt.compare(password, user.password);

          if (passwordValid) return user;
        }

        return null;
      },
    }),
  ],
} satisfies NextAuthConfig;
