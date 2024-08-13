import { ITenant } from '@/types/commons';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import {
  tenantInvitationSchema,
  TTenantInvitationSchema,
} from '@/constants/schema';
import { TenantInvitationDrawerContent } from '@/components/ui/drawers/tenants/TenantInvitationDrawerContent';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/components/ui/use-toast';
import { randomUUID } from 'crypto';

interface ISetupTenantInvitationDrawer {
  tenant?: ITenant;
  open: boolean;
  setOpen: (open: boolean) => void;
  addTenant?: (tenant: ITenant) => void;
  editTenant?: (tenantId: string, tenant: ITenant) => void;
  tenantData?: ITenant[];
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
  tenantData,
}: ISetupTenantInvitationDrawer) => {
  const formControls = useForm<TTenantInvitationSchema>({
    resolver: zodResolver(tenantInvitationSchema),
    mode: 'onBlur',
    defaultValues: tenant,
  });
  const { toast } = useToast();

  const { reset } = formControls;

  const onSubmit: SubmitHandler<TTenantInvitationSchema> = (data) => {
    const newTenant: ITenant = {
      id: randomUUID(),
      ...data,
    };

    // for editing tenant id
    const editingTenantId = tenant?.id;

    // duplicate check
    const isDuplicateName = tenantData?.some(
      (tenant) =>
        tenant.id !== editingTenantId && tenant.name === newTenant.name,
    );

    const isDuplicateEmail = tenantData?.some(
      (tenant) =>
        tenant.id !== editingTenantId && tenant.email === newTenant.email,
    );

    if (isDuplicateName) {
      toast({
        variant: 'destructive',
        description: `Tenant name already exists`,
      });
      return;
    }

    if (isDuplicateEmail) {
      toast({
        variant: 'destructive',
        description: `Tenant email already exists`,
      });
      return;
    }

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
