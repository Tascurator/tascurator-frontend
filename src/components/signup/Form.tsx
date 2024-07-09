'use client';

import { useEffect, useState } from 'react';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signupSchema, TSignupSchema } from '@/constants/schema';
import { Input } from '@/components/ui/input';
import { FormMessage } from '@/components/ui/formMessage';

import { Button } from '@/components/ui/button';

import { ValidationListItem } from '@/components/ui/ValidationListItem';
import { PASSWORD_CONSTRAINTS } from '@/constants/password-constraints';

import { CONSTRAINTS } from '@/constants/constraints';

const {
  PASSWORD_MIN_LENGTH,
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_CAPITAL_LETTERS,
  PASSWORD_MIN_LOWERCASE_LETTERS,
  PASSWORD_MIN_SPECIAL_CHARACTERS,
  PASSWORD_MIN_NUMBERS,
} = CONSTRAINTS;

const { minLength, lessLength, graterLength } = PASSWORD_CONSTRAINTS;

const Form = () => {
  const [password, setPassword] = useState('');
  const [conditions, setConditions] = useState({
    minLength: false,
    maxLength: true,
    uppercase: false,
    lowercase: false,
    specialChar: false,
    number: false,
  });

  useEffect(() => {
    setConditions({
      minLength: password.length >= PASSWORD_MIN_LENGTH,
      maxLength: password.length <= PASSWORD_MAX_LENGTH,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      specialChar: /[\W_]/.test(password),
      number: /\d/.test(password),
    });
  }, [password]);

  const ValidationListItems = [
    {
      condition: conditions.minLength,
      constraint: lessLength('characters long', PASSWORD_MIN_LENGTH),
    },
    {
      condition: conditions.maxLength,
      constraint: graterLength('characters long', PASSWORD_MAX_LENGTH),
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

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    trigger,
  } = useForm<TSignupSchema>({
    resolver: zodResolver(signupSchema),
  });

  // TODO: Implement the proper sign up logic
  // param: formData: TSignupSchema
  const onSubmit = async () => {
    try {
      const isValid = await trigger(['email', 'password']);
      if (isValid) {
        // await signup(formData);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
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
          onChange={(e) => setPassword(e.target.value)}
        />
        {errors.password?.message && (
          <FormMessage message={errors.password.message} />
        )}
        <ul className={'mt-3'}>
          {ValidationListItems.map((item, index) => (
            <ValidationListItem
              key={index}
              condition={item.condition}
              constraint={item.constraint}
            />
          ))}
        </ul>
      </div>
      <Button type="submit" disabled={!isValid} className={'mx-auto mb-4'}>
        Sign up
      </Button>
    </form>
  );
};

export { Form };
