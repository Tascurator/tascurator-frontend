import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { CircleCheck } from 'lucide-react';

interface PasswordValidationItemProps {
  className?: string;
  children: ReactNode;
}

/**
 * @example
 * <PasswordValidationItem>
 *  Less than or equal to 8 characters long
 * </PasswordValidationItem>
 * ```
 * Less than or equal to 8 characters long
 * Greater than or equal to characters long
 * At least 1 capital letter
 * At least 1 lowercase letter
 * At least 1 special character
 * At least 1 number
 *
 */

export function PasswordValidationItem({
  children,
}: PasswordValidationItemProps) {
  return (
    <p className="flex items-center text-sm gap-1">
      <CircleCheck className={cn('stroke-white fill-slate-400')} />
      <span>{children}</span>
    </p>
  );
}
