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
        <div>
          {`You want to delete "`}
          <span className="font-medium text-red-600 px-1">{title}</span>
          {`" ?`}
        </div>
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
