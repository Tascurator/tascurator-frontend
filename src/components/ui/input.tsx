import { forwardRef, InputHTMLAttributes, ReactNode, useState } from 'react';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import { EyeIcon, EyeOffIcon } from 'lucide-react';

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

type TInputPropsBase = InputHTMLAttributes<HTMLInputElement> &
  VariantProps<typeof inputVariants> & {
    className?: string;
  };

type TInputPropsWithIcon = TInputPropsBase & {
  type?: 'text' | 'email' | 'number' | 'url';
  icon?: ReactNode;
};

// Ensure no icon is passed when type is password
type TInputPropsWithoutIcon = TInputPropsBase & {
  type: 'password';
  icon?: never;
};

export type TInputProps = TInputPropsWithIcon | TInputPropsWithoutIcon;

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
 * // A password input with toggle visibility, no need to pass icons
 * <Input type="password" placeholder="Enter your password" />
 */
const Input = forwardRef<HTMLInputElement, TInputProps>(
  ({ className, variant, type, icon, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
      setShowPassword((prev) => !prev);
    };

    const inputType = type === 'password' && showPassword ? 'text' : type;

    return (
      <div className="relative w-full">
        {type === 'password' ? (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute inset-y-0 right-3 flex items-center"
          >
            {showPassword ? (
              <EyeOffIcon className="size-5" />
            ) : (
              <EyeIcon className="size-5" />
            )}
          </button>
        ) : (
          <div className="absolute inset-y-0 right-3 flex items-center">
            {icon}
          </div>
        )}

        <input
          type={inputType}
          className={cn(
            inputVariants({ variant, className }),
            // Add padding to the right to avoid input text being hidden by the icon
            (type === 'password' || icon) && 'pr-11',
          )}
          ref={ref}
          {...props}
        />
      </div>
    );
  },
);
Input.displayName = 'Input';

export { Input };