'use client';
import { newVerification } from '@/actions/new-verification';
import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { ERROR_MESSAGES } from '@/constants/error-messages';
import {
  SuccessVerificationDrawer,
  FailedVerificationDrawer,
} from '@/components/ui/drawers/AuthenticationDrawer';
const { MISSING_TOKEN, GENERAL_ERROR } = ERROR_MESSAGES;

export const EmailVerificationDrawer = () => {
  const [success, setSuccess] = useState<boolean | undefined>();
  const [error, setError] = useState<string | undefined>();
  const [open, setOpen] = useState(false);

  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const onSubmit = useCallback(() => {
    if (!token) {
      setOpen(true);
      setError(MISSING_TOKEN);
      return;
    }
    newVerification(token)
      .then((data) => {
        setOpen(true);
        setSuccess(data.success);
        setError(data.error);
      })
      .catch(() => {
        setOpen(true);
        setError(GENERAL_ERROR);
      });
  }, [token]);

  useEffect(() => {
    onSubmit();
  }, [onSubmit]);

  // if there is no token, don't show the drawer
  if (!token) return null;

  return (
    <>
      {success && <SuccessVerificationDrawer open={open} setOpen={setOpen} />}
      {error && (
        <FailedVerificationDrawer
          open={open}
          setOpen={setOpen}
          errorMessages={error}
        />
      )}
    </>
  );
};
