import Link from 'next/link';

import { Logo } from '@/components/ui/Logo';
import { Form } from '@/components/signup/Form';
import { Button } from '@/components/ui/button';
import { EmailVerificationDrawer } from '@/components/ui/drawers/EmailVerificationDrawer';
interface IForgotPasswordPageProps {
  searchParams: {
    token?: string;
  };
}
const SignUpPage = ({ searchParams }: IForgotPasswordPageProps) => {
  const token = searchParams.token;

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
      {token && <EmailVerificationDrawer token={token} />}
    </>
  );
};

export default SignUpPage;
