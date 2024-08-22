'use client';

import {
  forwardRef,
  ElementRef,
  ComponentPropsWithoutRef,
  ReactElement,
} from 'react';
import {
  Provider,
  Viewport,
  Root,
  Action,
  Close,
  Description,
} from '@radix-ui/react-toast';
import { cva, type VariantProps } from 'class-variance-authority';
import { X } from 'lucide-react';

import { cn } from '@/lib/utils';

const ToastProvider = Provider;

const ToastViewport = forwardRef<
  ElementRef<typeof Viewport>,
  ComponentPropsWithoutRef<typeof Viewport>
>(({ className, ...props }, ref) => (
  <Viewport
    ref={ref}
    className={cn(
      'fixed top-0 inset-x-0 m-auto z-[100] flex justify-center max-h-screen w-full flex-col-reverse px-5 pt-5 sm:flex-col max-w-screen-sm',
      className,
    )}
    {...props}
  />
));
ToastViewport.displayName = Viewport.displayName;

const toastVariants = cva(
  'group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-lg border border-destructive px-4 py-1.5 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full',
  {
    variants: {
      variant: {
        default:
          'border bg-background text-foreground bg-slate-100 text-emerald-600 border-emerald-600',
        destructive:
          'destructive group border-destructive bg-slate-100 text-destructive',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

const Toast = forwardRef<
  ElementRef<typeof Root>,
  ComponentPropsWithoutRef<typeof Root> & VariantProps<typeof toastVariants>
>(({ className, variant, ...props }, ref) => {
  return (
    <Root
      ref={ref}
      className={cn(toastVariants({ variant }), className)}
      {...props}
    />
  );
});
Toast.displayName = Root.displayName;

const ToastAction = forwardRef<
  ElementRef<typeof Action>,
  ComponentPropsWithoutRef<typeof Action>
>(({ className, ...props }, ref) => (
  <Action
    ref={ref}
    className={cn(
      'inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive',
      className,
    )}
    {...props}
  />
));
ToastAction.displayName = Action.displayName;

const ToastClose = forwardRef<
  ElementRef<typeof Close>,
  ComponentPropsWithoutRef<typeof Close>
>(({ className, ...props }, ref) => (
  <Close
    ref={ref}
    className={cn(
      'flex justify-center items-center text-foreground/50 hover:text-foreground focus:outline-none text-gray-500',
      className,
    )}
    toast-close=""
    {...props}
  >
    <X className="size-7 text-gray-500" />
  </Close>
));
ToastClose.displayName = Close.displayName;

const ToastDescription = forwardRef<
  ElementRef<typeof Description>,
  ComponentPropsWithoutRef<typeof Description>
>(({ className, ...props }, ref) => (
  <Description
    ref={ref}
    className={cn('text-sm opacity-80', className)}
    {...props}
  />
));
ToastDescription.displayName = Description.displayName;

type ToastProps = ComponentPropsWithoutRef<typeof Toast>;

type ToastActionElement = ReactElement<typeof ToastAction>;

export {
  type ToastProps,
  type ToastActionElement,
  ToastProvider,
  ToastViewport,
  Toast,
  ToastDescription,
  ToastClose,
};
