'use client';
import { Avatar } from '@/components/ui/avatar';
import { Ellipsis, User } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItemWithIcon,
} from '@/components/ui/dropdown-menu';

import { TenantInvitationDrawer } from '@/components/ui/drawers/tenants/TenantInvitationDrawer';
import { DeleteConfirmationDrawer } from '@/components/ui/drawers/deletions/with-checkbox/DeleteConfirmationDrawer';
import { useState } from 'react';
import { DROPDOWN_ITEMS } from '@/constants/dropdown-items';
import type { ITenant } from '@/types/commons';

const { EDIT_TENANT, DELETE_TENANT } = DROPDOWN_ITEMS;

interface ITenantListItemProps {
  shareHouseId: string;
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
const TenantListItem = ({ shareHouseId, tenant }: ITenantListItemProps) => {
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const handleDropdownClick = (action: string) => {
    if (action === 'edit') {
      setOpenEdit(true);
    } else if (action === 'delete') {
      setOpenDelete(true);
    }
  };

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
          <DropdownMenuContent align={'end'}>
            <DropdownMenuGroup>
              <DropdownMenuItemWithIcon
                icon={EDIT_TENANT.icon}
                onClick={() => handleDropdownClick('edit')}
              >
                {EDIT_TENANT.text}
              </DropdownMenuItemWithIcon>
              <DropdownMenuItemWithIcon
                icon={DELETE_TENANT.icon}
                onClick={() => handleDropdownClick('delete')}
              >
                {DELETE_TENANT.text}
              </DropdownMenuItemWithIcon>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        <TenantInvitationDrawer
          shareHouseId={shareHouseId}
          tenant={tenant}
          open={openEdit}
          setOpen={setOpenEdit}
        />
        <DeleteConfirmationDrawer
          id={tenant.id}
          idType={'tenant'}
          deleteItem={tenant.name}
          open={openDelete}
          setOpen={setOpenDelete}
        />
      </div>
    </div>
  );
};

export { TenantListItem };
