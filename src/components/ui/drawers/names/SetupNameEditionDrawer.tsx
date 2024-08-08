import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import {
  getNameEditionDrawerSchema,
  NameEditionDrawerContent,
  TNameEditionDrawerSchema,
} from '@/components/ui/drawers/names/NameEditionDrawerContent';
import { zodResolver } from '@hookform/resolvers/zod';

interface ISetupNameEditionDrawer {
  name: string;
  open: boolean;
  setOpen: (value: boolean) => void;
  type: 'sharehouse' | 'category';
  onUpdateName: (newName: string) => void;
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
}: ISetupNameEditionDrawer) => {
  const schema = getNameEditionDrawerSchema(type);

  const formControls = useForm({
    resolver: zodResolver(schema),
    mode: 'onBlur',
    defaultValues: {
      name: name,
    },
  });

  const { getValues } = formControls;

  const onSubmit: SubmitHandler<TNameEditionDrawerSchema> = () => {
    const newName = getValues('name');
    onUpdateName(newName);
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
