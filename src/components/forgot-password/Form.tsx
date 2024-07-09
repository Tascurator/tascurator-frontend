'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { forgotPasswordSchema, TForgotPassword } from '@/constants/schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormMessage } from '@/components/ui/formMessage';

const Form = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
  } = useForm<TForgotPassword>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  // TODO: Implement the proper forgot password logic
  // param: formData: TForgotPassword
  const onSubmit = async () => {
    try {
      const isValid = await trigger(['email']);
      if (isValid) {
        // await forgotPassword(formData);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className={'flex flex-col'}>
        <div className={'flex flex-col mb-10'}>
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
        <Button type="submit" className={'mx-auto mb-4'}>
          Reset password
        </Button>
      </form>
    </>
  );
};

export { Form };
