import { Resend } from 'resend';

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
    throw new Error('Email or name is missing in the environment variables');
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
    throw new Error(error.message);
  }

  /**
   * Return the data from the response.
   */
  return data;
};
