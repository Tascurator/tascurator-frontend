'use client';
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
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormMessage } from '@/components/ui/formMessage';
import {
  shareHouseNameSchema,
  TShareHouseNameSchema,
  categoryNameSchema,
  TCategoryNameSchema,
} from '@/constants/schema';
import { INPUT_TEXTS } from '@/constants/input-texts';
import { LoadingSpinner } from '../loadingSpinner';
import { toast } from '../use-toast';

const { SHAREHOUSE_NAME, CATEGORY_NAME } = INPUT_TEXTS;

interface INameEditionDrawer {
  name: string;
  open: boolean;
  setOpen: (value: boolean) => void;
  type: 'sharehouse' | 'category';
}

type FormSchema = TShareHouseNameSchema | TCategoryNameSchema;

const getSchema = (type: 'sharehouse' | 'category') => {
  return type === 'sharehouse'
    ? shareHouseNameSchema //If type is 'sharehouse
    : categoryNameSchema; //If type is 'category'
};

/**
 * A drawer component to edit a sharehouse or category name
 *
 * @param name - The current name to be edited
 * @param open - The state of the drawer
 * @param setOpen - The function to set the state of the drawer
 * @param type - The type to determine if editing a 'sharehouse' or 'category'
 *
 * @example
 * const [open, setOpen] = useState(false);
 *
 * // To edit the sharehouse name
 * <NameEditionDrawer
 *  name={'sample name'}
 *  open={open}
 *  setOpen={setOpen}
 *  type={'sharehouse'}
 * />
 *
 * // To edit the category name
 * <NameEditionDrawer
 *  name={'sample name'}
 *  open={open}
 *  setOpen={setOpen}
 *  type={'category'}
 * />
 */

export const NameEditionDrawer = ({
  name,
  open,
  setOpen,
  type,
}: INameEditionDrawer) => {
  const [isLoading, setIsLoading] = useState(false);
  const isSharehouse = type === 'sharehouse';
  const schema = getSchema(type);

  const formControls = useForm({
    resolver: zodResolver(schema),
    mode: 'all',
    defaultValues: {
      name: name,
    },
  });

  const {
    register,
    formState: { errors, isValid },
    handleSubmit,
    trigger,
    // reset,
  } = formControls;

  const handleSaveClick = async () => {
    // Check if all the fields are valid
    const isValid = await trigger(['name']);

    // TODO: Implement the save click functionality
    if (isValid) {
      setOpen(false);
    }
  };

  // TODO: Implement the onSubmit click functionality
  const onSubmit: SubmitHandler<FormSchema> = async (data) => {
    setIsLoading(true);

    // Submit the form data
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Update the name based on the id
    if (name) {
      setIsLoading(false);
      console.log('Updating the name:', data);
      toast({
        variant: 'default',
        description: 'Updated successfully!',
      });
    }

    // Close the drawer
    setOpen(false);
  };

  return (
    <>
      {isLoading ? <LoadingSpinner isLoading={true} /> : ''}
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger />
        <DrawerContent asChild>
          <form onSubmit={handleSubmit(onSubmit)}>
            <DrawerTitle>
              Edit {isSharehouse ? 'sharehouse name' : 'category name'}
            </DrawerTitle>
            <DrawerDescription
              asChild
              className={
                'flex flex-col justify-center items-start overflow-visible'
              }
            >
              {/* Name input field */}
              <div>
                <Input
                  {...register('name')}
                  variant={errors.name ? 'destructive' : 'default'}
                  type="text"
                  placeholder={
                    isSharehouse
                      ? SHAREHOUSE_NAME.placeholder
                      : CATEGORY_NAME.placeholder
                  }
                  label={
                    isSharehouse ? SHAREHOUSE_NAME.label : CATEGORY_NAME.label
                  }
                  classNames={{
                    label: 'mt-4',
                  }}
                />
                {errors.name?.message && (
                  <FormMessage message={errors.name.message} />
                )}
              </div>
            </DrawerDescription>
            <DrawerFooter>
              <DrawerClose asChild>
                <Button
                  type={'button'}
                  variant={'outline'}
                  className={'flex-1'}
                >
                  Cancel
                </Button>
              </DrawerClose>
              <Button
                type={'submit'}
                className={'flex-1'}
                disabled={!isValid}
                onClick={handleSaveClick}
              >
                Save
              </Button>
            </DrawerFooter>
          </form>
        </DrawerContent>
      </Drawer>
    </>
  );
};
