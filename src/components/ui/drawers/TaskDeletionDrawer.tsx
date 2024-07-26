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
import { api } from '@/lib/hono';
import { revalidatePage } from '@/actions/revalidation';
import { usePathname } from 'next/navigation';
import { TOAST_TEXTS } from '@/constants/toast-texts';

interface ITaskDeletionDrawer {
  title: string;
  open: boolean;
  setOpen: (value: boolean) => void;
  taskId: string;
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
  taskId,
}: ITaskDeletionDrawer) => {
  const path = usePathname();

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = useForm();

  const onSubmit = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    try {
      const res = await api.task[':taskId'].$delete({
        param: {
          taskId,
        },
      });
      const data = await res.json();
      if ('error' in data) {
        throw new Error(data.error);
      }
      toast({
        variant: 'default',
        description: TOAST_TEXTS.success,
      });
      revalidatePage(path);
    } catch (error) {
      if (error instanceof Error) {
        toast({
          variant: 'destructive',
          description: error.message,
        });
      }
    }
  };

  return (
    <>
      {isSubmitting ? <LoadingSpinner isLoading={true} /> : ''}
      <Drawer open={open} onOpenChange={setOpen} modal={!isSubmitting}>
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
