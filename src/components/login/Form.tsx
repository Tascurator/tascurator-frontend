'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, TLoginSchema } from '@/constants/schema';
import { login } from '@/actions/login';
// import { logout } from '@/actions/logout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormMessage } from '@/components/ui/formMessage';

import Link from 'next/link';

// import { useSession } from 'next-auth/react';

const Form = () => {
  // const session = useSession();

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
  } = useForm<TLoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  // TODO: Implement the proper login logic
  const onSubmit = async (formData: TLoginSchema) => {
    try {
      const isValid = await trigger(['email', 'password']);
      if (isValid) {
        await login(formData);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {/* {session?.data && (
        <form action={logout}>
          <Button type={'submit'} variant={'destructive'} size={'md'}>
            Logout
          </Button>
        </form>
      )} */}
      <form onSubmit={handleSubmit(onSubmit)} className={'flex flex-col'}>
        <div className={'flex flex-col mb-4'}>
          <Input
            id="email"
            type="email"
            label="Email"
            {...register('email')}
            variant={errors.email ? 'destructive' : 'default'}
          />
          {errors.email?.message && (
            <FormMessage message={errors.email.message} />
          )}
        </div>
        <div className={'flex flex-col mb-6'}>
          <Input
            id="password"
            type="password"
            label="Password"
            {...register('password')}
            variant={errors.password ? 'destructive' : 'default'}
          />
          {errors.password?.message && (
            <FormMessage message={errors.password.message} />
          )}
        </div>
        <div className="flex justify-end">
          <Button type="button" variant={'link'} className={'mb-8 justify-end'}>
            <Link href="/forgot-password">Forgot password?</Link>
          </Button>
        </div>
        <Button type="submit" className={'mx-auto mb-4'}>
          Log in
        </Button>
        <Button type="button" className={'mx-auto'} variant={'secondary'}>
          <Link href="/signup">Sign up</Link>
        </Button>
      </form>
    </>
  );
};

export { Form };
