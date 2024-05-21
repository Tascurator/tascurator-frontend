import { ButtonHTMLAttributes, forwardRef } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-xl text-lg font-normal ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 capitalize',
  {
    variants: {
      variant: {
        default: 'bg-primary text-white hover:bg-primary/80',
        secondary: 'border border-primary bg-white hover:bg-slate-100',
        tertiary: 'bg-gray-500 text-white hover:bg-gray-500/50',
        destructive: 'bg-rose-600 text-white hover:bg-rose-600/80',
        link: 'text-sky-600 hover:text-[#0084C580] text-base',
        floating:
          'border border-transparent bg-white rounded-full shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25),0px_-4px_4px_0px_rgba(0,0,0,0.05)] hover:shadow-md',
        outline:
          'border border-gray-500 bg-background hover:bg-slate-100 hover:text-accent-foreground',
        'outline-destructive':
          'border border-rose-600 bg-background text-rose-600 font-medium hover:bg-slate-100',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
      },
      size: {
        default: 'w-64 h-12 px-4 py-2',
        md: 'w-40 h-12 px-4 py-2',
        sm: 'w-32 h-12 px-4 py-2',
        floating: 'w-14 h-14',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
