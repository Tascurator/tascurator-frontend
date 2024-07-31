import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from '../../use-toast';
import { api } from '@/lib/hono';
import { revalidatePage } from '@/actions/revalidation';
import { usePathname } from 'next/navigation';
import { TOAST_TEXTS } from '@/constants/toast-texts';
import {
  getNameEditionDrawerSchema,
  NameEditionDrawerContent,
  TNameEditionDrawerSchema,
} from '@/components/ui/drawers/names/NameEditionDrawerContent';

interface INameEditionDrawer {
  name: string;
  open: boolean;
  setOpen: (value: boolean) => void;
  type: 'sharehouse' | 'category';
  id?: string;
}

/**
 * A drawer component to edit a sharehouse or category name
 *
 * @param name - The current name to be edited
 * @param open - The state of the drawer
 * @param setOpen - The function to set the state of the drawer
 * @param type - The type to determine if editing a 'sharehouse' or 'category'
 * @param id - The id of the sharehouse or category
 *
 * @example
 * const [open, setOpen] = useState(false);
 * // To edit the sharehouse name
 * <NameEditionDrawer
 *  name={'sample name'}
 *  open={open}
 *  setOpen={setOpen}
 *  type={'sharehouse'}
 *  id={'sample id'}
 * />
 *
 * // To edit the category name
 * <NameEditionDrawer
 *  name={'sample name'}
 *  open={open}
 *  setOpen={setOpen}
 *  type={'category'}
 *  id={'sample id'}
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
  const schema = getNameEditionDrawerSchema(type);

  const formControls = useForm({
    resolver: zodResolver(schema),
    mode: 'onBlur',
    defaultValues: {
      name: name,
    },
  });

  const onSubmit: SubmitHandler<TNameEditionDrawerSchema> = async (data) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    try {
      if (!id) {
        throw new Error('Id is required');
      }

      if (isSharehouse) {
        const resSharehouse = await api.sharehouse[':shareHouseId'].$patch({
          param: {
            shareHouseId: id,
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
            categoryId: id,
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
    <FormProvider {...formControls}>
      <NameEditionDrawerContent
        type={type}
        open={open}
        setOpen={setOpen}
        onSubmit={onSubmit}
      />
    </FormProvider>
  );
};
