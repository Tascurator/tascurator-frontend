import { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

/**
 * FormMessageProps represents the props for the FormMessage component.
 *
 * @property {string} message - The message to display
 */
export interface IFormMessageProps
  extends HTMLAttributes<HTMLParagraphElement> {
  message: string;
}

/**
 * FormMessage is the component used to display form validation messages.
 *
 * @example
 * <FormMessage message="This field is required" />
 */
export const FormMessage = ({
  className,
  message,
  ...props
}: IFormMessageProps) => {
  return (
    <p
      className={cn('w-full text-base text-destructive pt-1.5', className)}
      {...props}
    >
      {message}
    </p>
  );
};
