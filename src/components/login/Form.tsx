'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, TLoginSchema } from '@/constants/schema';
import { login } from '@/actions/login';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormMessage } from '@/components/ui/formMessage';
import { toast } from '@/components/ui/use-toast';
import { LoadingSpinner } from '@/components/ui/loadingSpinner';
import Link from 'next/link';
import { TOAST_ERROR_MESSAGES } from '@/constants/toast-texts';

const Form = () => {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    trigger,
  } = useForm<TLoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (formData: TLoginSchema) => {
    setIsLoading(true);

    try {
      const isValid = await trigger(['email', 'password']);
      if (isValid) {
        const result = await login(formData);

        if (result?.error) {
          toast({
            variant: 'destructive',
            description: result.error,
          });
        }
        setIsLoading(false);
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        description: TOAST_ERROR_MESSAGES.LOGIN_UNKNOWN_ERROR,
      });
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && <LoadingSpinner isLoading={isLoading} />}

      <form onSubmit={handleSubmit(onSubmit)} className={'flex flex-col'}>
        <div className={'flex flex-col mb-4'}>
          <Input
            id="email"
            type="email"
            label="Email"
            {...register('email')}
            variant={errors.email ? 'destructive' : 'default'}
            autoComplete="email"
            required
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
            autoComplete="current-password"
            required
          />
          {errors.password?.message && (
            <FormMessage message={errors.password.message} />
          )}
        </div>
        <div className="flex justify-end">
          <Button
            type="button"
            variant={'link'}
            className={'mb-8 justify-end'}
            asChild
          >
            <Link href="/forgot-password">Forgot password?</Link>
          </Button>
        </div>
        <Button type="submit" className={'mx-auto mb-4'} disabled={!isValid}>
          Log in
        </Button>
        <Button
          type="button"
          className={'mx-auto'}
          variant={'secondary'}
          asChild
        >
          <Link href="/signup">Sign up</Link>
        </Button>
      </form>
    </>
  );
};

export { Form };
