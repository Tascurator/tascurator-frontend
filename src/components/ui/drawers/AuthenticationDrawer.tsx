import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';

import { MailCheck, CircleCheck } from 'lucide-react';

import { ReactNode } from 'react';
import Link from 'next/link';

interface IAuthenticationDrawer {
  title: string;
  description: string | string[];
  icon: ReactNode;
  button: ReactNode;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void | null;
  open: boolean;
  setOpen: (value: boolean) => void;
}

const AuthenticationDrawer = ({
  title,
  description,
  icon,
  button,
  handleSubmit,
  open,
  setOpen,
}: IAuthenticationDrawer) => {
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger />
      <DrawerContent asChild>
        <form onSubmit={handleSubmit}>
          <DrawerTitle>{title}</DrawerTitle>
          <DrawerDescription>
            <div className={'w-20 h-20 mx-auto'}>{icon}</div>
            <div className={'mt-2.5'}>
              {Array.isArray(description) ? (
                description.map((desc, index) => <p key={index}>{desc}</p>)
              ) : (
                <p>{description}</p>
              )}
            </div>
          </DrawerDescription>
          <DrawerFooter>
            <DrawerClose asChild>{button}</DrawerClose>
          </DrawerFooter>
        </form>
      </DrawerContent>
    </Drawer>
  );
};

interface IAuthenticationChildrenDrawer {
  open: boolean;
  setOpen: (value: boolean) => void;
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
 * // To show the email sent message and resend email button
 * <EmailSentDrawer open={open} setOpen={setOpen} />
 *
 * // To show the password changed message
 * <PasswordChangedDrawer open={open} setOpen={setOpen} />
 */

/**
 * A email sent drawer component to confirm the task creation or update
 */
export const EmailSentDrawer = ({
  open,
  setOpen,
}: IAuthenticationChildrenDrawer) => {
  const button = <Button type={'submit'}>Resend Email</Button>;

  //TODO: Add the request(form) to resend the email
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setOpen(false);
  };

  return (
    <>
      <AuthenticationDrawer
        title={'Email Sent!'}
        description={[
          'We have sent you an email.',
          'Please check your email within 3 hours and complete the update.',
        ]}
        icon={<MailCheck className="w-full h-full stroke-secondary-light" />}
        button={button}
        handleSubmit={handleSubmit}
        open={open}
        setOpen={setOpen}
      />
    </>
  );
};

/**
 * A password changed drawer component to confirm the task creation or update
 */
export const PasswordChangedDrawer = ({
  open,
  setOpen,
}: IAuthenticationChildrenDrawer) => {
  const button = (
    <Link href="/">
      <Button type={'button'}>Log In</Button>
    </Link>
  );

  return (
    <>
      <AuthenticationDrawer
        title={'Password changed!'}
        description={'Your password has been changed successfully.'}
        icon={
          <CircleCheck className="w-full h-full fill-secondary-light stroke-white" />
        }
        button={button}
        handleSubmit={() => null}
        open={open}
        setOpen={setOpen}
      />
    </>
  );
};
