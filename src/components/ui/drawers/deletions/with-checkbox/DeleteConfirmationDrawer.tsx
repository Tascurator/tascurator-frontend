import { FormProvider, useForm } from 'react-hook-form';
import { toast } from '../../../use-toast';
import { api } from '@/lib/hono';
import { TOAST_TEXTS } from '@/constants/toast-texts';
import { revalidatePage } from '@/actions/revalidation';
import { usePathname } from 'next/navigation';
import { DeleteDrawerContent } from '@/components/ui/drawers/deletions/with-checkbox/DeleteDrawerContent';

interface IDeleteConfirmationDrawerProps {
  id: string;
  idType: 'sharehouse' | 'category' | 'tenant';
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
 * @param {string} id - The unique identifier of the item to be deleted.
 * @param {string} idType - The type of item being deleted, which can be 'sharehouse', 'category', or 'tenant'.
 * @param {string} deleteItem - The item to be deleted.
 * @param {boolean} open - The state of the drawer.
 * @param {function} setOpen - The function to set the state of the drawer.
 *
 * <DeleteConfirmationDrawer
 *   id={sharehouseId}
 *   idType={'sharehouse'}
 *   deleteItem={'item'}
 *   open={open}
 *   setOpen={setOpen}
 * />
 */

export const DeleteConfirmationDrawer = ({
  id,
  idType,
  deleteItem,
  open,
  setOpen,
}: IDeleteConfirmationDrawerProps) => {
  const path = usePathname();
  const formControls = useForm();

  const onSubmit = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Post the form data
    try {
      // Sharehouse
      if (idType === 'sharehouse') {
        const resSharehouseData = await api.sharehouse[':shareHouseId'].$delete(
          {
            param: {
              shareHouseId: id,
            },
          },
        );
        const sharehouseData = await resSharehouseData.json();

        if ('error' in sharehouseData) {
          throw new Error(sharehouseData.error);
        }
      }
      // category
      else if (idType === 'category') {
        const resCategoryData = await api.category[':categoryId'].$delete({
          param: {
            categoryId: id,
          },
        });
        const categoryData = await resCategoryData.json();

        if ('error' in categoryData) {
          throw new Error(categoryData.error);
        }
      }
      // tenant
      else {
        const resTenantData = await api.tenant[':tenantId'].$delete({
          param: {
            tenantId: id,
          },
        });
        const tenantData = await resTenantData.json();

        if ('error' in tenantData) {
          throw new Error(tenantData.error);
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
      <DeleteDrawerContent
        idType={idType}
        deleteItem={deleteItem}
        open={open}
        setOpen={setOpen}
        onSubmit={onSubmit}
      />
    </FormProvider>
  );
};
