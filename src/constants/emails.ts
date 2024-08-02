interface IEmails {
  [key: string]: {
    subject: string;
    html: (callbackUrl: string) => string;
  };
}

/**
 * This file contains all the content for the emails sent in the application.
 */
export const EMAILS: IEmails = {
  /**
   * For the tenant invitation email.
   */
  TENANT_INVITATION: {
    subject: 'You have been invited to join the tenant',
    html: (callbackUrl: string) => `
      <h2>Tascurator</h2>
      <p>You have been invited to join the tenant.<br/>Click your personalized link below to check and report your assignments.<br/><br/>${callbackUrl}</p>
    `,
  },
  /**
   * For the password reset email.
   */
  PASSWORD_RESET: {
    subject: 'Password Reset',
    html: (callbackUrl: string) => `
      <h2>Tascurator</h2>
      <p>Click here to reset your password: <a href="${callbackUrl}">${callbackUrl}</a></p>
    `,
  },
  /**
   * For the password reset success email.
   */
  PASSWORD_RESET_SUCCESS: {
    subject: 'Password Reset Successful',
    html: (callbackUrl: string) => `
      <h2>Tascurator</h2>
      <p>Your password has been successfully reset.<br/>Click here to login: <a href="${callbackUrl}">${callbackUrl}</a></p>
    `,
  },
  /**
   * For sign-up confirmation email.
   */
  SIGNUP_CONFIRMATION: {
    subject: 'Confirm your email address',
    html: (callbackUrl: string) => `
        <h2>Tascurator</h2>
        <p>Click the link below to confirm your email address.<br/><a href="${callbackUrl}">${callbackUrl}</a></p>
      `,
  },
};
