import { FormProvider, useForm } from 'react-hook-form';
import { TaskDeletionDrawerContent } from '@/components/ui/drawers/deletions/without-checkbox/TaskDeletionDrawerContent';

interface ISetupTaskDeletionDrawerProps {
  title: string;
  open: boolean;
  setOpen: (value: boolean) => void;
  taskId: string;
}

export const SetupTaskDeletionDrawer = ({
  title,
  open,
  setOpen,
  taskId,
}: ISetupTaskDeletionDrawerProps) => {
  const formControls = useForm();

  const onSubmit = () => {
    // Please add the logic to handle the task deletion for a new share house
    console.log(taskId);
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
