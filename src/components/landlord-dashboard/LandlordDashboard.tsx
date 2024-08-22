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
import { NameEditionDrawer } from '@/components/ui/drawers/names/NameEditionDrawer';
import { DeleteConfirmationDrawer } from '@/components/ui/drawers/deletions/with-checkbox/DeleteConfirmationDrawer';
import { DROPDOWN_ITEMS } from '@/constants/dropdown-items';
import Link from 'next/link';

export const LandlordDashboard = ({
  shareHouseName,
  shareHouseId,
}: {
  shareHouseName: string;
  shareHouseId: string;
}) => {
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const { EDIT_SHAREHOUSE_NAME, MANAGE_SHAREHOUSE, DELETE_SHAREHOUSE } =
    DROPDOWN_ITEMS;

  return (
    <>
      <div className="flex justify-between items-center pt-6 w-full">
        <Link href={`/sharehouses/${shareHouseId}/`}>
          <p className="text-2xl">{shareHouseName}</p>
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Ellipsis />
          </DropdownMenuTrigger>
          <DropdownMenuContent align={'end'}>
            <DropdownMenuGroup>
              <DropdownMenuItemWithIcon
                icon={EDIT_SHAREHOUSE_NAME.icon}
                onClick={() => setOpenEdit(true)}
              >
                {EDIT_SHAREHOUSE_NAME.text}
              </DropdownMenuItemWithIcon>
              <Link href={`/sharehouses/${shareHouseId}/edit`}>
                <DropdownMenuItemWithIcon icon={MANAGE_SHAREHOUSE.icon}>
                  {MANAGE_SHAREHOUSE.text}
                </DropdownMenuItemWithIcon>
              </Link>

              <DropdownMenuItemWithIcon
                icon={DELETE_SHAREHOUSE.icon}
                onClick={() => setOpenDelete(true)}
              >
                {DELETE_SHAREHOUSE.text}
              </DropdownMenuItemWithIcon>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <NameEditionDrawer
        name={shareHouseName}
        open={openEdit}
        setOpen={setOpenEdit}
        type={'sharehouse'}
        id={shareHouseId}
      />

      <DeleteConfirmationDrawer
        id={shareHouseId}
        idType={'sharehouse'}
        deleteItem={shareHouseName}
        open={openDelete}
        setOpen={setOpenDelete}
      />
    </>
  );
};
