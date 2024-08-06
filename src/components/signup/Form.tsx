'use client';

import { useEffect, useState } from 'react';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signupSchema, TSignupSchema } from '@/constants/schema';
import { signup } from '@/actions/signup';
import { Input } from '@/components/ui/input';
import { FormMessage } from '@/components/ui/formMessage';

import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loadingSpinner';
import { toast } from '@/components/ui/use-toast';

import { ValidationListItem } from '@/components/ui/ValidationListItem';
import { PASSWORD_CONSTRAINTS } from '@/constants/password-constraints';
import { CONSTRAINTS } from '@/constants/constraints';
import {
  TOAST_ERROR_MESSAGES,
  TOAST_SUCCESS_MESSAGES,
} from '@/constants/toast-texts';

const {
  PASSWORD_MIN_LENGTH,
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_CAPITAL_LETTERS,
  PASSWORD_MIN_LOWERCASE_LETTERS,
  PASSWORD_MIN_SPECIAL_CHARACTERS,
  PASSWORD_MIN_NUMBERS,
} = CONSTRAINTS;

const { minLength, length } = PASSWORD_CONSTRAINTS;

const Form = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
    trigger,
    watch,
  } = useForm<TSignupSchema>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onBlur',
  });

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
      const isValid = await trigger(['email', 'password']);
      if (isValid) {
        /**
         * Wait for 1 second for user experience purposes
         */
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const result = await signup(formData);

        if (result?.error) {
          toast({
            variant: 'destructive',
            description: result.error,
          });
        } else {
          toast({
            variant: 'default',
            description: TOAST_SUCCESS_MESSAGES.EMAIL_SENT,
          });
        }
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        description: TOAST_ERROR_MESSAGES.SIGNUP_UNKNOWN_ERROR,
      });
    }
  };

  return (
    <>
      <LoadingSpinner isLoading={isSubmitting} />

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
      </form>
    </>
  );
};

export { Form };
