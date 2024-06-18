import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';

interface IDeleteTaskDrawerProps {
  title: string;
  open: boolean;
  setOpen: (value: boolean) => void;
}

/**
 * A drawer component to delete a task
 */
export const DeleteTaskDrawer = ({
  title,
  open,
  setOpen,
}: IDeleteTaskDrawerProps) => {
  const { handleSubmit } = useForm();

  // TODO: Implement the delete click functionality
  const onSubmit = () => {
    setOpen(false);
  };

  return (
    <Drawer open={open}>
      <DrawerTrigger />
      <DrawerContent asChild>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DrawerTitle>Delete</DrawerTitle>
          <DrawerDescription>
            <p className={'text-base mt-4'}>
              You want to delete &quot;{title}&quot; ?
            </p>
          </DrawerDescription>
          <DrawerFooter className={'flex justify-between'}>
            <Button
              type={'button'}
              variant={'outline'}
              onClick={() => setOpen(false)}
              className={'flex-1'}
            >
              Cancel
            </Button>
            <Button
              type={'submit'}
              variant={'destructive'}
              className={'flex-1'}
            >
              Delete
            </Button>
          </DrawerFooter>
        </form>
      </DrawerContent>
    </Drawer>
  );
};
