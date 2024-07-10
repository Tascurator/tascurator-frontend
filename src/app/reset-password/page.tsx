import { Logo } from '@/components/ui/Logo';
import { Form } from '@/components/reset-password/Form';

const ResetPasswordPage = () => {
  return (
    <div className={'flex flex-col px-6'}>
      {/* hide logo on mobile and show on tablet & laptop */}
      <Logo responsive={true} />
      <div className={'mb-6 mt-24 md:mt-0'}>
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
