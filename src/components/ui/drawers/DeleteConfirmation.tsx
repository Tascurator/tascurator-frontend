import { useState } from 'react';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

export interface IDeleteConfirmationProps {
  deleteItem: string;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const DeleteConfirmation = ({
  deleteItem,
  open,
  setOpen,
}: IDeleteConfirmationProps) => {
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = () => {
    setIsChecked((prevChecked) => !prevChecked);
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger />
      <DrawerContent>
        <DrawerClose />
        <DrawerTitle>Confirm delete</DrawerTitle>
        <DrawerDescription>
          {`Are you sure you want to delete ${deleteItem}?`}
          <div className="flex items-center content-start pt-4">
            <Checkbox
              checked={isChecked}
              onCheckedChange={handleCheckboxChange}
            />
            <p>{`Yes, I want to delete ${deleteItem}.`}</p>
          </div>
        </DrawerDescription>
        <DrawerFooter>
          <div className="flex-1">
            <DrawerClose asChild>
              <Button
                type={'button'}
                variant={'secondary'}
                className={'flex-1'}
              >
                Cancel
              </Button>
            </DrawerClose>
          </div>
          <div className="flex-1">
            <Button variant="destructive" disabled={!isChecked}>
              Delete
            </Button>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
