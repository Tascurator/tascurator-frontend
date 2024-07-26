'use client';
import { useState } from 'react';
import { CirclePlus } from 'lucide-react';
import { TenantInvitationDrawer } from './drawers/TenantInvitationDrawer';
import { CategoryCreationDrawer } from './drawers/CategoryCreationDrawer';

interface IHeaderTitleButtonProps {
  shareHouseId: string;
  title: string;
  type: 'categories' | 'tenants';
}

/**
 * Display a title with a drawer icon.
 *
 * @example
 * <ShareHouseManagementHead title={'Tenants'} type={'tenant'} />
 */

export const ShareHouseManagementHead = ({
  shareHouseId,
  title,
  type,
}: IHeaderTitleButtonProps) => {
  const [openTaskDrawer, setOpenTaskDrawer] = useState(false);
  const [openTenantDrawer, setOpenTenantDrawer] = useState(false);

  const handleClick = () => {
    if (type === 'categories') {
      setOpenTaskDrawer(true);
    } else if (type === 'tenants') {
      setOpenTenantDrawer(true);
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mt-6">
        <p>{title}</p>
        <CirclePlus
          className={'stroke-primary cursor-pointer'}
          type={type}
          onClick={handleClick}
        />
      </div>
      <div className="h-0">
        <CategoryCreationDrawer
          shareHouseId={shareHouseId}
          open={openTaskDrawer}
          setOpen={setOpenTaskDrawer}
        />
        <TenantInvitationDrawer
          shareHouseId={shareHouseId}
          open={openTenantDrawer}
          setOpen={setOpenTenantDrawer}
        />
      </div>
    </>
  );
};
