import { Form } from '@/components/login/Form';
import { Logo } from '@/components/ui/Logo';

const LoginPage = () => {
  return (
    <div className={'flex flex-col px-6'}>
      <Logo responsive={false} />
      <Form />
    </div>
  );
};

export default LoginPage;
