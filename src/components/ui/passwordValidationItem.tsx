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
    <p className={cn('flex items-center gap-1', { 'text-gray-500': !isValid })}>
      <CircleCheck
        className={cn('stroke-white w-5', {
          'fill-primary-light': isValid,
          'fill-slate-400 ': !isValid,
        })}
      />
      <span className="text-sm">{text}</span>
    </p>
  );
}
