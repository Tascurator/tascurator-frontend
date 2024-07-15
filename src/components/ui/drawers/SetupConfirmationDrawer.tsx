'use client';
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
  DrawerTrigger,
  DrawerClose,
} from '@/components/ui/drawer';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';

interface ISetupConfirmationDrawer {
  open: boolean;
  setOpen: (value: boolean) => void;
}

export const SetupConfirmationDrawer = ({
  open,
  setOpen,
}: ISetupConfirmationDrawer) => {
  const { handleSubmit } = useForm();

  const onSubmit = () => {
    setTimeout(() => {
      setOpen(false);
    }, 1000);
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger />
      <DrawerContent>
        <DrawerTitle>Confirm</DrawerTitle>
        <DrawerDescription>
          <p className="mt-8">Setup complete</p>
        </DrawerDescription>
        <DrawerFooter className="flex justify-between">
          <DrawerClose asChild>
            <Button type="button" variant="outline" className="flex-1">
              Cancel
            </Button>
          </DrawerClose>
          <Button
            type="submit"
            // variant="destructive"
            className="flex-1"
            onClick={handleSubmit(onSubmit)}
          >
            Create
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
