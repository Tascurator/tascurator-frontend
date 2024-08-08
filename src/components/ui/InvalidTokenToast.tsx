'use client';

import { useEffect, useState } from 'react';
import { useToast } from '@/components/ui/use-toast';

interface IInvalidTokenToastProps {
  errorMessage: string;
}

export const InvalidTokenToast = ({
  errorMessage,
}: IInvalidTokenToastProps) => {
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    toast({
      description: errorMessage,
      variant: 'destructive',
    });
  }, [mounted]);

  return null;
};
