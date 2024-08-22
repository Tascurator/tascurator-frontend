'use client';

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastViewport,
} from '@/components/ui/toast';
import { useToast } from '@/components/ui/use-toast';
import { Check, TriangleAlert } from 'lucide-react';

/**
 * The Toaster component that displays error or success message.
 *
 * @example
 *
 * const description = 'Error message';
 *
 * <Button
 *  onClick={() => {
 *    toast({
 *      variant: 'destructive', //'default' or 'destructive'.
 *      description: description,
 *    });
 *  }}
 *  >
 *  Show Toast
 * </Button>
 *
 */

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(({ id, description, variant, ...props }) => {
        return (
          <Toast key={id} variant={variant} {...props}>
            <div className="flex items-center justify-center gap-1">
              {variant === 'default' ? (
                <Check className="size-3.5 flex-shrink-0" />
              ) : (
                <TriangleAlert className="size-3.5 flex-shrink-0" />
              )}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
