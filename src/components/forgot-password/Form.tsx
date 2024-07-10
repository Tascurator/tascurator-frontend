'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { forgotPasswordSchema, TForgotPassword } from '@/constants/schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormMessage } from '@/components/ui/formMessage';

import { useState } from 'react';
import { LoadingSpinner } from '../ui/loadingSpinner';
import { toast } from '@/components/ui/use-toast';
import { EmailSentDrawer } from '@/components/ui/drawers/AuthenticationDrawer';

const Form = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
  } = useForm<TForgotPassword>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  // TODO: Implement the proper forgot password logic
  const onSubmit = async (formData: TForgotPassword) => {
    setIsLoading(true);

    try {
      const isValid = await trigger(['email']);

      if (isValid) {
        console.log('Form data:', formData);

        // submit the form data
        await new Promise((resolve) => setTimeout(resolve, 1000));
        // await forgotPassword(formData);
        // Send the email to the user with the reset password link

        setIsLoading(false);
        setOpen(true);
      }
    } catch (error) {
      console.error(error);
      setIsLoading(false);
      // TODO: modify the error message
      toast({
        variant: 'destructive',
        description: 'error!',
      });
    }
  };

  return (
    <>
      {isLoading && <LoadingSpinner isLoading={true} />}
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
      <EmailSentDrawer open={open} setOpen={setOpen} />
    </>
  );
};

export { Form };
