import { CommonDrawer } from '@/components/ui/commons/CommonDrawer';
import {
  DrawerClose,
  DrawerDescription,
  DrawerFooter,
} from '@/components/ui/drawer';
import { Input } from '@/components/ui/input';
import { FormMessage } from '@/components/ui/formMessage';
import { Button } from '@/components/ui/button';
import {
  categoryNameSchema,
  shareHouseNameSchema,
  TCategoryNameSchema,
  TShareHouseNameSchema,
} from '@/constants/schema';
import { SubmitHandler, useFormContext } from 'react-hook-form';
import { INPUT_TEXTS } from '@/constants/input-texts';

const { SHAREHOUSE_NAME, CATEGORY_NAME } = INPUT_TEXTS;

export type TNameEditionDrawerSchema =
  | TShareHouseNameSchema
  | TCategoryNameSchema;

export const getNameEditionDrawerSchema = (type: 'sharehouse' | 'category') => {
  return type === 'sharehouse'
    ? shareHouseNameSchema //If type is 'sharehouse
    : categoryNameSchema; //If type is 'category'
};

interface INameDrawerContentProps {
  type: 'sharehouse' | 'category';
  open: boolean;
  setOpen: (open: boolean) => void;
  onSubmit: SubmitHandler<TNameEditionDrawerSchema>;
}

export const NameDrawerContent = ({
  type,
  open,
  setOpen,
  onSubmit,
}: INameDrawerContentProps) => {
  const isSharehouse = type === 'sharehouse';

  const {
    register,
    formState: { errors, isValid },
  } = useFormContext<TNameEditionDrawerSchema>();

  return (
    <CommonDrawer
      title={`Edit ${isSharehouse ? 'share house name' : 'category name'}`}
      open={open}
      setOpen={setOpen}
      onSubmit={onSubmit}
    >
      <DrawerDescription
        asChild
        className={'flex flex-col justify-center items-start overflow-visible'}
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
            label={isSharehouse ? SHAREHOUSE_NAME.label : CATEGORY_NAME.label}
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
          <Button type={'button'} variant={'outline'} className={'flex-1'}>
            Cancel
          </Button>
        </DrawerClose>
        <Button type={'submit'} className={'flex-1'} disabled={!isValid}>
          Save
        </Button>
      </DrawerFooter>
    </CommonDrawer>
  );
};
