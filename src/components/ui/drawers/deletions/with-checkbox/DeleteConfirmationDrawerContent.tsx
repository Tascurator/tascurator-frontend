import { CommonDrawer } from '@/components/ui/commons/CommonDrawer';
import {
  DrawerClose,
  DrawerDescription,
  DrawerFooter,
} from '@/components/ui/drawer';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

interface IDeleteDrawerContentProps {
  idType: 'sharehouse' | 'category' | 'tenant';
  deleteItem: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  onSubmit: () => void;
}

export const DeleteConfirmationDrawerContent = ({
  idType,
  deleteItem,
  open,
  setOpen,
  onSubmit,
}: IDeleteDrawerContentProps) => {
  const [isChecked, setIsChecked] = useState(false);
  const handleCheckboxChange = () => {
    setIsChecked((prevChecked) => !prevChecked);
  };

  useEffect(() => {
    if (!open) {
      // Reset checkbox state when drawer is closed
      setIsChecked(false);
    }
  }, [open]);

  return (
    <CommonDrawer
      title={`Delete ${idType === 'sharehouse' ? 'share house' : idType === 'category' ? 'category' : 'tenant'}`}
      open={open}
      setOpen={setOpen}
      onSubmit={onSubmit}
    >
      <DrawerDescription asChild>
        <div>
          This action cannot be undone. Are you sure you want to proceed with
          the deletion?
          <div className="flex items-center mt-4">
            <label className="flex items-center cursor-pointer">
              <Checkbox
                checked={isChecked}
                onCheckedChange={handleCheckboxChange}
                className="mr-4"
              />
              <div className="flex">
                <p className="font-medium">
                  {`Yes, I want to delete "`}
                  <span className="text-red-600 px-1">{deleteItem}</span>
                  {`".`}
                </p>
              </div>
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
    </CommonDrawer>
  );
};
