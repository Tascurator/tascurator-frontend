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
  addTenant?: (tenant: ITenant) => void;
  editTenant?: (tenantId: string, tenant: ITenant) => void;
}

/**
 * A drawer component to invite a tenant to a share house for the setup page
 */
export const SetupTenantInvitationDrawer = ({
  tenant,
  open,
  setOpen,
  addTenant,
  editTenant,
}: ISetupTenantInvitationDrawer) => {
  const formControls = useForm<TTenantInvitationSchema>({
    resolver: zodResolver(tenantInvitationSchema),
    mode: 'onBlur',
    defaultValues: tenant,
  });

  const { reset } = formControls;

  const onSubmit: SubmitHandler<TTenantInvitationSchema> = (data) => {
    // Please add the logic to handle the tenant data for a new share house
    // console.log(data);

    const newTenant: ITenant = {
      id: self.crypto.randomUUID(),
      ...data,
    };
    if (addTenant) {
      addTenant(newTenant);
    }
    if (editTenant && tenant) {
      editTenant(tenant.id, newTenant);
    }
    setOpen(false);
    reset();
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
