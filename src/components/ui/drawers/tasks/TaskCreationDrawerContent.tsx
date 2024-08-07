import { SubmitHandler } from 'react-hook-form';
import { TTaskCreationSchema, TTaskUpdateSchema } from '@/constants/schema';
import type { ICategoryWithoutTasks, ITask } from '@/types/commons';
import { EditTaskDrawerContent } from '@/components/ui/drawers/tasks/EditTaskDrawerContent';
import { ConfirmTaskDrawerContent } from '@/components/ui/drawers/tasks/ConfirmTaskDrawerContent';

export type TTaskSchema = TTaskCreationSchema | TTaskUpdateSchema;

interface ITaskDrawerContent {
  task?: ITask;
  category: ICategoryWithoutTasks;
  editOpen: boolean;
  setEditOpen: (value: boolean) => void;
  confirmOpen: boolean;
  setConfirmOpen: (value: boolean) => void;
  // onSubmit: SubmitHandler<TTaskCreationSchema>;
  onSubmit: SubmitHandler<TTaskSchema>;
}

export const TaskCreationDrawerContent = ({
  category,
  task,
  editOpen,
  setEditOpen,
  confirmOpen,
  setConfirmOpen,
  onSubmit,
}: ITaskDrawerContent) => {
  const openConfirmationDrawer = () => {
    setEditOpen(false);
    setConfirmOpen(true);
  };

  const closeConfirmationDrawer = () => {
    setConfirmOpen(false);
    setEditOpen(true);
  };

  return (
    <>
      <EditTaskDrawerContent
        category={category}
        task={task}
        editOpen={editOpen}
        setEditOpen={setEditOpen}
        openConfirmationDrawer={openConfirmationDrawer}
      />

      <ConfirmTaskDrawerContent
        category={category}
        confirmOpen={confirmOpen}
        setConfirmOpen={setConfirmOpen}
        closeConfirmationDrawer={closeConfirmationDrawer}
        onSubmit={onSubmit}
      />
    </>
  );
};
