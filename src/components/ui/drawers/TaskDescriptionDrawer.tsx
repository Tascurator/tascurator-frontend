import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';

interface ITaskDescriptionDrawer {
  title: string;
  description: string;
  open: boolean;
  setOpen: (value: boolean) => void;
}

/**
 * A drawer component to log out the user
 *
 * @param open - The state of the drawer
 * @param setOpen - The function to set the state of the drawer
 *
 * @example
 * const [open, setOpen] = useState(false);
 *
 * <TaskDescriptionDrawer open={open} setOpen={setOpen} />
 *
 */

export const TaskDescriptionDrawer = ({
  title,
  description,
  open,
  setOpen,
}: ITaskDescriptionDrawer) => {
  const handleLogout = () => {
    setOpen(false);
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger />
      <DrawerContent asChild>
        <form onSubmit={handleLogout}>
          <DrawerTitle>{title}</DrawerTitle>
          <DrawerDescription>{description}</DrawerDescription>
        </form>
      </DrawerContent>
    </Drawer>
  );
};
