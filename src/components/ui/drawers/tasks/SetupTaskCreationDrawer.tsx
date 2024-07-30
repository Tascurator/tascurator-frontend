import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { taskCreationSchema, taskUpdateSchema } from '@/constants/schema';
import type { ITask, ICategoryWithoutTasks } from '@/types/commons';
import {
  TaskDrawerContent,
  TTaskSchema,
} from '@/components/ui/drawers/tasks/TaskDrawerContent';
import { useState } from 'react';

interface ISetupTaskCreationDrawer {
  task?: ITask;
  category: ICategoryWithoutTasks;
  editOpen: boolean;
  setEditOpen: (value: boolean) => void;
}

/**
 * A drawer component to create a new task or edit an existing task
 *
 * If task is passed, the drawer will be in edit mode.
 * Otherwise, the drawer will be in create mode.
 *
 * @param category - The category object to which the task belongs
 * @param task - The task object to be edited
 * @param editOpen - The state of the drawer
 * @param setEditOpen - The function to set the state of the drawer
 *
 * @example
 * const [editOpen, setEditOpen] = useState(false);
 *
 * // To create a new task
 * const category = {
 * id: '1'
 * title: 'Kitchen',
 * };
 * <TaskCreationDrawer editOpen={editOpen} setEditOpen={setEditOpen} category={category}/>
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
 * <TaskCreationDrawer editOpen={editOpen} setEditOpen={setEditOpen} task={task} category={category} />
 */
export const SetupTaskCreationDrawer = ({
  category,
  task,
  editOpen,
  setEditOpen,
}: ISetupTaskCreationDrawer) => {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const formControls = useForm<TTaskSchema>({
    resolver: zodResolver(task ? taskUpdateSchema : taskCreationSchema),
    mode: 'onBlur',
    defaultValues: {
      categoryId: category?.id,
      title: task?.title || '',
      description: task?.description || '',
    },
  });

  const onSubmit: SubmitHandler<TTaskSchema> = (data) => {
    // Please add the logic to handle the tenant data for a new share house
    console.log(data);
  };

  return (
    <FormProvider {...formControls}>
      <TaskDrawerContent
        category={category}
        editOpen={editOpen}
        setEditOpen={setEditOpen}
        confirmOpen={confirmOpen}
        setConfirmOpen={setConfirmOpen}
        onSubmit={onSubmit}
      />
    </FormProvider>
  );
};
