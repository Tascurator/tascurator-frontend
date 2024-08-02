import { Resend } from 'resend';
import { SERVER_MESSAGES } from '@/constants/server-messages';

const resend = new Resend(process.env.RESEND_API_KEY);
const senderEmail = process.env.RESEND_SENDER_EMAIL;
const senderName = process.env.RESEND_SENDER_NAME;

interface ISendEmailProps {
  to: string;
  subject: string;
  html: string;
}

/**
 * Send an email using the Resend API
 *
 * @param to - The email address of the recipient
 * @param subject - The subject of the email
 * @param html - The HTML content of the email
 */
export const sendEmail = async ({ to, subject, html }: ISendEmailProps) => {
  /**
   * Check if the sender email or name is missing in the environment variables.
   */
  if (!senderEmail || !senderName) {
    throw new Error(
      SERVER_MESSAGES.ENV_KEYS_MISSING([
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
    subject,
    html,
  });

  /**
   * If there is an error, throw an error with the message.
   */
  if (error) {
    console.error(SERVER_MESSAGES.EMAIL_SEND_ERROR, error.message);
    throw new Error(SERVER_MESSAGES.EMAIL_SEND_ERROR);
  }

  /**
   * Return the data from the response.
   */
  return data;
};
