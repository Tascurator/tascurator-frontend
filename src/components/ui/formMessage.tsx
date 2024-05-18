import { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface IFormMessageProps
  extends HTMLAttributes<HTMLParagraphElement> {
  message: string;
}

export const FormMessage = ({
  className,
  message,
  ...props
}: IFormMessageProps) => {
  return (
    <p
      className={cn('text-base text-destructive pt-1.5', className)}
      {...props}
    >
      {message}
    </p>
  );
};
