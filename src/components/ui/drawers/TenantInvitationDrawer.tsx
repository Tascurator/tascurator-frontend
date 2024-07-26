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
import { toast } from '../use-toast';
import { api } from '@/lib/hono';
import { TOAST_TEXTS } from '@/constants/toast-texts';
import { revalidatePage } from '@/actions/revalidation';
import { usePathname } from 'next/navigation';

const { TENANT_NAME, TENANT_EMAIL } = INPUT_TEXTS;

interface IEditTenantDrawer {
  shareHouseId: string;
  tenant?: ITenant;
  formControls: UseFormReturn<TTenantInvitationSchema>;
  open: boolean;
  setOpen: (open: boolean) => void;
}

// A drawer component used to edit or invite a tenant.
const EditTenantDrawer = ({
  shareHouseId,
  tenant,
  formControls,
  open,
  setOpen,
}: IEditTenantDrawer) => {
  const path = usePathname();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = formControls;

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
    <>
      {isSubmitting ? <LoadingSpinner isLoading={true} /> : ''}
      <Drawer open={open} onOpenChange={setOpen} modal={!isSubmitting}>
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
              <Button type={'submit'} className={'flex-1'} disabled={!isValid}>
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
  shareHouseId: string;
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
  shareHouseId,
  tenant,
  open,
  setOpen,
}: ITenantInvitationDrawer) => {
  const formControls = useForm<TTenantInvitationSchema>({
    resolver: zodResolver(tenantInvitationSchema),
    mode: 'all', // Trigger validation on both blur and change events
    defaultValues: tenant,
  });

  console.log('shareHouseId:', shareHouseId);

  return (
    <EditTenantDrawer
      shareHouseId={shareHouseId}
      tenant={tenant}
      formControls={formControls}
      open={open}
      setOpen={setOpen}
    />
  );
};
