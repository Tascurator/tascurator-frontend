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
 *
 * @param title - The title to be edited
 * @param open - The state of the drawer
 * @param setOpen - The function to set the state of the drawer
 *
 * @example
 * AccordionTaskItem.tsx
 *
 * <TaskCreationDrawer
 *   task={{
 *     id,
 *     category,
 *     title,
 *     description,
 *   }}
 *   open={isDrawerOpen && userAction === 'edit'}
 *   setOpen={setIsDrawerOpen}
 * />
 *
 * <TaskDeletionDrawer
 *   title={title}
 *   open={isDrawerOpen && userAction === 'delete'}
 *   setOpen={setIsDrawerOpen}
 * />
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
          <DrawerDescription asChild>
            <p className={'mt-8'}>You want to delete &quot;{title}&quot; ?</p>
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
