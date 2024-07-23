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
import { TShareHouseCreationSchema } from '@/constants/schema';

interface ISetupConfirmationDrawer {
  open: boolean;
  setOpen: (value: boolean) => void;
  data: TShareHouseCreationSchema;
  onSubmit: SubmitHandler<TShareHouseCreationSchema>;
}

export const SetupConfirmationDrawer = ({
  open,
  setOpen,
  data,
  onSubmit,
}: ISetupConfirmationDrawer) => {
  const { handleSubmit } = useForm<TShareHouseCreationSchema>();

  const [isLoading, setIsLoading] = useState(false);

  const handleFormSubmit: SubmitHandler<TShareHouseCreationSchema> = async (
    data,
  ) => {
    setIsLoading(true);
    try {
      await onSubmit(data);
      setIsLoading(false);
      toast({
        variant: 'default',
        description: 'Updated successfully!',
      });
      setOpen(false);
      console.log('data', data);
    } catch (error) {
      setIsLoading(false);
      toast({
        variant: 'destructive',
        description: 'Error!',
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
          <DrawerDescription asChild>
            {data && (
              <div>
                <p>Share house name: {data.name}</p>
                <p>Start date: {data.startDate}</p>
                <p>Rotation cycle: {data.rotationCycle}</p>
                <p>Categories number: {data.categories.length}</p>
                <p>Tenant number: {data.tenants.length}</p>
                {/* <p>Categories:</p>
                <ul>
                  {data.categories.map((category) => (
                    <li key={category.id}>
                      <p>{category.name}</p>
                      <ul>
                        {category.tasks.map((task) => (
                          <li key={task.id}>
                            <p>{task.title}</p>
                            <p>{task.description}</p>
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ul> */}

                {/* <p>{JSON.stringify(data)}</p> */}
              </div>
            )}
          </DrawerDescription>
          <DrawerFooter className="flex justify-between">
            <DrawerClose asChild>
              <Button type="button" variant="outline" className="flex-1">
                Cancel
              </Button>
            </DrawerClose>
            <Button
              type="submit"
              className="flex-1"
              onClick={handleSubmit(handleFormSubmit)}
            >
              Create
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};
