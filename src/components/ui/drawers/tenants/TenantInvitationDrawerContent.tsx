import { CommonDrawer } from '@/components/ui/commons/CommonDrawer';
import {
  DrawerClose,
  DrawerDescription,
  DrawerFooter,
} from '@/components/ui/drawer';
import { Input } from '@/components/ui/input';
import { FormMessage } from '@/components/ui/formMessage';
import { Button } from '@/components/ui/button';
import { SubmitHandler, useFormContext } from 'react-hook-form';
import { ITenant } from '@/types/commons';
import { TTenantInvitationSchema } from '@/constants/schema';
import { INPUT_TEXTS } from '@/constants/input-texts';

const { TENANT_NAME, TENANT_EMAIL } = INPUT_TEXTS;

interface ITenantDrawerContentProps {
  tenant?: ITenant;
  emailEditable?: boolean;
  open: boolean;
  setOpen: (open: boolean) => void;
  onSubmit: SubmitHandler<TTenantInvitationSchema>;
}

export const TenantInvitationDrawerContent = ({
  tenant,
  emailEditable = false,
  open,
  setOpen,
  onSubmit,
}: ITenantDrawerContentProps) => {
  const {
    register,
    formState: { errors, isValid },
  } = useFormContext<TTenantInvitationSchema>();

  return (
    <CommonDrawer
      title={tenant?.id ? 'Tenant setting' : 'Invite tenant'}
      open={open}
      setOpen={setOpen}
      onSubmit={onSubmit}
    >
      <DrawerDescription
        className={
          'flex-1 flex flex-col justify-center items-start overflow-visible'
        }
        asChild
      >
        {/* Input field for Tenant name*/}
        <div>
          <Input
            {...register('name')}
            variant={errors.name ? 'destructive' : 'default'}
            type="text"
            placeholder={TENANT_NAME.placeholder}
            label={TENANT_NAME.label}
            defaultValue={tenant?.name}
          />
          {errors.name?.message && (
            <FormMessage message={errors.name.message} />
          )}

          {/* Input field for Tenant email*/}

          <Input
            {...register('email')}
            variant={errors.email ? 'destructive' : 'default'}
            type="email"
            placeholder={TENANT_EMAIL.placeholder}
            label={TENANT_EMAIL.label}
            classNames={{
              label: 'mt-4',
            }}
            defaultValue={tenant?.email}
            disabled={!emailEditable && !!tenant?.email}
          />
          {errors.email?.message && (
            <FormMessage message={errors.email.message} />
          )}
        </div>
      </DrawerDescription>
      <DrawerFooter>
        <DrawerClose asChild>
          <Button type={'button'} variant={'outline'} className={'flex-1'}>
            Cancel
          </Button>
        </DrawerClose>
        <Button type={'submit'} className={'flex-1'} disabled={!isValid}>
          Save
        </Button>
      </DrawerFooter>
    </CommonDrawer>
  );
};
