import { useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';

export const InvalidTokenToast = () => {
  const { toast } = useToast();

  useEffect(() => {
    toast({
      title: 'Invalid token',
      description: 'The token you provided is invalid or has expired.',
      variant: 'destructive',
    });
  }, []);

  return <></>;
};
