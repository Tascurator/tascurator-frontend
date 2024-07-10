import { Form } from '@/components/login/Form';
import { Logo } from '@/components/ui/Logo';

/**
 * This login page was created just for backend development purposes.
 * TODO: Improve and implement the proper login page with the proper logic.
 */
const LoginPage = () => {
  return (
    <div className={'flex flex-col px-6'}>
      <Logo responsive={false} />
      <Form />
    </div>
  );
};

export default LoginPage;
