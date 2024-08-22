import { FormProvider, useForm } from 'react-hook-form';
import { TaskDeletionDrawerContent } from '@/components/ui/drawers/deletions/without-checkbox/TaskDeletionDrawerContent';

interface ISetupTaskDeletionDrawerProps {
  title: string;
  open: boolean;
  setOpen: (value: boolean) => void;
  taskId: string;
  onDelete: (taskId: string) => void;
}

/**
 * A drawer component to delete a task for the setup page
 */
export const SetupTaskDeletionDrawer = ({
  title,
  open,
  setOpen,
  taskId,
  onDelete,
}: ISetupTaskDeletionDrawerProps) => {
  const formControls = useForm();

  const onSubmit = () => {
    // Please add the logic to handle the task deletion for a new share house
    onDelete(taskId);
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
