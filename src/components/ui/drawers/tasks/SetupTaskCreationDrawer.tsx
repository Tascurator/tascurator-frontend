import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { taskCreationSchema, taskUpdateSchema } from '@/constants/schema';
// import { taskCreationSchema, taskUpdateSchema, TTaskCreationSchema } from '@/constants/schema';
import type { ITask, ICategoryWithoutTasks } from '@/types/commons';
import {
  TaskCreationDrawerContent,
  TTaskSchema,
} from '@/components/ui/drawers/tasks/TaskCreationDrawerContent';
import { useState } from 'react';

interface ISetupTaskCreationDrawer {
  task?: ITask;
  category: ICategoryWithoutTasks;
  editOpen: boolean;
  setEditOpen: (value: boolean) => void;
  addTask: (task: ITask) => void;
}

/**
 * A drawer component to create or edit a task for the setup page
 */
export const SetupTaskCreationDrawer = ({
  category,
  task,
  editOpen,
  setEditOpen,
  addTask,
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

  const {
    // register,
    // handleSubmit,
    reset,
    // formState: { errors },
  } = formControls;

  // const onSubmit: SubmitHandler<TTaskCreationSchema> = (data) => {
  const onSubmit: SubmitHandler<TTaskSchema> = (data) => {
    // Please add the logic to handle the tenant data for a new share house
    const newTask = {
      id: task?.id || self.crypto.randomUUID(),
      categoryId: category.id,
      title: data.title || '',
      description: data.description || '',
    };
    // console.log(newTask);
    addTask(newTask);
    setConfirmOpen(false);
    reset();
  };

  return (
    <FormProvider {...formControls}>
      <TaskCreationDrawerContent
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
