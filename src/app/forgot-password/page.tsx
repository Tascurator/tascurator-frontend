import Link from 'next/link';

import { Logo } from '@/components/ui/Logo';
import { Form } from '@/components/forgot-password/Form';
import { Button } from '@/components/ui/button';

const ForgotPasswordPage = () => {
  return (
    <div className={'flex flex-col px-6'}>
      <Logo />
      <div className={'mb-6'}>
        <h1 className={'text-2xl font-bold text-center mb-3'}>
          Forgot your password?
        </h1>
        <p className={'text-center'}>
          Enter your email address and we will send you information to reset
          your password.
        </p>
      </div>
      <Form />
      <div className="flex justify-center">
        <Button type="button" variant={'link'}>
          <Link href="/login" className={'text-[1rem]'}>
            Back to log in
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
