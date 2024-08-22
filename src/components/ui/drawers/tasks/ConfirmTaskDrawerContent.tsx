import { DrawerDescription, DrawerFooter } from '@/components/ui/drawer';
import { TaskDescriptionRenderer } from '@/components/ui/drawers/tasks/task-description/TaskDescriptionRenderer';
import { Button } from '@/components/ui/button';
import { SubmitHandler, useFormContext } from 'react-hook-form';
import type { ICategoryWithoutTasks } from '@/types/commons';
import { CommonDrawer } from '@/components/ui/commons/CommonDrawer';
import { TTaskSchema } from '@/components/ui/drawers/tasks/TaskCreationDrawerContent';

interface IConfirmTaskDrawerContentProps {
  category: ICategoryWithoutTasks;
  confirmOpen: boolean;
  setConfirmOpen: (open: boolean) => void;
  closeConfirmationDrawer: () => void;
  onSubmit: SubmitHandler<TTaskSchema>;
}

export const ConfirmTaskDrawerContent = ({
  category,
  confirmOpen,
  setConfirmOpen,
  closeConfirmationDrawer,
  onSubmit,
}: IConfirmTaskDrawerContentProps) => {
  const {
    watch,
    formState: { isDirty },
  } = useFormContext<TTaskSchema>();

  return (
    <CommonDrawer
      title={watch('title') ?? ''}
      setOpen={(state) => {
        // Just close the confirmation drawer when the drawer is closed programmatically in onSubmit
        if (!confirmOpen && !state) {
          setConfirmOpen(false);
          return;
        }

        // Call custom close function to open the edit drawer while closing the confirmation drawer
        if (!state) {
          closeConfirmationDrawer();
          return;
        }

        setConfirmOpen(true);
      }}
      open={confirmOpen}
      className={'h-[90%]'}
      onSubmit={onSubmit}
    >
      <DrawerDescription className={'flex-1'} asChild>
        <div>
          <div
            className={
              'w-fit text-base px-2 py-1 mb-2 rounded-full text-gray-500 bg-slate-100'
            }
          >
            {category.name}
          </div>
          <TaskDescriptionRenderer />
        </div>
      </DrawerDescription>
      <DrawerFooter>
        <Button
          type={'button'}
          variant={'outline'}
          onClick={closeConfirmationDrawer}
          className={'flex-1'}
        >
          Cancel
        </Button>
        <Button type={'submit'} className={'flex-1'} disabled={!isDirty}>
          Publish
        </Button>
      </DrawerFooter>
    </CommonDrawer>
  );
};
