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
import { LoadingSpinner } from '../loadingSpinner';
import { toast } from '../use-toast';
import { useState } from 'react';

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

  const [isLoading, setIsLoading] = useState(false);

  // TODO: Implement the delete click functionality
  const onSubmit = async () => {
    setIsLoading(true);
    setOpen(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (title) {
      console.log('title', title);
      setIsLoading(false);
      setOpen(false);
      toast({
        variant: 'default',
        description: 'Updated successfully!',
      });
    } else {
      setIsLoading(false);
      setOpen(false);
      toast({
        variant: 'destructive',
        description: 'error!',
      });
    }
  };

  return (
    <>
      {isLoading ? <LoadingSpinner isLoading={true} /> : ''}
      <Drawer open={open} onOpenChange={setOpen} modal={!isLoading}>
        <DrawerTrigger />
        <DrawerContent asChild>
          <form onSubmit={handleSubmit(onSubmit)}>
            <DrawerTitle>Delete</DrawerTitle>
            <DrawerDescription asChild>
              <p className={'mt-8'}>You want to delete &quot;{title}&quot; ?</p>
            </DrawerDescription>
            <DrawerFooter className={'flex justify-between'}>
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
                variant={'destructive'}
                className={'flex-1'}
              >
                Delete
              </Button>
            </DrawerFooter>
          </form>
        </DrawerContent>
      </Drawer>
    </>
  );
};
