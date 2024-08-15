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
import { SubmitHandler, useForm, UseFormReturn } from 'react-hook-form';
import {
  TShareHouseConfirmSchema,
  TShareHouseCreationSchema,
} from '@/constants/schema';
import { formatDate } from '@/utils/dates';
import { TOAST_TEXTS } from '@/constants/toast-texts';
import { api } from '@/lib/hono';
import { revalidatePage } from '@/actions/revalidation';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { convertToUTC } from '@/utils/dates';

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
  const { watch } = form;
  const data = watch();
  const {
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = useForm<TShareHouseConfirmSchema>();

  useEffect(() => {
    setValue('name', data.name);
    setValue('startDate', convertToUTC(new Date(data.startDate)).toISOString());
    setValue('rotationCycle', data.rotationCycle);
    setValue(
      'categories',
      data.categories.map((category) => {
        return {
          name: category.name,
          tasks: category.tasks.map((task) => {
            return {
              title: task.title,
              description: task.description,
            };
          }),
        };
      }),
    );
    setValue(
      'tenants',
      data.tenants.map((tenant) => {
        return {
          name: tenant.name,
          email: tenant.email,
        };
      }),
    );
  });

  const router = useRouter();

  const onSubmit: SubmitHandler<TShareHouseConfirmSchema> = async (data) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    try {
      const res = await api.sharehouse.$post({ json: data });

      const newData = await res.json();
      if ('error' in newData) {
        throw new Error(newData.error);
      }
      setOpen(false);
      toast({
        variant: 'default',
        description: TOAST_TEXTS.success,
      });
      revalidatePage('/sharehouses');
      router.push('/sharehouses');
    } catch (error) {
      if (error instanceof Error) {
        toast({
          variant: 'destructive',
          description: error.message,
        });
      }
    }
  };

  return (
    <>
      {isSubmitting && <LoadingSpinner isLoading={true} />}
      <Drawer open={open} onOpenChange={setOpen} modal={!isSubmitting}>
        <DrawerContent asChild>
          <form onSubmit={handleSubmit(onSubmit)}>
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
