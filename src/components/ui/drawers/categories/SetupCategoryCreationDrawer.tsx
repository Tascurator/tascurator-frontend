import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  categoryCreationSchema,
  TCategoryCreationSchema,
} from '@/constants/schema';
import { CategoryCreationDrawerContent } from '@/components/ui/drawers/categories/CategoryCreationDrawerContent';
import { useState } from 'react';
import { ICategory } from '@/types/commons';
import { useToast } from '@/components/ui/use-toast';
import { randomUUID } from 'crypto';

interface ISetupCategoryCreationDrawer {
  editOpen: boolean;
  setEditOpen: (value: boolean) => void;
  shareHouseId: string;
  addCategory: (category: ICategory) => void;
  categoryData?: ICategory[];
}

/**
 * A drawer component to create a category for the setup page
 */
export const SetupCategoryCreationDrawer = ({
  editOpen,
  setEditOpen,
  addCategory,
  categoryData,
}: ISetupCategoryCreationDrawer) => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const { toast } = useToast();
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

  const { reset } = formControls;

  const onSubmit: SubmitHandler<TCategoryCreationSchema> = (data) => {
    const newCategory = {
      id: randomUUID(),
      name: data.name,
      tasks: [
        {
          id: randomUUID(),
          title: data.task.title,
          description: data.task.description,
        },
      ],
    };

    const isDuplicate = categoryData?.some(
      (category) => category.name === newCategory.name,
    );

    // show a toast message if the category is a duplicate
    if (isDuplicate) {
      toast({
        variant: 'destructive',
        description: `Category already exists`,
      });
      return;
    }

    // create only if the category is not a duplicate
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
