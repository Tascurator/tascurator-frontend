import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  taskCreationSchema,
  taskUpdateSchema,
  TTaskCreationSchema,
  TTaskUpdateSchema,
} from '@/constants/schema';
import type { ITask, ICategoryWithoutTasks } from '@/types/commons';
import { TaskDrawerContent } from '@/components/ui/drawers/tasks/TaskDrawerContent';

interface ISetupTaskCreationDrawer {
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
export const SetupTaskCreationDrawer = ({
  category,
  task,
  open,
  setOpen,
}: ISetupTaskCreationDrawer) => {
  const formControls = useForm<TTaskCreationSchema | TTaskUpdateSchema>({
    resolver: zodResolver(task ? taskUpdateSchema : taskCreationSchema),
    mode: 'onBlur',
    defaultValues: {
      categoryId: category?.id,
      title: task?.title || '',
      description: task?.description || '',
    },
  });

  const onSubmit: SubmitHandler<TTaskCreationSchema | TTaskUpdateSchema> = (
    data,
  ) => {
    // Please add the logic to handle the tenant data for a new share house
    console.log(data);
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
