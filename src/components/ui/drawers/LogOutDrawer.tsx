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
  //TODO: implement logout function
  const handleLogout = () => {
    setOpen(false);
  };

  return (
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
              <Button type={'button'} variant={'outline'} className={'flex-1'}>
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
  );
};
