'use client';

import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { forgotPasswordSchema, TForgotPassword } from '@/constants/schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormMessage } from '@/components/ui/formMessage';

import { useState } from 'react';
import { toast } from '@/components/ui/use-toast';
import { EmailSentDrawer } from '@/components/ui/drawers/AuthenticationDrawer';
import { sendForgotPasswordEmail } from '@/actions/forgot-password';

const ForgotPasswordRequestForm = () => {
  const [open, setOpen] = useState(false);

  const formControls = useForm<TForgotPassword>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = formControls;

  const onSubmit = async (formData: TForgotPassword) => {
    setOpen(false);

    try {
      /**
       * Wait for 1 second for user experience purposes
       */
      await new Promise((resolve) => setTimeout(resolve, 1000));

      /**
       * Send the forgot password email with generated token
       */
      await sendForgotPasswordEmail(formData);

      setOpen(true);
    } catch (error) {
      if (error instanceof Error) {
        toast({
          variant: 'destructive',
          description: error.message,
        });
      }
    }
  };

  return (
    <FormProvider {...formControls}>
      <form onSubmit={handleSubmit(onSubmit)} className={'flex flex-col'}>
        <div className={'flex flex-col mb-10'}>
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
        <Button type="submit" className={'mx-auto mb-4'} disabled={!isValid}>
          Reset password
        </Button>

        <EmailSentDrawer open={open} setOpen={setOpen} onSubmit={onSubmit} />
      </form>
    </FormProvider>
  );
};

export { ForgotPasswordRequestForm };
