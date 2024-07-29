import { useState } from 'react';
import { SubmitHandler } from 'react-hook-form';
import { TTaskCreationSchema, TTaskUpdateSchema } from '@/constants/schema';
import type { ICategoryWithoutTasks, ITask } from '@/types/commons';
import { EditTaskDrawerContent } from '@/components/ui/drawers/tasks/EditTaskDrawerContent';
import { ConfirmTaskDrawerContent } from '@/components/ui/drawers/tasks/ConfirmTaskDrawerContent';

export type TTaskSchema = TTaskCreationSchema | TTaskUpdateSchema;

interface ITaskDrawerContent {
  task?: ITask;
  category: ICategoryWithoutTasks;
  open: boolean;
  setOpen: (value: boolean) => void;
  onSubmit: SubmitHandler<TTaskSchema>;
}

export const TaskDrawerContent = ({
  category,
  task,
  open,
  setOpen,
  onSubmit,
}: ITaskDrawerContent) => {
  const [confirmationOpen, setConfirmationOpen] = useState(false);

  const openConfirmationDrawer = () => {
    setOpen(false);
    setConfirmationOpen(true);
  };

  const closeConfirmationDrawer = () => {
    setConfirmationOpen(false);
    setOpen(true);
  };

  return (
    <>
      <EditTaskDrawerContent
        category={category}
        task={task}
        open={open}
        setOpen={setOpen}
        openConfirmationDrawer={openConfirmationDrawer}
      />

      <ConfirmTaskDrawerContent
        category={category}
        open={confirmationOpen}
        setOpen={setConfirmationOpen}
        closeConfirmationDrawer={closeConfirmationDrawer}
        onSubmit={onSubmit}
      />
    </>
  );
};
