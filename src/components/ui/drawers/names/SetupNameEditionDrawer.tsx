import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import {
  getNameEditionDrawerSchema,
  NameEditionDrawerContent,
  TNameEditionDrawerSchema,
} from '@/components/ui/drawers/names/NameEditionDrawerContent';
import { zodResolver } from '@hookform/resolvers/zod';
import { ICategory } from '@/types/commons';
import { useToast } from '@/components/ui/use-toast';

interface ISetupNameEditionDrawer {
  name: string;
  open: boolean;
  setOpen: (value: boolean) => void;
  type: 'sharehouse' | 'category';
  onUpdateName: (newName: string) => void;
  categoryData?: ICategory[];
}

/**
 * A drawer component to edit the name of a share house or a category for the setup page
 */
export const SetupNameEditionDrawer = ({
  name,
  open,
  setOpen,
  type,
  onUpdateName,
  categoryData,
}: ISetupNameEditionDrawer) => {
  const schema = getNameEditionDrawerSchema(type);
  const { toast } = useToast();
  const formControls = useForm({
    resolver: zodResolver(schema),
    mode: 'onBlur',
    defaultValues: {
      name: name,
    },
  });

  const { getValues } = formControls;

  const onSubmit: SubmitHandler<TNameEditionDrawerSchema> = () => {
    console.log('categoryData', categoryData);

    //duplicate check
    if (type === 'category') {
      const newName = getValues().name;
      const isDuplicate = categoryData?.some(
        (category) => category.name === newName,
      );
      if (isDuplicate) {
        toast({
          description: 'Category name already exists',
          variant: 'destructive',
        });
        return;
      }
    }
    onUpdateName(getValues().name);
    setOpen(false);
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
