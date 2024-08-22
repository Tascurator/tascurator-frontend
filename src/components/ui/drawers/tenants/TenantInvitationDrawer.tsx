import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import {
  tenantInvitationSchema,
  TTenantInvitationSchema,
} from '@/constants/schema';
import { ITenant } from '@/types/commons';
import { api } from '@/lib/hono';
import { TOAST_TEXTS } from '@/constants/toast-texts';
import { revalidatePage } from '@/actions/revalidation';
import { usePathname } from 'next/navigation';
import { TenantInvitationDrawerContent } from '@/components/ui/drawers/tenants/TenantInvitationDrawerContent';
import { useToast } from '@/components/ui/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';

interface ITenantInvitationDrawer {
  shareHouseId: string;
  tenant?: ITenant;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const TenantInvitationDrawer = ({
  shareHouseId,
  tenant,
  open,
  setOpen,
}: ITenantInvitationDrawer) => {
  const path = usePathname();
  const { toast } = useToast();

  const formControls = useForm<TTenantInvitationSchema>({
    resolver: zodResolver(tenantInvitationSchema),
    mode: 'onBlur',
    defaultValues: tenant,
  });

  const { reset } = formControls;

  const onSubmit: SubmitHandler<TTenantInvitationSchema> = async (data) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Post the form data
    try {
      if (tenant?.id) {
        const resEditData = await api.tenant[':tenantId'].$patch({
          param: {
            tenantId: tenant.id,
          },
          json: {
            name: data.name,
          },
        });
        const editData = await resEditData.json();

        if ('error' in editData) {
          throw new Error(editData.error);
        }
      } else {
        const resNewData = await api.tenant[':shareHouseId'].$post({
          param: {
            shareHouseId: shareHouseId,
          },
          json: {
            name: data.name,
            email: data.email,
          },
        });
        const newData = await resNewData.json();

        if ('error' in newData) {
          throw new Error(newData.error);
        }
      }
      toast({
        variant: 'default',
        description: TOAST_TEXTS.success,
      });
      revalidatePage(path);
      setOpen(false);
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
      <TenantInvitationDrawerContent
        tenant={tenant}
        open={open}
        setOpen={setOpen}
        onSubmit={onSubmit}
      />
    </FormProvider>
  );
};
