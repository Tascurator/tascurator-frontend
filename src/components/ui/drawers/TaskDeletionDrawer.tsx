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

interface ITaskDeletionDrawer {
  title: string;
  open: boolean;
  setOpen: (value: boolean) => void;
}

/**
 * A drawer component to delete a task
 */
export const TaskDeletionDrawer = ({
  title,
  open,
  setOpen,
}: ITaskDeletionDrawer) => {
  const { handleSubmit } = useForm();

  // TODO: Implement the delete click functionality
  const onSubmit = () => {
    setTimeout(() => {
      setOpen(false);
    }, 1000);
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger />
      <DrawerContent asChild>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DrawerTitle>Delete</DrawerTitle>
          <DrawerDescription className={'text-base mt-4'}>
            You want to delete &quot;{title}&quot; ?
          </DrawerDescription>
          <DrawerFooter className={'flex justify-between'}>
            <DrawerClose asChild>
              <Button type={'button'} variant={'outline'} className={'flex-1'}>
                Cancel
              </Button>
            </DrawerClose>

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
