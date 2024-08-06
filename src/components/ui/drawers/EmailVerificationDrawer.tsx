'use client';
import { newVerification } from '@/actions/new-verification';
import { useCallback, useEffect, useState } from 'react';
import { ERROR_MESSAGES } from '@/constants/error-messages';
import {
  SuccessVerificationDrawer,
  FailedVerificationDrawer,
} from '@/components/ui/drawers/AuthenticationDrawer';
import { LoadingSpinner } from '@/components/ui/loadingSpinner';
const { GENERAL_ERROR } = ERROR_MESSAGES;

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

  const onSubmit = useCallback(() => {
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
        setOpen(true);
      })
      .catch(() => {
        setError(GENERAL_ERROR);
        setIsLoading(false);
        setOpen(true);
      });
  }, [token, success, error]); // set success and error as dependencies

  useEffect(() => {
    if (!token) return;
    onSubmit();
  }, [token, onSubmit]);

  if (!token) return null;

  return (
    <>
      <LoadingSpinner isLoading={isLoading} />
      {success && <SuccessVerificationDrawer open={open} setOpen={setOpen} />}
      {!success && error && (
        <FailedVerificationDrawer
          open={open}
          setOpen={setOpen}
          errorMessages={error}
          token={token}
        />
      )}
    </>
  );
};
