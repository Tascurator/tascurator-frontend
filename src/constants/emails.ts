export type TEmailType =
  | 'TENANT_INVITATION'
  | 'PASSWORD_RESET'
  | 'PASSWORD_RESET_SUCCESS'
  | 'SIGNUP_CONFIRMATION';

type TEmails = {
  [key in TEmailType]: {
    subject: string;
    preview: string;
    body: {
      title: string;
      content: string;
      buttonLabel: string;
      disclaimer: string;
    };
  };
};

/**
 * This file contains all the content for the emails sent in the application.
 */
export const EMAILS: TEmails = {
  /**
   * For the tenant invitation email.
   */
  TENANT_INVITATION: {
    subject: 'Invitation to join Tascurator',
    preview: 'You have been invited to Tascurator.',
    body: {
      title: 'Welcome to Tascurator!',
      content:
        'Hi! Your landlord has invited you to Tascurator. This app is used to track cleaning tasks. Please check and report your tasks using the button below!',
      buttonLabel: 'Check and report your tasks',
      disclaimer: 'If you did not request this, please ignore this email.',
    },
  },

  /**
   * For the password reset email.
   */
  PASSWORD_RESET: {
    subject: 'Rest your Tascurator password',
    preview: 'You have requested a password reset.',
    body: {
      title: 'Password Reset Request',
      content:
        'Someone recently requested a password reset for your Tascurator account. If it was you, you can set a new password here:',
      buttonLabel: 'Reset password',
      disclaimer:
        'If you did not request a password reset, please ignore this email.',
    },
  },

  /**
   * For the password reset success email.
   */
  PASSWORD_RESET_SUCCESS: {
    subject: 'Your Tascurator password has been reset',
    preview: 'You have successfully reset your password.',
    body: {
      title: 'Password Reset Successful',
      content: 'Your password has been successfully reset.',
      buttonLabel: 'Log in',
      disclaimer:
        'If you did not reset your password, please ignore this email.',
    },
  },

  /**
   * For sign-up confirmation email.
   */
  SIGNUP_CONFIRMATION: {
    subject: 'Confirm your Tascurator account',
    preview: 'You have signed up for Tascurator.',
    body: {
      title: 'Confirm Your Email Address',
      content:
        'Thank you for signing up for Tascurator. Please confirm your email address by clicking the button below.',
      buttonLabel: 'Confirm your email address',
      disclaimer:
        'If you did not sign up for an account, please ignore this email.',
    },
  },
};
