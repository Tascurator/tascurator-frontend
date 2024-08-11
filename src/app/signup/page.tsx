import Link from 'next/link';

import { Logo } from '@/components/ui/Logo';
import { Form } from '@/components/signup/Form';
import { Button } from '@/components/ui/button';
import { EmailVerificationDrawer } from '@/components/ui/drawers/auth/EmailVerificationDrawer';
import { getVerificationTokenDataByToken } from '@/utils/prisma-helpers';
import { SERVER_ERROR_MESSAGES } from '@/constants/server-error-messages';
import { InvalidTokenToast } from '@/components/ui/InvalidTokenToast';
const INVALID_TOKEN_VERIFICATION =
  SERVER_ERROR_MESSAGES.INVALID_TOKEN_VERIFICATION;

interface IForgotPasswordPageProps {
  searchParams: {
    token?: string;
  };
}
const SignUpPage = async ({ searchParams }: IForgotPasswordPageProps) => {
  const token = searchParams.token;
  let isValidToken = false;
  if (token) {
    const existingToken = await getVerificationTokenDataByToken(token);
    if (existingToken) isValidToken = true;
  }

  return (
    <>
      <div className={'flex flex-col px-6'}>
        <Logo responsive={false} />
        <Form />
        <div className="flex justify-center">
          <Button type="button" variant={'link'} asChild>
            <Link href="/login" className={'text-[1rem]'}>
              Already have an account?
            </Link>
          </Button>
        </div>
      </div>
      {token && isValidToken && <EmailVerificationDrawer token={token} />}
      {token && !isValidToken && (
        <InvalidTokenToast errorMessage={INVALID_TOKEN_VERIFICATION} />
      )}
    </>
  );
};

export default SignUpPage;
