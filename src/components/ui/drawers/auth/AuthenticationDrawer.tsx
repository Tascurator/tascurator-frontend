import {
  DrawerClose,
  DrawerDescription,
  DrawerFooter,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';

import { MailCheck, CircleCheck, MailWarning } from 'lucide-react';

import { ReactNode } from 'react';
import {
  FieldValues,
  FormProvider,
  SubmitHandler,
  useForm,
} from 'react-hook-form';
import { TForgotPassword } from '@/constants/schema';
import { CommonDrawer } from '@/components/ui/commons/CommonDrawer';
import { useRouter } from 'next/navigation';

interface IAuthenticationDrawer<T extends FieldValues> {
  title: string;
  description: string | string[];
  icon: ReactNode;
  buttonLabel: string;
  onSubmit?: SubmitHandler<T>;
  open: boolean;
  setOpen: (value: boolean) => void;
}

const AuthenticationDrawer = <T extends FieldValues>({
  title,
  description,
  icon,
  buttonLabel,
  onSubmit,
  open,
  setOpen,
}: IAuthenticationDrawer<T>) => {
  return (
    <CommonDrawer
      title={title}
      open={open}
      setOpen={setOpen}
      onSubmit={onSubmit ?? null}
    >
      <DrawerDescription>
        <span className={'w-20 h-20 mx-auto block mb-2.5'}>{icon}</span>
        {Array.isArray(description) ? (
          description.map((desc, index) => (
            <span key={index} className={'block'}>
              {desc}
            </span>
          ))
        ) : (
          <span>{description}</span>
        )}
      </DrawerDescription>
      <DrawerFooter>
        <DrawerClose asChild>
          <Button type={'submit'}>{buttonLabel}</Button>
        </DrawerClose>
      </DrawerFooter>
    </CommonDrawer>
  );
};

interface IAuthenticationChildrenDrawer<T extends FieldValues> {
  open: boolean;
  setOpen: (value: boolean) => void;
  onSubmit?: SubmitHandler<T>;
}

/**
 * A drawer component to show the email sent message or password changed message
 *
 * @param open - The state of the drawer
 * @param setOpen - The function to set the state of the drawer
 *
 * @example
 * const [open, setOpen] = useState(false);
 *
 * const onSubmit = async (formData: TForgotPassword) => {
 *   // Do something
 *   setOpen(false);
 * };
 *
 * // To show the email sent message and resend email button
 * <EmailSentDrawer open={open} setOpen={setOpen} onSubmit={onSubmit} />
 *
 * // To show the password changed message
 * <PasswordChangedDrawer open={open} setOpen={setOpen} onSubmit={onSubmit} />
 */

/**
 * A email sent drawer component to confirm the task creation or update
 */
export const EmailSentDrawer = <T extends TForgotPassword>({
  open,
  setOpen,
  onSubmit,
}: IAuthenticationChildrenDrawer<T>) => {
  return (
    <AuthenticationDrawer
      title={'Email Sent!'}
      description={[
        'We have sent you an email.',
        'Please check your email within 3 hours and complete the update.',
      ]}
      icon={<MailCheck className="w-full h-full stroke-secondary-light" />}
      buttonLabel={'Resend Email'}
      onSubmit={onSubmit}
      open={open}
      setOpen={setOpen}
    />
  );
};

/**
 * A password changed drawer component to confirm the task creation or update
 */
export const PasswordChangedDrawer = <T extends FieldValues>({
  open,
  setOpen,
}: IAuthenticationChildrenDrawer<T>) => {
  const router = useRouter();

  const formControls = useForm();

  const onSubmit = () => {
    router.push('/login');
  };

  return (
    <FormProvider {...formControls}>
      <AuthenticationDrawer
        title={'Password changed!'}
        description={'Your password has been changed successfully.'}
        icon={
          <CircleCheck className="w-full h-full fill-secondary-light stroke-white" />
        }
        buttonLabel={'Log in'}
        onSubmit={onSubmit}
        open={open}
        setOpen={setOpen}
      />
    </FormProvider>
  );
};

/**
 * A success verification drawer component to confirm the email verification
 */
export const SuccessVerificationDrawer = <T extends FieldValues>({
  open,
  setOpen,
}: IAuthenticationChildrenDrawer<T>) => {
  const router = useRouter();

  const formControls = useForm();

  const onSubmit = () => {
    router.push('/login');
  };
  return (
    <FormProvider {...formControls}>
      <AuthenticationDrawer
        title={'Email verification is complete!'}
        description={[
          'Your email has been successfully verified.',
          'You can now log in to your account.',
        ]}
        icon={
          <CircleCheck className="w-full h-full fill-secondary-light stroke-white" />
        }
        buttonLabel={'Log in'}
        onSubmit={onSubmit}
        open={open}
        setOpen={setOpen}
      />
    </FormProvider>
  );
};

interface IFailedVerificationDrawer<T extends FieldValues>
  extends IAuthenticationChildrenDrawer<T> {
  errorMessages: string;
}

/**
 * A failed verification drawer component to show the error message and resend email button
 */
export const ExpiredVerificationTokenDrawer = <T extends FieldValues>({
  open,
  setOpen,
  errorMessages,
  onSubmit,
}: IFailedVerificationDrawer<T>) => {
  return (
    <AuthenticationDrawer
      title={'Email verification has failed'}
      description={
        errorMessages || 'We could not verify your email. Please try again.'
      }
      icon={<MailWarning className="w-full h-full stroke-destructive" />}
      buttonLabel={'Resend email'}
      onSubmit={onSubmit}
      open={open}
      setOpen={setOpen}
    />
  );
};
