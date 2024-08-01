import { CommonDrawer } from '@/components/ui/commons/CommonDrawer';
import {
  DrawerClose,
  DrawerDescription,
  DrawerFooter,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';

interface ITaskDeletionDrawerContentProps {
  title: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  onSubmit: () => void;
}

export const TaskDeletionDrawerContent = ({
  title,
  open,
  setOpen,
  onSubmit,
}: ITaskDeletionDrawerContentProps) => {
  return (
    <CommonDrawer
      title={'Delete'}
      open={open}
      setOpen={setOpen}
      onSubmit={onSubmit}
    >
      <DrawerDescription asChild>
        <p className={'mt-8'}>You want to delete &quot;{title}&quot; ?</p>
      </DrawerDescription>
      <DrawerFooter className={'flex justify-between'}>
        <DrawerClose asChild>
          <Button type={'button'} variant={'outline'} className={'flex-1'}>
            Cancel
          </Button>
        </DrawerClose>

        <Button type={'submit'} variant={'destructive'} className={'flex-1'}>
          Delete
        </Button>
      </DrawerFooter>
    </CommonDrawer>
  );
};
