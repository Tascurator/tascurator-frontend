'use client';
import { useState } from 'react';
import { CirclePlus } from 'lucide-react';
import { TaskCreationDrawer } from './drawers/TaskCreationDrawer';
import { TenantInvitationDrawer } from './drawers/TenantInvitationDrawer';

interface IHeaderTitleButtonProps {
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
        <TaskCreationDrawer open={openTaskDrawer} setOpen={setOpenTaskDrawer} />
        <TenantInvitationDrawer
          open={openTenantDrawer}
          setOpen={setOpenTenantDrawer}
        />
      </div>
    </>
  );
};
