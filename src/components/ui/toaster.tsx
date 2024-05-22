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

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(({ id, description, variant, ...props }) => {
        return (
          <Toast key={id} variant={variant} {...props}>
            <div className="flex items-center justify-center gap-1">
              {variant ? (
                <TriangleAlert className="size-3.5" />
              ) : (
                <Check className="size-3.5" />
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
