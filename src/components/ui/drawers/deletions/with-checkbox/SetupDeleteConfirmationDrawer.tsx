import { FormProvider, useForm } from 'react-hook-form';
import { DeleteConfirmationDrawerContent } from '@/components/ui/drawers/deletions/with-checkbox/DeleteConfirmationDrawerContent';

interface ISetupDeleteConfirmationDrawerProps {
  idType: 'sharehouse' | 'category' | 'tenant';
  deleteItem: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  onDelete: () => void;
}

/**
 * A drawer component to delete an item (share house, category, or tenant) for the setup page
 */
export const SetupDeleteConfirmationDrawer = ({
  idType,
  deleteItem,
  open,
  setOpen,
  onDelete,
}: ISetupDeleteConfirmationDrawerProps) => {
  const formControls = useForm();

  const onSubmit = () => {
    // Please add the logic to delete the item for a new share house
    // get data from the form
    onDelete();
  };

  return (
    <FormProvider {...formControls}>
      <DeleteConfirmationDrawerContent
        idType={idType}
        deleteItem={deleteItem}
        open={open}
        setOpen={setOpen}
        onSubmit={onSubmit}
      />
    </FormProvider>
  );
};
