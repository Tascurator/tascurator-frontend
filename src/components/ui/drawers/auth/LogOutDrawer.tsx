import {
  DrawerClose,
  DrawerDescription,
  DrawerFooter,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { CommonDrawer } from '@/components/ui/commons/CommonDrawer';
import { logout } from '@/actions/logout';
import { FormProvider, useForm } from 'react-hook-form';

interface ILogOutDrawer {
  open: boolean;
  setOpen: (value: boolean) => void;
}

/**
 * A drawer component to log out the user
 *
 * @param open - The state of the drawer
 * @param setOpen - The function to set the state of the drawer
 *
 * @example
 * const [open, setOpen] = useState(false);
 *
 * <LogOutDrawer open={open} setOpen={setOpen} />
 *
 */

export const LogOutDrawer = ({ open, setOpen }: ILogOutDrawer) => {
  const formControls = useForm();

  const onSubmit = async () => {
    await logout();
    setOpen(false);
  };

  return (
    <>
      <FormProvider {...formControls}>
        <CommonDrawer
          title="Log out?"
          open={open}
          setOpen={setOpen}
          onSubmit={onSubmit}
        >
          <DrawerDescription asChild>
            <p className={'mt-2.5'}>Are you sure you want to log out?</p>
          </DrawerDescription>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button type={'button'} variant={'outline'} className={'flex-1'}>
                Cancel
              </Button>
            </DrawerClose>
            <Button
              type={'submit'}
              variant={'outline-destructive'}
              className={'flex-1'}
            >
              Log out
            </Button>
          </DrawerFooter>
        </CommonDrawer>
      </FormProvider>
    </>
  );
};
