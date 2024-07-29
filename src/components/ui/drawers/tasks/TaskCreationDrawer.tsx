import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  taskCreationSchema,
  taskUpdateSchema,
  TTaskCreationSchema,
  TTaskUpdateSchema,
} from '@/constants/schema';
import type { ITask, ICategoryWithoutTasks } from '@/types/commons';
import { toast } from '@/components/ui/use-toast';
import { TOAST_TEXTS } from '@/constants/toast-texts';
import { api } from '@/lib/hono';
import { revalidatePage } from '@/actions/revalidation';
import { usePathname } from 'next/navigation';
import { TaskDrawerContent } from '@/components/ui/drawers/tasks/TaskDrawerContent';

interface ITaskCreationDrawer {
  task?: ITask;
  category: ICategoryWithoutTasks;
  open: boolean;
  setOpen: (value: boolean) => void;
}

/**
 * A drawer component to create a new task or edit an existing task
 *
 * If task is passed, the drawer will be in edit mode.
 * Otherwise, the drawer will be in create mode.
 *
 * @param category - The category object to which the task belongs
 * @param task - The task object to be edited
 * @param open - The state of the drawer
 * @param setOpen - The function to set the state of the drawer
 *
 * @example
 * const [open, setOpen] = useState(false);
 *
 * // To create a new task
 * const category = {
 * id: '1'
 * title: 'Kitchen',
 * };
 * <TaskCreationDrawer open={open} setOpen={setOpen} type={'creation'} category={category}/>
 *
 * // To edit an existing task
 * const category = {
 * id: '1'
 * title: 'Kitchen',
 * };
 *
 * const task = {
 *  id: '1',
 *  title: 'Clean the kitchen',
 *  description: 'Clean the kitchen and make it shine.',
 * };
 * <TaskCreationDrawer open={open} setOpen={setOpen} task={task} category={category} type={'edit'}/>
 */
export const TaskCreationDrawer = ({
  category,
  task,
  open,
  setOpen,
}: ITaskCreationDrawer) => {
  const path = usePathname();

  const formControls = useForm<TTaskCreationSchema | TTaskUpdateSchema>({
    resolver: zodResolver(task ? taskUpdateSchema : taskCreationSchema),
    mode: 'onBlur',
    defaultValues: {
      categoryId: category?.id,
      title: task?.title || '',
      description: task?.description || '',
    },
  });

  const {
    reset,
    formState: { dirtyFields },
  } = formControls;

  const onSubmit: SubmitHandler<
    TTaskCreationSchema | TTaskUpdateSchema
  > = async (data) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    try {
      // For edit an existing task
      if (task) {
        // if no change for both title and description, return without doing anything
        if (!dirtyFields.title && !dirtyFields.description) {
          setOpen(false);
          return;
        }
        // if no change, delete the title from the data object
        if (!dirtyFields.title) {
          delete data.title;
        }
        // if no change, delete the description from the data object
        if (!dirtyFields.description) {
          delete data.description;
        }

        // check if task has id
        if (task?.id) {
          const resEditData = await api.task[':taskId'].$patch({
            param: {
              taskId: task.id,
            },
            json: {
              title: data.title,
              description: data.description,
            },
          });
          const editData = await resEditData.json();
          if ('error' in editData) {
            throw new Error(editData.error);
          }
        }
      } else {
        // For creation a new task
        const creationData = data as TTaskCreationSchema; // To make the type explicit for submit data type
        const resNewData = await api.task.$post({
          json: {
            categoryId: category.id,
            title: creationData.title,
            description: creationData.description,
          },
        });
        const newData = await resNewData.json();
        if ('error' in newData) {
          throw new Error(newData.error);
        }
      }

      toast({
        variant: 'default',
        description: TOAST_TEXTS.success,
      });
      revalidatePage(path);
      setOpen(false);
      if (!task) {
        reset();
      }
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
      <TaskDrawerContent
        category={category}
        open={open}
        setOpen={setOpen}
        onSubmit={onSubmit}
      />
    </FormProvider>
  );
};
