import { Avatar } from '@/components/ui/avatar';
import { Ellipsis, Trash2, SquarePen, User } from 'lucide-react';
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

interface ITenant {
  id: string;
  name: string;
  email: string;
}

interface ITenantListItemProps {
  tenant: ITenant;
}

/**
 * @example
 * ```tsx
 * return (
 * <TenantListItem name='Momo'/>
 * )
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
              <DropdownMenuItemWithIcon icon={<SquarePen />}>
                <button onClick={() => setOpenEdit(true)}>Edit name</button>
              </DropdownMenuItemWithIcon>
              <DropdownMenuItemWithIcon icon={<Trash2 />}>
                <button onClick={() => setOpenDelete(true)}>Delete</button>
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
