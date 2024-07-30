import { ITenant } from '@/types/commons';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import {
  tenantInvitationSchema,
  TTenantInvitationSchema,
} from '@/constants/schema';
import { TenantInvitationDrawerContent } from '@/components/ui/drawers/tenants/TenantInvitationDrawerContent';
import { zodResolver } from '@hookform/resolvers/zod';

interface ISetupTenantInvitationDrawer {
  tenant?: ITenant;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const SetupTenantInvitationDrawer = ({
  tenant,
  open,
  setOpen,
}: ISetupTenantInvitationDrawer) => {
  const formControls = useForm<TTenantInvitationSchema>({
    resolver: zodResolver(tenantInvitationSchema),
    mode: 'onBlur',
    defaultValues: tenant,
  });

  const onSubmit: SubmitHandler<TTenantInvitationSchema> = (data) => {
    // Please add the logic to handle the tenant data for a new share house
    console.log(data);
  };

  return (
    <FormProvider {...formControls}>
      <TenantInvitationDrawerContent
        tenant={tenant}
        emailEditable={true}
        open={open}
        setOpen={setOpen}
        onSubmit={onSubmit}
      />
    </FormProvider>
  );
};
