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
import { useForm, UseFormReturn } from 'react-hook-form';
import {
  tenantInvitationSchema,
  TTenantInvitationSchema,
} from '@/constants/schema';
import { INPUT_TEXTS } from '@/constants/input-texts';

const { TENANT_NAME, TENANT_EMAIL } = INPUT_TEXTS;

interface ITenant {
  id: string;
  name: string;
  email: string;
}

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
    formState: { errors, isValid },
    trigger,
  } = formControls;

  const handleSaveClick = async () => {
    const isValid = await trigger(['name', 'email']);
    if (isValid) {
      console.log('Form is valid');
    }
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger />
      <DrawerContent>
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
            <Button type={'button'} variant={'outline'} className={'flex-1'}>
              Cancel
            </Button>
          </DrawerClose>
          <Button
            type={'button'}
            className={'flex-1'}
            onClick={handleSaveClick}
            disabled={!isValid}
          >
            Save
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
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
