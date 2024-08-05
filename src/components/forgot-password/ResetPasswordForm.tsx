'use client';

import { useEffect, useState } from 'react';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { resetPasswordSchema, TResetPassword } from '@/constants/schema';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FormMessage } from '@/components/ui/formMessage';

import { ValidationListItem } from '@/components/ui/ValidationListItem';
import { PASSWORD_CONSTRAINTS } from '@/constants/password-constraints';
import { CONSTRAINTS } from '@/constants/constraints';

import { toast } from '@/components/ui/use-toast';
import { PasswordChangedDrawer } from '@/components/ui/drawers/AuthenticationDrawer';
import { resetPassword } from '@/actions/forgot-password';
import { LoadingSpinner } from '@/components/ui/loadingSpinner';

const {
  PASSWORD_MIN_LENGTH,
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_CAPITAL_LETTERS,
  PASSWORD_MIN_LOWERCASE_LETTERS,
  PASSWORD_MIN_SPECIAL_CHARACTERS,
  PASSWORD_MIN_NUMBERS,
} = CONSTRAINTS;

const { minLength, length } = PASSWORD_CONSTRAINTS;

interface IResetPasswordFormProps {
  token: string;
}

const ResetPasswordForm = ({ token }: IResetPasswordFormProps) => {
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
    watch,
    reset,
  } = useForm<TResetPassword>({
    resolver: zodResolver(resetPasswordSchema),
    mode: 'onBlur',
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const password = watch('password');
  const confirmPassword = watch('confirmPassword');

  const [conditions, setConditions] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    specialChar: false,
    number: false,
    match: false,
  });

  useEffect(() => {
    setConditions({
      length:
        password.length >= PASSWORD_MIN_LENGTH &&
        password.length <= PASSWORD_MAX_LENGTH,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      specialChar: /[\W_]/.test(password),
      number: /\d/.test(password),
      match: password === confirmPassword && confirmPassword.length > 0,
    });
  }, [password, confirmPassword]);

  const ValidationListItems = [
    {
      condition: conditions.length,
      constraint: length(
        'characters long',
        PASSWORD_MIN_LENGTH,
        PASSWORD_MAX_LENGTH,
      ),
    },
    {
      condition: conditions.uppercase,
      constraint: minLength('uppercase', PASSWORD_MIN_CAPITAL_LETTERS),
    },
    {
      condition: conditions.lowercase,
      constraint: minLength('lowercase', PASSWORD_MIN_LOWERCASE_LETTERS),
    },
    {
      condition: conditions.specialChar,
      constraint: minLength(
        'special character',
        PASSWORD_MIN_SPECIAL_CHARACTERS,
      ),
    },
    {
      condition: conditions.number,
      constraint: minLength('number', PASSWORD_MIN_NUMBERS),
    },
    {
      condition: conditions.match,
      constraint: 'Passwords match.',
    },
  ];

  const onSubmit = async (formData: TResetPassword) => {
    try {
      /**
       * Wait for 1 second for user experience purposes
       */
      await new Promise((resolve) => setTimeout(resolve, 1000));

      /**
       * Reset the password and send a success email
       */
      await resetPassword(token, formData);

      setOpen(true);
      reset();
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
    <>
      <LoadingSpinner isLoading={isSubmitting} />

      <form onSubmit={handleSubmit(onSubmit)} className={'flex flex-col'}>
        {/* hidden username input ** Don't delete! It's necessary for accessibility. ** */}
        <input
          type="text"
          name="username"
          autoComplete="username"
          className="hidden"
          aria-hidden="true"
        />
        {/* End: hidden username input */}

        <div className={'flex flex-col mb-4'}>
          <Input
            id="password"
            type="password"
            label="New password"
            {...register('password')}
            variant={errors.password ? 'destructive' : 'default'}
            autoComplete="new-password"
            required
          />
          {errors.password?.message && (
            <FormMessage message={errors.password.message} />
          )}
        </div>
        <div className={'flex flex-col mb-3'}>
          <Input
            id="confirmPassword"
            type="password"
            label="Confirm password"
            {...register('confirmPassword')}
            variant={errors.confirmPassword ? 'destructive' : 'default'}
            autoComplete="new-password"
          />
          {errors.confirmPassword?.message && (
            <FormMessage message={errors.confirmPassword.message} />
          )}
        </div>
        <ul className={'mb-8'}>
          {ValidationListItems.map((item, index) => (
            <ValidationListItem
              key={index}
              condition={item.condition}
              constraint={item.constraint}
            />
          ))}
        </ul>
        <Button type="submit" disabled={!isValid} className={'mx-auto mb-4'}>
          Reset password
        </Button>
      </form>

      <PasswordChangedDrawer open={open} setOpen={setOpen} />
    </>
  );
};

export { ResetPasswordForm };
