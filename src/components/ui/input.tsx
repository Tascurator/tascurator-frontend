import { forwardRef, InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  icon?: JSX.Element;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, icon, ...props }, ref) => {
    return (
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 right-3 flex items-center">
            {icon}
          </div>
        )}
        <input
          type={type}
          className={cn(
            'w-full h-12 rounded-xl border border-input bg-background px-3 py-2 ring-offset-background placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            className,
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
