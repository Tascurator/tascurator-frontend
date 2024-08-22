/**
 * Error messages for form validation.
 *
 * @example
 * const schema = z.object({
 *  email: z.string().email(ERROR_MESSAGES.EMAIL),
 *  password: z.string().min(8, ERROR_MESSAGES.minLength('Password', 8)),
 * });
 */
export const ERROR_MESSAGES = {
  // Dynamic error messages
  required: (field: string) => `${field} is required.`,
  string: (field: string) => `${field} must be a string.`,
  number: (field: string) => `${field} must be a number.`,
  minLength: (field: string, min: number) =>
    `${field} must be at least ${min} characters long.`,
  maxLength: (field: string, max: number) =>
    `${field} must be at most ${max} characters long.`,
  exists: (field: string) => `The ${field.toLowerCase()} already exists.`,

  //Static error messages
  EMAIL_INVALID: 'Invalid email address.',
  GENERAL_ERROR: 'Something went wrong. Please try again.',
};
