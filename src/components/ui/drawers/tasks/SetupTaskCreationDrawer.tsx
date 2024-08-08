import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { taskCreationSchema, taskUpdateSchema } from '@/constants/schema';
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
  onUpsertTask: (task: ITask) => void;
}

/**
 * A drawer component to create or edit a task for the setup page
 */
export const SetupTaskCreationDrawer = ({
  category,
  task,
  editOpen,
  setEditOpen,
  onUpsertTask,
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
    const newTask = {
      id: task?.id || self.crypto.randomUUID(),
      categoryId: category.id,
      title: data.title || '',
      description: data.description || '',
    };
    onUpsertTask(newTask);
    setConfirmOpen(false);
  };

  return (
    <FormProvider {...formControls}>
      <TaskCreationDrawerContent
        category={category}
        task={task}
        editOpen={editOpen}
        setEditOpen={setEditOpen}
        confirmOpen={confirmOpen}
        setConfirmOpen={setConfirmOpen}
        onSubmit={onSubmit}
      />
    </FormProvider>
  );
};
