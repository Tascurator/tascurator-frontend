'use client';
import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItemWithIcon,
  DropdownMenuGroup,
} from '@/components/ui/dropdown-menu';
import { Ellipsis } from 'lucide-react';
import { NameEditionDrawer } from '@/components/ui/drawers/NameEditionDrawer';
import { DeleteConfirmationDrawer } from '@/components/ui/drawers/DeleteConfirmationDrawer';
import { DROPDOWN_ITEMS } from '@/constants/dropdown-items';

const LandlordDashboard = ({ name }: { name: string }) => {
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const { EDIT_SHAREHOUSE_NAME, MANAGE_SHAREHOUSE, DELETE_SHAREHOUSE } =
    DROPDOWN_ITEMS;

  return (
    <>
      <div className="flex justify-between pt-6 ">
        <p className="text-2xl">{name}</p>
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Ellipsis />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuGroup>
                <DropdownMenuItemWithIcon
                  icon={EDIT_SHAREHOUSE_NAME.icon}
                  onClick={() => setOpenEdit(true)}
                >
                  {EDIT_SHAREHOUSE_NAME.text}
                </DropdownMenuItemWithIcon>

                <DropdownMenuItemWithIcon
                  icon={MANAGE_SHAREHOUSE.icon}
                  onClick={() => console.log(MANAGE_SHAREHOUSE.text)}
                >
                  {MANAGE_SHAREHOUSE.text}
                </DropdownMenuItemWithIcon>

                <DropdownMenuItemWithIcon
                  icon={DELETE_SHAREHOUSE.icon}
                  onClick={() => setOpenDelete(true)}
                >
                  {DELETE_SHAREHOUSE.text}
                </DropdownMenuItemWithIcon>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <NameEditionDrawer
            name={name}
            open={openEdit}
            setOpen={setOpenEdit}
            type={'sharehouse'}
          />

          <DeleteConfirmationDrawer
            deleteItem={name}
            open={openDelete}
            setOpen={setOpenDelete}
          />
        </div>
      </div>
    </>
  );
};

export { LandlordDashboard };
