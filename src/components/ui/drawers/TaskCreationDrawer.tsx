import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  BoldIcon,
  ListIcon,
  ListOrderedIcon,
  UnderlineIcon,
} from 'lucide-react';

const toolbarIcons = [
  {
    name: 'bold',
    icon: <BoldIcon className={'size-5'} />,
  },
  {
    name: 'underline',
    icon: <UnderlineIcon className={'size-5'} />,
  },
  {
    name: 'list',
    icon: <ListIcon className={'size-5'} />,
  },
  {
    name: 'listOrdered',
    icon: <ListOrderedIcon className={'size-5'} />,
  },
];

interface ITaskCreationDrawer {
  taskId?: string;
  category?: string;
  title?: string;
  description?: string;
  open: boolean;
  setOpen: (value: boolean) => void;
}

export const TaskCreationDrawer = ({
  taskId,
  category,
  title,
  description,
  open,
  setOpen,
}: ITaskCreationDrawer) => {
  const handleSaveClick = () => {};

  const handleCancelClick = () => setOpen(false);

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger />
      <DrawerContent className={'h-5/6'}>
        <DrawerHeader>
          <DrawerTitle>Edit Task</DrawerTitle>
        </DrawerHeader>
        <DrawerDescription
          className={'flex-1 flex flex-col justify-center items-start'}
        >
          <p className={'font-medium'}>Category</p>
          <Input
            type="text"
            defaultValue={category}
            placeholder="Category name"
            className={'mt-1.5'}
            // Disable the input field if category is present
            disabled={!!category}
          />

          <p className={'pt-4 font-medium'}>Task title</p>
          <Input
            type="text"
            defaultValue={title}
            placeholder="Task name"
            className={'mt-1.5'}
          />

          <p className={'pt-4 font-medium'}>Task description</p>
          <div className="flex-1 w-full flex flex-col mt-1.5 rounded-xl border border-input border-slate-400 bg-white ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
            <div className="flex justify-between items-center px-6 bg-slate-100 rounded-t-xl">
              {toolbarIcons.map(({ name, icon }) => (
                <button
                  key={`${taskId}-${name}`}
                  className="size-12 flex justify-center items-center focus:outline-none"
                >
                  {icon}
                </button>
              ))}
            </div>
            <textarea
              placeholder="Task description"
              defaultValue={description}
              className={
                'flex-1 mt-1.5 mb-4 mx-3 text-lg rounded-b-xl resize-none focus:outline-none focus:ring-transparent'
              }
            />
          </div>
        </DrawerDescription>
        <DrawerFooter>
          <Button variant={'secondary'} onClick={handleCancelClick}>
            Cancel
          </Button>
          <Button onClick={handleSaveClick}>Save</Button>
        </DrawerFooter>
        <DrawerClose />
      </DrawerContent>
    </Drawer>
  );
};
