import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  categoryCreationSchema,
  TCategoryCreationSchema,
} from '@/constants/schema';
import { CategoryCreationDrawerContent } from '@/components/ui/drawers/categories/CategoryCreationDrawerContent';
import { useState } from 'react';

interface ISetupCategoryCreationDrawer {
  editOpen: boolean;
  setEditOpen: (value: boolean) => void;
  shareHouseId: string;
}

export const SetupCategoryCreationDrawer = ({
  shareHouseId,
  editOpen,
  setEditOpen,
}: ISetupCategoryCreationDrawer) => {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const formControls = useForm<TCategoryCreationSchema>({
    resolver: zodResolver(categoryCreationSchema),
    mode: 'onBlur',
    defaultValues: {
      name: '',
      task: {
        title: '',
        description: '',
      },
    },
  });

  const onSubmit: SubmitHandler<TCategoryCreationSchema> = (data) => {
    // Please add the logic to handle the category data for a new share house
    console.log(shareHouseId, data);
  };

  return (
    <FormProvider {...formControls}>
      <CategoryCreationDrawerContent
        editOpen={editOpen}
        setEditOpen={setEditOpen}
        confirmOpen={confirmOpen}
        setConfirmOpen={setConfirmOpen}
        onSubmit={onSubmit}
      />
    </FormProvider>
  );
};
