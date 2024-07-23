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
      <p>You have been invited to join the tenant.<br/>Click the link below to check and report your assignments.<br/><br/>${callbackUrl}</p>
    `,
  },
};
