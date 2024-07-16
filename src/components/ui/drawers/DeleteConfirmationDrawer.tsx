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
import { useForm } from 'react-hook-form';

export interface IDeleteConfirmationDrawerProps {
  deleteItem: string;
  open: boolean;
  setOpen: (open: boolean) => void;
}

/**
 * The DeleteConfirmationDrawer component is used to confirm the deletion of an item.
 *
 * @example
 * const [open, setOpen] = useState(false);
 * const deleteItem = 'item';
 *
 * @param {string} deleteItem - The item to be deleted.
 * @param {boolean} open - The state of the drawer.
 * @param {function} setOpen - The function to set the state of the drawer.
 *
 * <DeleteConfirmationDrawer
 *   deleteItem={'item'}
 *   open={open}
 *   setOpen={setOpen}
 * />
 */
export const DeleteConfirmationDrawer = ({
  deleteItem,
  open,
  setOpen,
}: IDeleteConfirmationDrawerProps) => {
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = () => {
    setIsChecked((prevChecked) => !prevChecked);
  };

  const { handleSubmit } = useForm();

  // TODO: Implement the delete click functionality
  const onSubmit = () => {
    setTimeout(() => {
      setOpen(false);
    }, 1000);
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger />
      <DrawerContent asChild>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DrawerTitle>Confirm delete</DrawerTitle>
          <DrawerDescription asChild>
            <div className={'mt-8'}>
              {`Are you sure you want to delete "${deleteItem}"?`}
              <div>
                <label
                  className={
                    'flex items-center content-start mt-4 gap-3 cursor-pointer'
                  }
                >
                  <Checkbox
                    checked={isChecked}
                    onCheckedChange={handleCheckboxChange}
                  />
                  <p>{`Yes, I want to delete "${deleteItem}".`}</p>
                </label>
              </div>
            </div>
          </DrawerDescription>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button type={'button'} variant={'outline'} className={'flex-1'}>
                Cancel
              </Button>
            </DrawerClose>
            <Button
              variant="destructive"
              disabled={!isChecked}
              className={'flex-1'}
            >
              Delete
            </Button>
          </DrawerFooter>
        </form>
      </DrawerContent>
    </Drawer>
  );
};
