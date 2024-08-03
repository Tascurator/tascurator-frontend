'use client';
import { newVerification } from '@/actions/new-verification';
import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { ERROR_MESSAGES } from '@/constants/error-messages';
import {
  SuccessVerificationDrawer,
  FailedVerificationDrawer,
} from '@/components/ui/drawers/AuthenticationDrawer';
const { GENERAL_ERROR, MISSING_TOKEN } = ERROR_MESSAGES;

export const EmailVerificationDrawer = () => {
  const [success, setSuccess] = useState<boolean | undefined>();
  const [error, setError] = useState<string | undefined>();
  const [open, setOpen] = useState(false);

  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const onSubmit = useCallback(() => {
    if (success || error) return;

    if (!token) {
      setOpen(true);
      setError(MISSING_TOKEN);
      return;
    }
    newVerification(token)
      .then((data) => {
        setSuccess(data.success);
        setError(data.error);
        setOpen(true);
      })
      .catch(() => {
        setError(GENERAL_ERROR);
        setOpen(true);
      });
  }, [token, success, error]);

  useEffect(() => {
    if (!token) return;
    onSubmit();
  }, [token, onSubmit]);

  if (!token) return null;

  return (
    <>
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
