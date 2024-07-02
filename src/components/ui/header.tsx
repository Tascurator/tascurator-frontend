'use client';
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
import { NameEditionDrawer } from '@/components/ui/drawers/NameEditionDrawer';
import { DeleteConfirmationDrawer } from '@/components/ui/drawers/DeleteConfirmationDrawer';
import { LogOutDrawer } from '@/components/ui/drawers/LogOutDrawer';
import { useState } from 'react';
import { DROPDOWN_ITEMS } from '@/constants/dropdown-items';

const { EDIT_SHAREHOUSE_NAME, DELETE_SHAREHOUSE } = DROPDOWN_ITEMS;

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
                <Home className="w-6 h-6" />
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

function HeaderItemWithDropDown({ pageTitle }: { pageTitle: string }) {
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  return (
    <>
      <div>
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
      </div>
      <div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-2">
              <Ellipsis />
            </button>
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
        />
        <DeleteConfirmationDrawer
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
}

/**
 * HeaderContainer
 * @description
 * This component is used to render the top header item.
 * @param {string} type - The type of the header item.
 * @param {string} pageTitle - The title of the page.
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
 *  <Header type={'HeaderItemWithDropDown'} pageTitle={pageTitle} />
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
 */

export default function Header({ type, pageTitle }: IHeaderContainerProps) {
  return (
    <header className="sticky top-0 z-10 bg-primary text-white max-w-screen-sm w-full">
      <div className="container flex items-center justify-between h-14 py-4 px-4">
        {type === 'HeaderItemForTop' ? (
          <HeaderItemForTop />
        ) : type === 'HeaderItemWithDropDown' ? (
          <HeaderItemWithDropDown pageTitle={pageTitle} />
        ) : (
          <HeaderItemOnlyBreadcrumb pageTitle={pageTitle} />
        )}
      </div>
    </header>
  );
}
