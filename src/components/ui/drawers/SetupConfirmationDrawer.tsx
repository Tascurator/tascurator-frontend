'use client';
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loadingSpinner';
import { toast } from '@/components/ui/use-toast';
import { useState } from 'react';
import { SubmitHandler, UseFormReturn } from 'react-hook-form';
import { TShareHouseCreationSchema } from '@/constants/schema';
import { formatDate } from '@/utils/dates';
import { TOAST_TEXTS } from '@/constants/toast-texts';

interface ISetupConfirmationDrawer {
  open: boolean;
  setOpen: (value: boolean) => void;
  form: UseFormReturn<TShareHouseCreationSchema>;
}

export const SetupConfirmationDrawer = ({
  open,
  setOpen,
  form,
}: ISetupConfirmationDrawer) => {
  const { handleSubmit, getValues } = form;

  const data = getValues();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit: SubmitHandler<TShareHouseCreationSchema> = async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsLoading(false);
      setOpen(false);
      toast({
        variant: 'default',
        description: TOAST_TEXTS.success,
      });
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading ? <LoadingSpinner isLoading={true} /> : ''}
      <Drawer open={open} onOpenChange={setOpen} modal={!isLoading}>
        <DrawerContent asChild>
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* <DrawerClose /> */}
            <DrawerTitle>Confirm Sharehouse Setup</DrawerTitle>
            <DrawerDescription asChild>
              <div>
                <div className="bg-primary-lightest rounded-sm text-base px-2 my-3">
                  Share house name
                </div>
                <p className="text-xl">{data.name}</p>
                <div className="bg-primary-lightest rounded-sm text-base px-2 my-3">
                  Start date
                </div>
                <p className="text-xl">
                  {formatDate(new Date(data.startDate))}
                </p>
                <div className="bg-primary-lightest rounded-sm text-base px-2 my-3">
                  Rotation cycle
                </div>
                <p className="text-xl">
                  {data.rotationCycle === 7
                    ? 'Weekly'
                    : data.rotationCycle === 14
                      ? 'Fortnightly'
                      : data.rotationCycle}
                </p>
                <div className="bg-primary-lightest rounded-sm text-base px-2 my-3">
                  Categories
                </div>
                <p className="text-xl">
                  {data.categories
                    .map((category) => {
                      return category.name;
                    })
                    .join(', ')}
                </p>
                <div className="bg-primary-lightest rounded-sm text-base px-2 my-3">
                  Tenants
                </div>
                <p className="text-xl">
                  {data.tenants.map((tenant) => tenant.name).join(', ')}
                </p>
              </div>
            </DrawerDescription>

            <DrawerFooter>
              <Button
                variant="secondary"
                onClick={() => setOpen(false)}
                type="button"
              >
                Cancel
              </Button>
              <Button type="submit">Confirm</Button>
            </DrawerFooter>
          </form>
        </DrawerContent>
      </Drawer>
    </>
  );
};
