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

import { logout } from '@/actions/logout';
import { LoadingSpinner } from '../../loadingSpinner';
import { useState } from 'react';

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
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    await logout();
    setIsLoading(false);
    setOpen(false);
  };

  return (
    <>
      {isLoading && <LoadingSpinner isLoading={isLoading} />}

      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger />
        <DrawerContent asChild>
          <form onSubmit={handleLogout}>
            <DrawerTitle>Log out?</DrawerTitle>
            <DrawerDescription>
              <span className={'mt-2.5 block'}>
                Are you sure you want to log out?
              </span>
            </DrawerDescription>
            <DrawerFooter>
              <DrawerClose asChild>
                <Button
                  type={'button'}
                  variant={'outline'}
                  className={'flex-1'}
                >
                  Cancel
                </Button>
              </DrawerClose>
              <Button
                type={'submit'}
                variant={'outline-destructive'}
                className={'flex-1'}
              >
                Log Out
              </Button>
            </DrawerFooter>
          </form>
        </DrawerContent>
      </Drawer>
    </>
  );
};
