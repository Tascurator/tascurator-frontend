import { Avatar } from '@/components/ui/avatar';
import { Ellipsis, User } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItemWithIcon,
} from '@/components/ui/dropdown-menu';

import { TenantInvitationDrawer } from '@/components/ui/drawers/TenantInvitationDrawer';
import { DeleteConfirmationDrawer } from '@/components/ui/drawers/DeleteConfirmationDrawer';
import { useState } from 'react';
import { DROPDOWN_ITEMS } from '@/constants/dropdown-items';

const { EDIT_TENANT, DELETE_TENANT } = DROPDOWN_ITEMS;

interface ITenant {
  id: string;
  name: string;
  email: string;
}

interface ITenantListItemProps {
  tenant: ITenant;
}

/**
 *
 * Display a tenant list item with a dropdown menu to edit or delete the tenant.
 *
 * @example
 * ```tsx
 * const tenant = {
 *  id: '1',
 * name: 'Akio Matio',
 * email: 'akio@matio.com',
 * };
 *
 * <TenantListItem tenant={tenant} />
 * ```
 */
const TenantListItem = ({ tenant }: ITenantListItemProps) => {
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  return (
    <div className="flex items-center justify-between w-full h-full">
      <div>
        <Avatar>
          <User />
        </Avatar>
      </div>
      <div className="ml-4">{tenant.name}</div>
      <div className="ml-auto flex">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Ellipsis />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuGroup>
              <DropdownMenuItemWithIcon icon={EDIT_TENANT.icon}>
                <button onClick={() => setOpenEdit(true)}>
                  {' '}
                  {EDIT_TENANT.text}
                </button>
              </DropdownMenuItemWithIcon>
              <DropdownMenuItemWithIcon icon={DELETE_TENANT.icon}>
                <button onClick={() => setOpenDelete(true)}>
                  {DELETE_TENANT.text}
                </button>
              </DropdownMenuItemWithIcon>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        <TenantInvitationDrawer
          tenant={tenant}
          open={openEdit}
          setOpen={setOpenEdit}
        />
        <DeleteConfirmationDrawer
          deleteItem={tenant.name}
          open={openDelete}
          setOpen={setOpenDelete}
        />
      </div>
    </div>
  );
};

export { TenantListItem };
