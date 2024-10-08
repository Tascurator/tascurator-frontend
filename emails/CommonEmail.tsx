import { EMAILS, TEmailType } from '@/constants/emails';
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Section,
  Tailwind,
  Text,
} from '@react-email/components';
import { getBaseUrl } from '@/utils/base-url';

interface ICommonEmailProps {
  type: TEmailType;
  callbackUrl: string;
}

/**
 * Common email template for all emails.
 *
 * @param type - The type of the email to send: 'TENANT_INVITATION', 'PASSWORD_RESET', 'PASSWORD_RESET_SUCCESS', 'SIGNUP_CONFIRMATION'
 * @param callbackUrl - The URL to redirect the user to when they click the button in the email
 */
const CommonEmail = ({ type, callbackUrl }: ICommonEmailProps) => {
  const template = EMAILS[type];

  return (
    <Html>
      <Preview>{template.preview}</Preview>
      <Head />
      <Tailwind
        config={{
          theme: {
            extend: {
              colors: {
                primary: '#0891B2',
                black: '#333',
              },
            },
          },
        }}
      >
        <Body
          className={'bg-white font-sans text-black my-0 mx-auto px-6 py-14'}
        >
          <Container>
            {/* Logo */}
            <Img
              src={`${getBaseUrl()}/logo.png`}
              alt={'Tascurator Logo'}
              width={100}
              height={100}
              className={'mx-auto'}
            />

            {/* Title */}
            <Heading
              as={'h1'}
              className={'text-2xl text-center font-medium mt-14 mb-0'}
            >
              {template.body.title}
            </Heading>

            {/* Content */}
            <Text className={'text-lg mt-5 mb-0'}>{template.body.content}</Text>

            {/* Call to action button */}
            <Section className={'text-center'}>
              <Button
                className={
                  'text-white bg-primary w-64 rounded-xl text-lg font-normal py-2.5 my-6'
                }
                href={callbackUrl}
              >
                {template.body.buttonLabel}
              </Button>
            </Section>

            {/* Disclaimer text */}
            <Text className={'text-sm text-gray-500 my-0'}>
              {template.body.disclaimer}
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

CommonEmail.PreviewProps = {
  type: 'SIGNUP_CONFIRMATION',
  callbackUrl: 'https://www.google.com',
} as ICommonEmailProps;

export default CommonEmail;
