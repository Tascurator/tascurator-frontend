import { ITenant } from '@/types/commons';
import { SubmitHandler } from 'react-hook-form';
import { TTenantInvitationSchema } from '@/constants/schema';
import { TenantDrawerContent } from '@/components/ui/drawers/tenants/TenantDrawerContent';

interface ITenantCreationDrawer {
  tenant?: ITenant;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const TenantCreationDrawer = ({
  tenant,
  open,
  setOpen,
}: ITenantCreationDrawer) => {
  const onSubmit: SubmitHandler<TTenantInvitationSchema> = (data) => {
    // Please add the logic to handle the tenant data for a new share house
    console.log(data);
  };

  return (
    <TenantDrawerContent
      tenant={tenant}
      emailEditable={true}
      open={open}
      setOpen={setOpen}
      onSubmit={onSubmit}
    />
  );
};
