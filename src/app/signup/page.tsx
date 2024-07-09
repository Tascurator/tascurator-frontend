import Link from 'next/link';

import { Logo } from '@/components/ui/Logo';
import { Form } from '@/components/signup/Form';
import { Button } from '@/components/ui/button';

const SignUpPage = () => {
  return (
    <div className={'flex flex-col'}>
      <Logo />
      <Form />
      <div className="flex justify-center">
        <Button type="button" variant={'link'} className={'mb-8'}>
          <Link href="/login" className={'text-[1rem]'}>
            Already have an account?
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default SignUpPage;
