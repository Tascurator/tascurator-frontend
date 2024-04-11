'user client';
import { CirclePlus } from 'lucide-react';
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
import { Button } from '@/components/ui/button';
import { Input } from './input';

type CategoryCreateButtonProps = {
  title: string;
};

export const CategoryCreateButton = ({ title }: CategoryCreateButtonProps) => {
  return (
    <Drawer>
      <div className="flex justify-between items-center w-full">
        <p className="text-xl">{title}</p>
        <DrawerTrigger className="p-3">
          <CirclePlus className="stroke-primary" />
        </DrawerTrigger>
      </div>

      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Create task</DrawerTitle>
          <DrawerDescription>
            <div className="mb-4">
              <p className="mb-1">Category name</p>
              <Input placeholder="Category name" />
            </div>
            <div className="mb-4">
              <p className="mb-1">Task title</p>
              <Input placeholder="Task title" />
            </div>
            <div className="mb-4">
              <p className="mb-1">Task description</p>
              <Input placeholder="Task description" />
            </div>
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button>Cancel</Button>
          </DrawerClose>
          <Button>Submit</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
