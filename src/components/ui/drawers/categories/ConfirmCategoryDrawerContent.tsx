import { DrawerDescription, DrawerFooter } from '@/components/ui/drawer';
import { TaskDescriptionRendererForCategory } from '@/components/ui/drawers/tasks/task-description/TaskDescriptionRendererForCategory';
import { Button } from '@/components/ui/button';
import { SubmitHandler, useFormContext } from 'react-hook-form';
import { TCategoryCreationSchema } from '@/constants/schema';
import { CommonDrawer } from '@/components/ui/commons/CommonDrawer';

interface IConfirmCategoryDrawerContentProps {
  confirmOpen: boolean;
  setConfirmOpen: (open: boolean) => void;
  closeConfirmationDrawer: () => void;
  onSubmit: SubmitHandler<TCategoryCreationSchema>;
}

export const ConfirmCategoryDrawerContent = ({
  confirmOpen,
  setConfirmOpen,
  closeConfirmationDrawer,
  onSubmit,
}: IConfirmCategoryDrawerContentProps) => {
  const { watch } = useFormContext<TCategoryCreationSchema>();

  return (
    <CommonDrawer
      title={watch('task.title')}
      open={confirmOpen}
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
      className={'h-[90%]'}
      onSubmit={onSubmit}
    >
      <DrawerDescription className={'flex-1'}>
        <div
          className={
            'w-fit text-base px-2 py-1 mb-2 rounded-full text-gray-500 bg-slate-100'
          }
        >
          {watch('name')}
        </div>
        <TaskDescriptionRendererForCategory />
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
        <Button type={'submit'} className={'flex-1'}>
          Publish
        </Button>
      </DrawerFooter>
    </CommonDrawer>
  );
};
