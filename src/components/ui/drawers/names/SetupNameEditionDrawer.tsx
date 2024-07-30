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
  id?: string;
}

/**
 * A drawer component to edit the name of a share house or a category for the setup page
 */
export const SetupNameEditionDrawer = ({
  name,
  open,
  setOpen,
  type,
  id,
}: ISetupNameEditionDrawer) => {
  const schema = getNameEditionDrawerSchema(type);

  const formControls = useForm({
    resolver: zodResolver(schema),
    mode: 'onBlur',
    defaultValues: {
      name: name,
    },
  });

  const onSubmit: SubmitHandler<TNameEditionDrawerSchema> = (data) => {
    // Please add the logic to handle the data for a new share house
    console.log(id, data);
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
