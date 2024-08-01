import Link from 'next/link';

import { Logo } from '@/components/ui/Logo';
import { ForgotPasswordRequestForm } from '@/components/forgot-password/ForgotPasswordRequestForm';
import { Button } from '@/components/ui/button';
import { getPasswordResetDataByToken } from '@/utils/prisma-helpers';
import { ResetPasswordForm } from '@/components/forgot-password/ResetPasswordForm';
import { isTokenValid } from '@/utils/tokens';
import { InvalidTokenToast } from '@/components/forgot-password/InvalidTokenToast';

interface IForgotPasswordPageProps {
  searchParams: {
    token?: string;
  };
}

const ForgotPasswordPage = async ({
  searchParams,
}: IForgotPasswordPageProps) => {
  const token = searchParams.token;
  let expired = true;

  /**
   * If token is present in the URL, we will show the reset password form.
   */
  if (token) {
    /**
     * Firstly, check if the token does exist in the database
     */
    const data = await getPasswordResetDataByToken(token);

    /**
     * If token is valid, let's display the reset password form
     */
    if (data && isTokenValid(token, data.expiresAt)) {
      /**
       * Set expired to false if the token is valid
       */
      expired = false;

      return (
        <div className={'flex flex-col px-6'}>
          {/* hide logo on mobile and show on tablet & laptop */}
          <Logo responsive={true} />
          <div className={'mb-6 mt-24 md:mt-0'}>
            <h1 className={'text-2xl font-bold text-center mb-3'}>
              Reset your password
            </h1>
            <p className={'text-center'}>Please enter a new password.</p>
          </div>
          <ResetPasswordForm token={token} />
        </div>
      );
    }
  }

  return (
    <div className={'flex flex-col px-6'}>
      {/* hide logo on mobile and show on tablet & laptop */}
      <Logo responsive={true} />
      <div className={'mb-6 mt-24 md:mt-0'}>
        <h1 className={'text-2xl font-bold text-center mb-3'}>
          Forgot your password?
        </h1>
        <p className={'text-center'}>
          Enter your email address and we will send you information to reset
          your password.
        </p>
      </div>
      <ForgotPasswordRequestForm />
      <div className="flex justify-center">
        <Button type="button" variant={'link'}>
          <Link href="/login" className={'text-[1rem]'}>
            Back to log in
          </Link>
        </Button>
      </div>

      {/* Display error toast if token is invalid or expired */}
      {expired && <InvalidTokenToast />}
    </div>
  );
};

export default ForgotPasswordPage;
