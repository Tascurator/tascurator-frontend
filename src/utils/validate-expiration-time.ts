import { CONSTRAINTS } from '@/constants/constraints';
const {
  VERIFICATION_EMAIL_TOKEN_EXPIRATION_TIME,
  VERIFICATION_EMAIL_RESEND_COOLDOWN_TIME,
} = CONSTRAINTS;

export const isWithin30MinutesOfEmailSent = (expiresAt: Date): boolean => {
  // Convert expiresAt to a Date object
  const expiresAtDate = new Date(expiresAt);

  // Calculate emailSentTime as 3 hours before expiresAt
  const emailSentTime = new Date(
    expiresAtDate.getTime() - VERIFICATION_EMAIL_TOKEN_EXPIRATION_TIME,
  );

  // Get the current time
  const now = new Date();

  // Calculate the time 30 minutes before now
  const time30MinutesAgo = new Date(
    now.getTime() - VERIFICATION_EMAIL_RESEND_COOLDOWN_TIME,
  );

  // Check if emailSentTime is more than 30 minutes ago from now
  return emailSentTime >= time30MinutesAgo;
};
