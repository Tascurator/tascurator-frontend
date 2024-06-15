'use client';

import { forwardRef, ElementRef, ComponentPropsWithoutRef } from 'react';
import { Root, Indicator } from '@radix-ui/react-checkbox';
import { Check } from 'lucide-react';

import { cn } from '@/lib/utils';

/**
 * The Checkbox component that allows users to toggle between checked and unchecked states.
 * The usage is the same as the official documentation of shadcn/ui.
 *
 * @example
 * <Checkbox />
 * @see {@link https://ui.shadcn.com/docs/components/checkbox | Checkbox}
 */
const Checkbox = forwardRef<
  ElementRef<typeof Root>,
  ComponentPropsWithoutRef<typeof Root>
>(({ className, ...props }, ref) => (
  <Root
    ref={ref}
    className={cn(
      'peer h-6 w-6 m-1 shrink-0 rounded border-2 border-slate-400 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary-light data-[state=checked]:text-white data-[state=checked]:border data-[state=checked]:border-none',
      className,
    )}
    {...props}
  >
    <Indicator className={cn('flex items-center justify-center text-current')}>
      <Check className="h-6 w-6" />
    </Indicator>
  </Root>
));
Checkbox.displayName = Root.displayName;

export { Checkbox };
