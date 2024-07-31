/**
 * This file contains all the toast texts used in the application.
 *
 * @example
 *
 * // Success
 * toast({
 *   variant: 'default',
 *   description: TOAST_TEXTS.success,
 * });
 *
 * // Error
 * toast({
 *   variant: 'destructive',
 *   description: TOAST_TEXTS.error,
 * });
 *
 */

export const TOAST_TEXTS = {
  success: 'Operation completed successfully.',
  error: 'An error occurred. Please try again.',
};

export const TOAST_ERROR_MESSAGES = {
  CREDENTIAL_INVALID: 'Email or password is incorrect.',
  CREDENTIAL_FIELDS_INVALID: 'Invalid fields',
  EXISTING_EMAIL: 'Email already in use.',
  EMAIL_NOT_VERIFIED:
    'Email not verified. Please check your inbox to verify before logging in.',
  LOGIN_UNKNOWN_ERROR: 'An error occurred while logging in.',
  SIGNUP_UNKNOWN_ERROR: 'An error occurred while signing up.',
  UNKNOWN_ERROR: 'Something went wrong.',
};
