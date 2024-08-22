import { FormProvider, useForm } from 'react-hook-form';
import { toast } from '../../../use-toast';
import { api } from '@/lib/hono';
import { revalidatePage } from '@/actions/revalidation';
import { usePathname } from 'next/navigation';
import { TOAST_TEXTS } from '@/constants/toast-texts';
import { TaskDeletionDrawerContent } from '@/components/ui/drawers/deletions/without-checkbox/TaskDeletionDrawerContent';

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

  const formControls = useForm();

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
    <FormProvider {...formControls}>
      <TaskDeletionDrawerContent
        title={title}
        open={open}
        setOpen={setOpen}
        onSubmit={onSubmit}
      />
    </FormProvider>
  );
};
