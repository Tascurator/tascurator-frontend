import { EditCategoryDrawerContent } from '@/components/ui/drawers/categories/EditCategoryDrawerContent';
import { ConfirmCategoryDrawerContent } from '@/components/ui/drawers/categories/ConfirmCategoryDrawerContent';
import { SubmitHandler } from 'react-hook-form';
import { TCategoryCreationSchema } from '@/constants/schema';

interface ICategoryDrawerContent {
  editOpen: boolean;
  setEditOpen: (value: boolean) => void;
  confirmOpen: boolean;
  setConfirmOpen: (value: boolean) => void;
  onSubmit: SubmitHandler<TCategoryCreationSchema>;
}

export const CategoryCreationDrawerContent = ({
  editOpen,
  setEditOpen,
  confirmOpen,
  setConfirmOpen,
  onSubmit,
}: ICategoryDrawerContent) => {
  const openConfirmationDrawer = () => {
    setEditOpen(false);
    setConfirmOpen(true);
  };

  const closeConfirmationDrawer = () => {
    setConfirmOpen(false);
    setEditOpen(true);
  };

  return (
    <>
      <EditCategoryDrawerContent
        editOpen={editOpen}
        setEditOpen={setEditOpen}
        openConfirmationDrawer={openConfirmationDrawer}
      />

      <ConfirmCategoryDrawerContent
        confirmOpen={confirmOpen}
        setConfirmOpen={setConfirmOpen}
        closeConfirmationDrawer={closeConfirmationDrawer}
        onSubmit={onSubmit}
      />
    </>
  );
};
