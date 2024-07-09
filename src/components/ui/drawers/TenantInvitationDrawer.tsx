import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormMessage } from '@/components/ui/formMessage';
import { SubmitHandler, useForm, UseFormReturn } from 'react-hook-form';
import {
  tenantInvitationSchema,
  TTenantInvitationSchema,
} from '@/constants/schema';
import { INPUT_TEXTS } from '@/constants/input-texts';
import { ITenant } from '@/types/commons';
import { LoadingSpinner } from '../loadingSpinner';
import { useState } from 'react';
import { toast } from '../use-toast';

const { TENANT_NAME, TENANT_EMAIL } = INPUT_TEXTS;

interface IEditTenantDrawer {
  tenant?: ITenant;
  formControls: UseFormReturn<TTenantInvitationSchema>;
  open: boolean;
  setOpen: (open: boolean) => void;
}

// A drawer component used to edit or invite a tenant.
const EditTenantDrawer = ({
  tenant,
  formControls,
  open,
  setOpen,
}: IEditTenantDrawer) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    trigger,
  } = formControls;

  const [isLoading, setIsLoading] = useState(false);

  const handleSaveClick = async () => {
    const isValid = await trigger(['name', 'email']);
    if (isValid) {
      console.log('Form is valid');
    }
  };

  // TODO: Implement the onSubmit click functionality
  const onSubmit: SubmitHandler<TTenantInvitationSchema> = async (data) => {
    setIsLoading(true);
    setOpen(true);

    console.log('clicked!!!!111');

    // Submit the form data
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (data) {
      setIsLoading(false);
      toast({
        variant: 'default',
        description: 'Updated successfully!',
      });
      setOpen(false);
    } else {
      setIsLoading(false);
      toast({
        variant: 'destructive',
        description: 'error!',
      });
    }
  };

  return (
    <>
      {isLoading ? <LoadingSpinner isLoading={true} /> : ''}
      <Drawer open={open} onOpenChange={setOpen} modal={!isLoading}>
        <DrawerTrigger />
        <DrawerContent asChild>
          <form onSubmit={handleSubmit(onSubmit)}>
            <DrawerTitle>
              {tenant?.id ? 'Tenant setting' : 'Invite tenant'}
            </DrawerTitle>
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
                  disabled={!!tenant?.id}
                />
                {errors.email?.message && (
                  <FormMessage message={errors.email.message} />
                )}
              </div>
            </DrawerDescription>
            <DrawerFooter>
              <DrawerClose asChild>
                <Button
                  type={'button'}
                  variant={'outline'}
                  className={'flex-1'}
                >
                  Cancel
                </Button>
              </DrawerClose>
              <Button
                type={'submit'}
                className={'flex-1'}
                disabled={!isValid}
                onClick={handleSaveClick}
              >
                Save
              </Button>
            </DrawerFooter>
          </form>
        </DrawerContent>
      </Drawer>
    </>
  );
};

interface ITenantInvitationDrawer {
  tenant?: ITenant;
  open: boolean;
  setOpen: (open: boolean) => void;
}

/**
 * A drawer component used to invite a tenant.
 * @param tenant - The tenant to invite.
 * @param open - The state of the drawer.
 * @param setOpen - The function to set the state of the drawer.
 *
 * @example
 * const [open, setOpen] = useState(false);
 *
 * // Invite tenant
 * <TenantInvitationDrawer open={open} setOpen={setOpen} />
 *
 * // Tenant setting
 * const tenant = {
 * id: '1',
 * name: 'Akio Matio',
 * email: 'matio@akio.com',
 * };
 * <TenantInvitationDrawer tenant={tenant} open={open} setOpen={setOpen}/>
 */
export const TenantInvitationDrawer = ({
  tenant,
  open,
  setOpen,
}: ITenantInvitationDrawer) => {
  const formControls = useForm<TTenantInvitationSchema>({
    resolver: zodResolver(tenantInvitationSchema),
    mode: 'all', // Trigger validation on both blur and change events
    defaultValues: tenant,
  });

  return (
    <EditTenantDrawer
      tenant={tenant}
      formControls={formControls}
      open={open}
      setOpen={setOpen}
    />
  );
};
