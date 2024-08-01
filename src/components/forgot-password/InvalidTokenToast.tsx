'use client';

import { useEffect, useState } from 'react';
import { useToast } from '@/components/ui/use-toast';

export const InvalidTokenToast = () => {
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    toast({
      title: 'Invalid token',
      description:
        'The token is invalid or has expired. Please request a password reset again.',
      variant: 'destructive',
    });
  }, [mounted]);

  return null;
};
