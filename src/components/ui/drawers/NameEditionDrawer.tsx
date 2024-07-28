'use client';
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
import { api } from '@/lib/hono';
import { revalidatePage } from '@/actions/revalidation';
import { usePathname } from 'next/navigation';
import { TOAST_TEXTS } from '@/constants/toast-texts';

const { SHAREHOUSE_NAME, CATEGORY_NAME } = INPUT_TEXTS;

interface INameEditionDrawer {
  name: string;
  open: boolean;
  setOpen: (value: boolean) => void;
  type: 'sharehouse' | 'category';
  id?: string;
  // shareHouseId?: string;
  // categoryId?: string;
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
  id,
}: INameEditionDrawer) => {
  const path = usePathname();
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
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
    trigger,
  } = formControls;

  const handleSaveClick = async () => {
    // Check if all the fields are valid
    const isValid = await trigger(['name']);
    if (isValid) {
      console.log('Form is valid');
    }
  };

  // TODO: Implement the onSubmit click functionality
  const onSubmit: SubmitHandler<FormSchema> = async (data) => {
    // Submit the form data
    await new Promise((resolve) => setTimeout(resolve, 1000));

    try {
      if (isSharehouse) {
        const resSharehouse = await api.sharehouse[':shareHouseId'].$patch({
          param: {
            shareHouseId: id!,
          },
          json: {
            name: data.name,
          },
        });
        const sharehouseData = await resSharehouse.json();
        if ('error' in sharehouseData) {
          throw new Error(sharehouseData.error);
        }
      } else {
        const resCategory = await api.category[':categoryId'].$patch({
          param: {
            categoryId: id!,
          },
          json: {
            name: data.name,
          },
        });
        const categoryData = await resCategory.json();
        if ('error' in categoryData) {
          throw new Error(categoryData.error);
        }
      }
      toast({
        variant: 'default',
        description: TOAST_TEXTS.success,
      });
      revalidatePage(path);
      setOpen(false);
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
      {isSubmitting ? <LoadingSpinner isLoading={true} /> : ''}
      <Drawer open={open} onOpenChange={setOpen} modal={!isSubmitting}>
        <DrawerTrigger />
        <DrawerContent asChild>
          <form onSubmit={handleSubmit(onSubmit)}>
            <DrawerTitle>
              Edit {isSharehouse ? 'share house name' : 'category name'}
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
