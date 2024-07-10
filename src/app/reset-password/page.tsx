import { Logo } from '@/components/ui/Logo';
import { Form } from '@/components/reset-password/Form';

const ResetPasswordPage = () => {
  return (
    <div className={'flex flex-col px-6'}>
      <Logo />
      <div className={'mb-6'}>
        <h1 className={'text-2xl font-bold text-center mb-3'}>
          Reset your password
        </h1>
        <p className={'text-center'}>Please enter a new password.</p>
      </div>
      <Form />
    </div>
  );
};

export default ResetPasswordPage;
