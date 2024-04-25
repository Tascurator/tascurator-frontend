import { cn } from '@/lib/utils';
import { CircleCheck } from 'lucide-react';

interface PasswordValidationItemProps {
  text: string;
  isValid: boolean;
  className?: string;
}

/**
 * @example
 * ```ts
 * return (
 * <PasswordValidationItem
 * isValid={false}
 * text={'Less than or equal to 8 characters long'}
 * />
 * )
 * ```
 */

export function PasswordValidationItem({
  text,
  isValid = false,
}: PasswordValidationItemProps) {
  return (
    <p className={cn('flex', { 'items-center text-sm gap-1': !isValid })}>
      <CircleCheck
        className={cn('stroke-white', {
          'fill-primary': isValid,
          'fill-slate-400': !isValid,
        })}
      />
      <span>{text}</span>
    </p>
  );
}
