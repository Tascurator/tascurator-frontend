'use client';
import { newVerification } from '@/actions/new-verification';
import { useCallback, useEffect, useState } from 'react';
import { ERROR_MESSAGES } from '@/constants/error-messages';
import {
  SuccessVerificationDrawer,
  ExpiredVerificationTokenDrawer,
  EmailSentDrawer,
} from '@/components/ui/drawers/auth/AuthenticationDrawer';
import { LoadingSpinner } from '@/components/ui/loadingSpinner';
const { GENERAL_ERROR } = ERROR_MESSAGES;
import { SERVER_ERROR_MESSAGES } from '@/constants/server-error-messages';
import { toast } from '../../use-toast';
import { resendVerificationEmailByToken } from '@/actions/signup';
import { TOAST_ERROR_MESSAGES } from '@/constants/toast-texts';
import { FormProvider, useForm } from 'react-hook-form';
const { EXPIRED_TOKEN_VERIFICATION } = SERVER_ERROR_MESSAGES;

interface IEmailVerificationDrawer {
  token: string;
}

export const EmailVerificationDrawer = ({
  token,
}: IEmailVerificationDrawer) => {
  const [success, setSuccess] = useState<boolean | undefined>();
  const [error, setError] = useState<string | undefined>();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [newToken, setNewToken] = useState<string | undefined>();

  const onLoadSubmit = useCallback(() => {
    /**
     * Wait for 1 second for user experience purposes
     */
    if (success || error) return;
    if (!token) return;
    newVerification(token)
      .then((data) => {
        setSuccess(data.success);
        setError(data.error);
        setIsLoading(false);
        // Only if the token is expired, open the failed verification drawer
        if (data.error === EXPIRED_TOKEN_VERIFICATION) {
          setOpen(true);
        } else {
          toast({
            variant: 'destructive',
            description: data.error,
          });
        }
      })
      .catch(() => {
        setError(GENERAL_ERROR);
        setIsLoading(false);
        setOpen(true);
      });
  }, [token, success, error]); // set success and error as dependencies

  useEffect(() => {
    if (!token) return;
    onLoadSubmit();
  }, [token, onLoadSubmit]);

  const formControls = useForm();

  const onResendEmail = async () => {
    try {
      /**
       * Wait for 1 second for user experience purposes
       */
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const result = await resendVerificationEmailByToken(newToken ?? token);

      if (result?.error) {
        toast({
          variant: 'destructive',
          description: result.error,
        });
      } else {
        setNewToken(result?.token);
        console.log('new token', newToken);
        setOpen(true);
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        description: TOAST_ERROR_MESSAGES.UNKNOWN_ERROR,
      });
    }
  };

  if (!token) return null;

  return (
    <>
      <LoadingSpinner isLoading={isLoading} />
      {success && <SuccessVerificationDrawer open={open} setOpen={setOpen} />}
      {!success && error === EXPIRED_TOKEN_VERIFICATION && (
        <FormProvider {...formControls}>
          <ExpiredVerificationTokenDrawer
            open={open}
            setOpen={setOpen}
            errorMessages={error}
            onSubmit={onResendEmail}
          />
        </FormProvider>
      )}
      {newToken && (
        <FormProvider {...formControls}>
          <EmailSentDrawer
            open={open}
            setOpen={setOpen}
            onSubmit={onResendEmail}
          />
        </FormProvider>
      )}
    </>
  );
};
