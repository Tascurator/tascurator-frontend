'use client';

import { useEffect, useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { SERVER_ERROR_MESSAGES } from '@/constants/server-error-messages';

export const InvalidTokenToast = () => {
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    toast({
      description: SERVER_ERROR_MESSAGES.INVALID_TOKEN,
      variant: 'destructive',
    });
  }, [mounted]);

  return null;
};
