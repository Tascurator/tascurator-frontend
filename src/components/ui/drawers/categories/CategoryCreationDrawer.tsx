import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  categoryCreationSchema,
  TCategoryCreationSchema,
} from '@/constants/schema';
import { toast } from '../../use-toast';
import { api } from '@/lib/hono';
import { TOAST_TEXTS } from '@/constants/toast-texts';
import { revalidatePage } from '@/actions/revalidation';
import { usePathname } from 'next/navigation';
import { CategoryCreationDrawerContent } from '@/components/ui/drawers/categories/CategoryCreationDrawerContent';
import { useState } from 'react';

interface ICategoryCreationDrawer {
  editOpen: boolean;
  setEditOpen: (value: boolean) => void;
  shareHouseId: string;
}

/**
 * A drawer component to create a new task or edit an existing task
 *
 * If task is passed, the drawer will be in edit mode.
 * Otherwise, the drawer will be in create mode.
 *
 * @param shareHouseId - The sharehouse id to which the category belongs
 * @param editOpen - The state of the drawer
 * @param setEditOpen - The function to set the state of the drawer
 *
 * @example
 * const [editOpen, setEditOpen] = useState(false);
 *
 * // To create a new category
 * <CategoryCreationDrawer editOpen={editOpen} setEditOpen={setEditOpen} />
 *
 */
export const CategoryCreationDrawer = ({
  shareHouseId,
  editOpen,
  setEditOpen,
}: ICategoryCreationDrawer) => {
  const path = usePathname();

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

  const { reset } = formControls;

  const onSubmit: SubmitHandler<TCategoryCreationSchema> = async (data) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    try {
      const res = await api.category[':shareHouseId'].$post({
        param: {
          shareHouseId: shareHouseId,
        },
        json: {
          name: data.name,
          task: {
            title: data.task.title,
            description: data.task.description,
          },
        },
      });
      const newData = await res.json();
      if ('error' in newData) {
        throw new Error(newData.error);
      }
      toast({
        variant: 'default',
        description: TOAST_TEXTS.success,
      });
      revalidatePage(path);
      setConfirmOpen(false);
      reset();
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
