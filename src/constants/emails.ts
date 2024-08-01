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
   * For sign-up confirmation email.
   */
  SIGNUP_CONFIRMATION: {
    subject: 'Confirm your email address',
    html: (callbackUrl: string) => `
      <h2>Tascurator</h2>
      <p>Click the link below to confirm your email address.<br/>${callbackUrl}</p>
    `,
  },

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
};
