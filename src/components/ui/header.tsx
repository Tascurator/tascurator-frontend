'use client';
import Link from 'next/link';
import { Ellipsis, Home, LogOutIcon } from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItemWithIcon,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { NameEditionDrawer } from '@/components/ui/drawers/names/NameEditionDrawer';
import { DeleteConfirmationDrawer } from '@/components/ui/drawers/deletions/with-checkbox/DeleteConfirmationDrawer';
import { LogOutDrawer } from '@/components/ui/drawers/auth/LogOutDrawer';
import { useState } from 'react';
import { DROPDOWN_ITEMS } from '@/constants/dropdown-items';
import { usePathname } from 'next/navigation';

const { EDIT_SHAREHOUSE_NAME, MANAGE_SHAREHOUSE, DELETE_SHAREHOUSE } =
  DROPDOWN_ITEMS;

// Header Item for Landload top page
function HeaderItemForTop() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink className="p-2" href="/">
                <Home className="w-5 h-5" />
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbPage>Dashboard</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div>
        <button type={'button'} className="p-2" onClick={() => setOpen(true)}>
          <LogOutIcon />
        </button>
        <LogOutDrawer open={open} setOpen={setOpen} />
      </div>
    </>
  );
}

function HeaderItemWithDropDown({
  pageTitle,
  sharehouseId,
}: {
  pageTitle: string;
  sharehouseId: string;
}) {
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const path = usePathname();
  const pathShareHouseId = `/sharehouses/${sharehouseId}`;
  const pathShareHouseIdEdit = `/sharehouses/${sharehouseId}/edit`;

  return (
    <>
      <div>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="pl-1">
              <BreadcrumbLink className="p-1" href="/">
                <Home className="w-5 h-5" />
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="pl-1">
                {path === pathShareHouseId && (
                  <div className="text-xl line-clamp-1">{pageTitle}</div>
                )}

                {path === pathShareHouseIdEdit && (
                  <BreadcrumbLink
                    className="text-xl line-clamp-1"
                    href={pathShareHouseId}
                  >
                    {pageTitle}
                  </BreadcrumbLink>
                )}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-2">
              <Ellipsis />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align={'end'}>
            <DropdownMenuGroup>
              <DropdownMenuItemWithIcon
                icon={EDIT_SHAREHOUSE_NAME.icon}
                onClick={() => setOpenEdit(true)}
              >
                {EDIT_SHAREHOUSE_NAME.text}
              </DropdownMenuItemWithIcon>

              {path === pathShareHouseId && (
                <Link href={pathShareHouseIdEdit}>
                  <DropdownMenuItemWithIcon icon={MANAGE_SHAREHOUSE.icon}>
                    {MANAGE_SHAREHOUSE.text}
                  </DropdownMenuItemWithIcon>
                </Link>
              )}
              {path === pathShareHouseIdEdit && <></>}

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
          name={pageTitle}
          open={openEdit}
          setOpen={setOpenEdit}
          type={'sharehouse'}
          id={sharehouseId}
        />
        <DeleteConfirmationDrawer
          id={sharehouseId}
          idType={'sharehouse'}
          deleteItem={pageTitle}
          open={openDelete}
          setOpen={setOpenDelete}
        />
      </div>
    </>
  );
}

function HeaderItemOnlyBreadcrumb({ pageTitle }: { pageTitle: string }) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem className="pl-1">
          <BreadcrumbLink className="p-1" href="/">
            <Home className="w-6 h-6" />
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage className="pl-1">{pageTitle}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}

interface IHeaderContainerProps {
  type:
    | 'HeaderItemForTop'
    | 'HeaderItemWithDropDown'
    | 'HeaderItemOnlyBreadcrumb';
  pageTitle: string;
  sharehouseId?: string;
}

/**
 * HeaderContainer
 * @description
 * This component is used to render the top header item.
 * @param {string} type - The type of the header item.
 * @param {string} pageTitle - The title of the page.
 * @param {string} [sharehouseId] - The id of the sharehouse.
 *
 * HeaderItemForTop
 * @example
 * ```
 * return (
 *  <Header type={'HeaderItemForTop'} pageTitle={''} />
 * );
 * ```
 *
 * HeaderItemWithDropDown
 * @example
 * ```tsx
 * const pageTitle = 'Sample Share House';
 *
 * return (
 *  <Header type={'HeaderItemWithDropDown'} pageTitle={pageTitle} sharehouseId="123" />
 * );
 * ```
 *
 * HeaderItemOnlyBreadcrumb
 * @example
 * ```tsx
 * const pageTitle = 'Setup';
 *
 * return (
 * <Header type={'HeaderItemOnlyBreadcrumb'} pageTitle={pageTitle} />
 * );
 * ```
 */

export const Header = ({
  type,
  pageTitle,
  sharehouseId,
}: IHeaderContainerProps) => {
  return (
    <header className="bg-primary text-white max-w-screen-sm w-full">
      <div className="container flex items-center justify-between h-14 py-4 px-4">
        {type === 'HeaderItemForTop' ? (
          <HeaderItemForTop />
        ) : type === 'HeaderItemWithDropDown' ? (
          <HeaderItemWithDropDown
            pageTitle={pageTitle}
            sharehouseId={sharehouseId ?? ''}
          />
        ) : (
          <HeaderItemOnlyBreadcrumb pageTitle={pageTitle} />
        )}
      </div>
    </header>
  );
};
