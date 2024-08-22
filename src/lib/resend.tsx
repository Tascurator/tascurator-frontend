import { Resend } from 'resend';
import { SERVER_ERROR_MESSAGES } from '@/constants/server-error-messages';
import { EMAILS, TEmailType } from '@/constants/emails';
import CommonEmail from '../../emails/CommonEmail';

const resend = new Resend(process.env.RESEND_API_KEY);
const senderEmail = process.env.RESEND_SENDER_EMAIL;
const senderName = process.env.RESEND_SENDER_NAME;

interface ISendEmailProps {
  to: string;
  type: TEmailType;
  callbackUrl: string;
}

/**
 * Send an email using the Resend API
 *
 * @param to - The email address of the recipient
 * @param type - The type of the email to send: 'TENANT_INVITATION', 'PASSWORD_RESET', 'PASSWORD_RESET_SUCCESS', 'SIGNUP_CONFIRMATION'
 * @param callbackUrl - The URL to redirect the user to when they click the button in the email
 */
export const sendEmail = async ({ to, type, callbackUrl }: ISendEmailProps) => {
  /**
   * Check if the sender email or name is missing in the environment variables.
   */
  if (!senderEmail || !senderName) {
    throw new Error(
      SERVER_ERROR_MESSAGES.ENV_KEYS_MISSING([
        'RESEND_SENDER_EMAIL',
        'RESEND_SENDER_NAME',
      ]),
    );
  }

  /**
   * Send the email using the Resend API.
   */
  const { data, error } = await resend.emails.send({
    from: `${senderName} <${senderEmail}>`,
    to,
    subject: EMAILS[type].subject,
    react: <CommonEmail type={type} callbackUrl={callbackUrl} />,
  });

  /**
   * If there is an error, throw an error with the message.
   */
  if (error) {
    console.error(SERVER_ERROR_MESSAGES.EMAIL_SEND_ERROR, error.message);
    throw new Error(SERVER_ERROR_MESSAGES.EMAIL_SEND_ERROR);
  }

  /**
   * Return the data from the response.
   */
  return data;
};
