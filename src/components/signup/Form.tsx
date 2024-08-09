'use client';

import { useEffect, useState } from 'react';

import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signupSchema, TSignupSchema } from '@/constants/schema';
import { signup, resendVerificationEmailByEmail } from '@/actions/signup';
import { Input } from '@/components/ui/input';
import { FormMessage } from '@/components/ui/formMessage';

import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loadingSpinner';
import { toast } from '@/components/ui/use-toast';

import { ValidationListItem } from '@/components/ui/ValidationListItem';
import { PASSWORD_CONSTRAINTS } from '@/constants/password-constraints';
import { TOAST_ERROR_MESSAGES } from '@/constants/toast-texts';
import { EmailSentDrawer } from '../ui/drawers/auth/AuthenticationDrawer';
import { isWithin30MinutesOfEmailSent } from '@/utils/validate-expiration-time';
import { CONSTRAINTS } from '@/constants/constraints';
const {
  PASSWORD_MIN_LENGTH,
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_CAPITAL_LETTERS,
  PASSWORD_MIN_LOWERCASE_LETTERS,
  PASSWORD_MIN_SPECIAL_CHARACTERS,
  PASSWORD_MIN_NUMBERS,
} = CONSTRAINTS;

const { minLength, length } = PASSWORD_CONSTRAINTS;

interface ITokenData {
  id: string;
  email: string;
  token: string;
  expiresAt: Date;
}

const Form = () => {
  const [open, setOpen] = useState(false);
  const [tokenData, setTokenData] = useState({} as ITokenData);
  const [emailSent, setEmailSent] = useState(false);

  const formControls = useForm<TSignupSchema>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onBlur',
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
    watch,
  } = formControls;

  const password = watch('password');

  const [conditions, setConditions] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    specialChar: false,
    number: false,
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
    });
  }, [password]);

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
  ];

  const onSubmit = async (formData: TSignupSchema) => {
    try {
      /**
       * Wait for 1 second for user experience purposes
       */
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // if email is already sent, resend the email
      if (
        emailSent &&
        tokenData &&
        isWithin30MinutesOfEmailSent(tokenData.expiresAt)
      ) {
        // if email is already sent and within 30 minutes, show error message
        toast({
          variant: 'destructive',
          description: TOAST_ERROR_MESSAGES.EMAIL_NOT_VERIFIED_COOLDOWN,
        });
      } else if (emailSent) {
        const newTokenData = await resendVerificationEmailByEmail(
          formData.email,
        );
        setTokenData(newTokenData);
        setOpen(true);
      } else {
        // if email is not sent, sign up
        await signup(formData);
        setEmailSent(true);
        setOpen(true);
      }
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

      <FormProvider {...formControls}>
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
          <div className={'flex flex-col mb-3'}>
            <Input
              id="password"
              type="password"
              label="Password"
              {...register('password')}
              variant={errors.password ? 'destructive' : 'default'}
              autoComplete="new-password"
              required
            />
            {errors.password?.message && (
              <FormMessage message={errors.password.message} />
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
            Sign up
          </Button>
          <EmailSentDrawer open={open} setOpen={setOpen} onSubmit={onSubmit} />
        </form>
      </FormProvider>
    </>
  );
};

export { Form };
