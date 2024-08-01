import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  categoryCreationSchema,
  TCategoryCreationSchema,
} from '@/constants/schema';
import { CategoryCreationDrawerContent } from '@/components/ui/drawers/categories/CategoryCreationDrawerContent';
import { useState } from 'react';
import { ICategory } from '@/types/commons';
// import { randomUUID } from 'crypto';

interface ISetupCategoryCreationDrawer {
  editOpen: boolean;
  setEditOpen: (value: boolean) => void;
  shareHouseId: string;
  addCategory: (category: ICategory) => void;
}

/**
 * A drawer component to create a category for the setup page
 */
export const SetupCategoryCreationDrawer = ({
  // shareHouseId,
  editOpen,
  setEditOpen,
  addCategory,
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

  const {
    // register,
    // handleSubmit,
    reset,
    // formState: { errors },
  } = formControls;

  const onSubmit: SubmitHandler<TCategoryCreationSchema> = (data) => {
    // Please add the logic to handle the category data for a new share house
    // console.log(shareHouseId, data);
    const newCategory = {
      id: self.crypto.randomUUID(),
      name: data.name,
      tasks: [
        {
          id: self.crypto.randomUUID(),
          title: data.task.title,
          description: data.task.description,
        },
      ],
    };
    addCategory(newCategory);
    setConfirmOpen(false);
    reset();
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
