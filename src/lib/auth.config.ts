import { type NextAuthConfig, CredentialsSignin } from 'next-auth';
import Credentials from '@auth/core/providers/credentials';
import { loginSchema } from '@/constants/schema';
import bcrypt from 'bcryptjs';
import { getUserByEmail } from '@/utils/prisma-helper';
import { generateVerificationToken } from '@/utils/tokens';
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

          const user = await getUserByEmail(email);

          // If the user does not exist or the email or password is not provided
          if (!user || !user.email || !user.password) return null;

          // If the user has not verified their email, throw an error
          if (!user.emailVerified) {
            const verificationToken = await generateVerificationToken(
              user.email,
            );
            console.log(verificationToken);
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
