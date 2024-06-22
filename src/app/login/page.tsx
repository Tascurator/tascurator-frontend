'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, TLoginSchema } from '@/constants/schema';
import { login } from '@/actions/login';
import { logout } from '@/actions/logout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormMessage } from '@/components/ui/formMessage';
import { useSession } from 'next-auth/react';

const LoginPage = () => {
  const session = useSession();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TLoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (formData: TLoginSchema) => {
    try {
      await login(formData);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={'flex flex-col pt-4 gap-y-4'}>
      <div className={'flex justify-between items-center'}>
        <h2 className={'text-2xl'}>Login</h2>
        {session?.data && (
          <form action={logout}>
            <Button type={'submit'} variant={'destructive'} size={'md'}>
              Logout
            </Button>
          </form>
        )}
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className={'flex flex-col gap-y-4'}
      >
        <div className={'flex flex-col'}>
          <Input id="email" type="email" label="Email" {...register('email')} />
          {errors.email?.message && (
            <FormMessage message={errors.email.message} />
          )}
        </div>
        <div className={'flex flex-col'}>
          <Input
            id="password"
            type="password"
            label="Password"
            {...register('password')}
          />
          {errors.password?.message && (
            <FormMessage message={errors.password.message} />
          )}
        </div>
        <Button type="submit" className={'w-full'}>
          Login
        </Button>
      </form>

      <h2 className={'text-2xl pt-6'}>Session</h2>
      <pre>{JSON.stringify(session, null, 2)}</pre>
    </div>
  );
};

export default LoginPage;
