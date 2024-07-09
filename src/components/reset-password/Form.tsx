'use client';

import { useEffect, useState } from 'react';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { resetPasswordSchema, TResetPassword } from '@/constants/schema';
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
  const [confirmPassword, setConfirmPassword] = useState('');
  const [conditions, setConditions] = useState({
    minLength: false,
    maxLength: true,
    uppercase: false,
    lowercase: false,
    specialChar: false,
    number: false,
    match: false,
  });

  useEffect(() => {
    setConditions({
      minLength: password.length >= PASSWORD_MIN_LENGTH,
      maxLength: password.length <= PASSWORD_MAX_LENGTH,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      specialChar: /[\W_]/.test(password),
      number: /\d/.test(password),
      match: password === confirmPassword && confirmPassword.length > 0,
    });
  }, [password, confirmPassword]);

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
    {
      condition: conditions.match,
      constraint: 'Passwords match',
    },
  ];

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    trigger,
  } = useForm<TResetPassword>({
    resolver: zodResolver(resetPasswordSchema),
  });

  // TODO: Implement the proper sign up logic
  const onSubmit = async (formData: TResetPassword) => {
    try {
      const isValid = await trigger(['password', 'confirmPassword']);
      if (isValid) {
        console.log('Form data:', formData);
        const { password } = formData;
        console.log('Password:', password);
        // await resetPassword(formData);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={'flex flex-col'}>
      <div className={'flex flex-col mb-4'}>
        <Input
          id="password"
          type="password"
          label="New password"
          {...register('password')}
          variant={errors.password ? 'destructive' : 'default'}
          onChange={(e) => setPassword(e.target.value)}
        />
        {errors.password?.message && (
          <FormMessage message={errors.password.message} />
        )}
      </div>
      <div className={'flex flex-col mb-3'}>
        <Input
          id="confirmPassword"
          type="password"
          label="ConfirmPassword"
          {...register('confirmPassword')}
          variant={errors.confirmPassword ? 'destructive' : 'default'}
          onChange={(e) => setConfirmPassword(e.target.value)}
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
  );
};

export { Form };
