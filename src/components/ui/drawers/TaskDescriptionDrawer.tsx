import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Skeleton } from '../skeleton';
import { useEffect, useState } from 'react';

interface ITaskDescriptionDrawer {
  title: string;
  description: string;
  open: boolean;
  setOpen: (value: boolean) => void;
}

/**
 * A drawer component to log out the user
 *
 * @param title - The title of the task
 * @param description - The description of the task
 * @param open - The state of the drawer
 * @param setOpen - The function to set the state of the drawer
 *
 * @example
 * const [open, setOpen] = useState(false);
 *
 * <TaskDescriptionDrawer open={open} setOpen={setOpen} title={currentTask.title} description={currentTask.description} />
 *
 */

export const TaskDescriptionDrawer = ({
  title,
  description,
  open,
  setOpen,
}: ITaskDescriptionDrawer) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (open) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [open]);

  const handleLogout = () => {
    setOpen(false);
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger />
      <DrawerContent asChild>
        <form onSubmit={handleLogout}>
          <DrawerTitle>{title}</DrawerTitle>
          <DrawerDescription>
            {isLoading ? <Skeleton className="h-64" /> : <>{description}</>}
          </DrawerDescription>
        </form>
      </DrawerContent>
    </Drawer>
  );
};
