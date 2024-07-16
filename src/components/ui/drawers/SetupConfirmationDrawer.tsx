'use client';
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
  DrawerTrigger,
  DrawerClose,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loadingSpinner';
import { toast } from '@/components/ui/use-toast';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import {
  TCategoryCreationSchema,
  TShareHouseNameSchema,
  TTaskCreationSchema,
  TCategoryNameSchema,
} from '@/constants/schema';

interface ISetupConfirmationDrawer {
  open: boolean;
  setOpen: (value: boolean) => void;
}
interface ISetupConfirmSchema {
  data:
    | TTaskCreationSchema
    | TCategoryCreationSchema
    | TShareHouseNameSchema
    | TCategoryNameSchema;
}

export const SetupConfirmationDrawer = ({
  open,
  setOpen,
}: ISetupConfirmationDrawer) => {
  const { handleSubmit } = useForm();

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit: SubmitHandler<ISetupConfirmSchema> = async (data) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    if (data) {
      setIsLoading(false);
      toast({
        variant: 'default',
        description: 'Updated successfully!',
      });
    } else {
      setIsLoading(false);
      toast({
        variant: 'destructive',
        description: 'error!',
      });
    }
  };

  return (
    <>
      {isLoading ? <LoadingSpinner isLoading={true} /> : ''}
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger />
        <DrawerContent>
          <DrawerTitle>Confirm</DrawerTitle>
          <DrawerDescription>
            <p className="mt-8">Setup complete</p>
          </DrawerDescription>
          <DrawerFooter className="flex justify-between">
            <DrawerClose asChild>
              <Button type="button" variant="outline" className="flex-1">
                Cancel
              </Button>
            </DrawerClose>
            <Button
              type="submit"
              // variant="destructive"
              className="flex-1"
              onClick={handleSubmit(onSubmit)}
            >
              Create
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};
