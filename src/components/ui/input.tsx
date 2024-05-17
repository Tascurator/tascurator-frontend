import { forwardRef, InputHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const inputVariants = cva(
  'w-full h-12 rounded-xl border px-3 py-2 ring-offset-background placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'border-input bg-background focus-visible:ring-ring',
        destructive:
          'border-destructive bg-destructive-background focus-visible:ring-destructive',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export interface IInputProps
  extends InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {
  className?: string;
  icon?: ReactNode;
}

/**
 * An input component
 *
 * @example
 * // A default input
 * <Input type="text" placeholder="Enter your name" />
 * // A destructive input
 * <Input variant="destructive" type="text" placeholder="Enter your name" />
 * // An input with an icon
 * <Input icon={<SearchIcon />} type="text" placeholder="Search" />
 */
const Input = forwardRef<HTMLInputElement, IInputProps>(
  ({ className, variant, type, icon, ...props }, ref) => {
    return (
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 right-3 flex items-center">
            {icon}
          </div>
        )}
        <input
          type={type}
          className={cn(inputVariants({ variant, className }))}
          ref={ref}
          {...props}
        />
      </div>
    );
  },
);
Input.displayName = 'Input';

export { Input };
