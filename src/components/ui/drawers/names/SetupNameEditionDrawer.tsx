import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import {
  getNameEditionDrawerSchema,
  NameDrawerContent,
  TNameEditionDrawerSchema,
} from '@/components/ui/drawers/names/NameDrawerContent';
import { zodResolver } from '@hookform/resolvers/zod';

interface ISetupNameEditionDrawer {
  name: string;
  open: boolean;
  setOpen: (value: boolean) => void;
  type: 'sharehouse' | 'category';
  id?: string;
}

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
      <NameDrawerContent
        type={type}
        open={open}
        setOpen={setOpen}
        onSubmit={onSubmit}
      />
    </FormProvider>
  );
};
