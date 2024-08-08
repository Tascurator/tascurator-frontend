'use client';
import { useState } from 'react';
import { CirclePlus } from 'lucide-react';
import { TenantInvitationDrawer } from '@/components/ui/drawers/tenants/TenantInvitationDrawer';
import { CategoryCreationDrawer } from './drawers/categories/CategoryCreationDrawer';
import { SetupCategoryCreationDrawer } from '@/components/ui/drawers/categories/SetupCategoryCreationDrawer';
import { SetupTenantInvitationDrawer } from '@/components/ui/drawers/tenants/SetupTenantInvitationDrawer';
import { ICategory, ITenant } from '@/types/commons';

interface IHeaderTitleButtonProps {
  shareHouseId: string;
  title: string;
  type: 'categories' | 'tenants' | 'setupCategories' | 'setupTenants';
  onsubmitData?: (data: ICategory | ITenant) => void;
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
  onsubmitData,
}: IHeaderTitleButtonProps) => {
  const [openTaskDrawer, setOpenTaskDrawer] = useState(false);
  const [openTenantDrawer, setOpenTenantDrawer] = useState(false);
  const [openSetupCategoryDrawer, setOpenSetupCategoryDrawer] = useState(false);
  const [openSetupTenantDrawer, setOpenSetupTenantDrawer] = useState(false);

  const handleClick = () => {
    if (type === 'categories') {
      setOpenTaskDrawer(true);
    } else if (type === 'tenants') {
      setOpenTenantDrawer(true);
    } else if (type === 'setupCategories') {
      setOpenSetupCategoryDrawer(true);
    } else if (type === 'setupTenants') {
      setOpenSetupTenantDrawer(true);
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
          editOpen={openTaskDrawer}
          setEditOpen={setOpenTaskDrawer}
        />
        <TenantInvitationDrawer
          shareHouseId={shareHouseId}
          open={openTenantDrawer}
          setOpen={setOpenTenantDrawer}
        />
        <SetupCategoryCreationDrawer
          shareHouseId={shareHouseId}
          editOpen={openSetupCategoryDrawer}
          setEditOpen={setOpenSetupCategoryDrawer}
          addCategory={onsubmitData as (category: ICategory) => void}
        />
        <SetupTenantInvitationDrawer
          open={openSetupTenantDrawer}
          setOpen={setOpenSetupTenantDrawer}
          addTenant={onsubmitData as (tenant: ITenant) => void}
        />
      </div>
    </>
  );
};
