import { FormProvider, useForm } from 'react-hook-form';
import { DeleteDrawerContent } from '@/components/ui/drawers/deletions/with-checkbox/DeleteDrawerContent';

interface ISetupDeleteConfirmationDrawerProps {
  id: string;
  idType: 'sharehouse' | 'category' | 'tenant';
  deleteItem: string;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const SetupDeleteConfirmationDrawer = ({
  id,
  idType,
  deleteItem,
  open,
  setOpen,
}: ISetupDeleteConfirmationDrawerProps) => {
  const formControls = useForm();

  const onSubmit = () => {
    // Please add the logic to delete the item for a new share house
    console.log('Item deleted', id);
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
