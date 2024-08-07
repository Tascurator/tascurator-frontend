import { FormProvider, useForm } from 'react-hook-form';
import { DeleteConfirmationDrawerContent } from '@/components/ui/drawers/deletions/with-checkbox/DeleteConfirmationDrawerContent';

interface ISetupDeleteConfirmationDrawerProps {
  id: string;
  idType: 'sharehouse' | 'category' | 'tenant';
  deleteItem: string;
  open: boolean;
  setOpen: (open: boolean) => void;
}

/**
 * A drawer component to delete an item (share house, category, or tenant) for the setup page
 */
export const SetupDeleteConfirmationDrawer = ({
  id,
  idType,
  deleteItem,
  open,
  setOpen,
}: ISetupDeleteConfirmationDrawerProps) => {
  const formControls = useForm();

  // const {
  // formState: { errors },
  // setValue,
  // getValues,
  // } = formControls;

  const onSubmit = () => {
    // Please add the logic to delete the item for a new share house

    // get data from the form
    console.log('id', id);
    console.log('idType', idType);
    console.log('deleteItem', deleteItem);
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
