'use client';
import { Ellipsis, Home, LogOutIcon, SquarePen, Trash2 } from 'lucide-react';
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

// TODO: Implement DropDown menu
function HeaderItemWithDropDown({
  pageTitle,
  // menuItems,
}: {
  pageTitle: string;
  // menuItems: { title: string; icon: React.ReactNode }[];
}) {
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
              <DropdownMenuItemWithIcon icon={<SquarePen />}>
                <button onClick={() => setOpenEdit(true)}>
                  Edit share house name
                </button>
              </DropdownMenuItemWithIcon>
              <DropdownMenuItemWithIcon icon={<Trash2 />}>
                <button onClick={() => setOpenDelete(true)}>
                  Delete share house
                </button>
              </DropdownMenuItemWithIcon>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        <NameEditionDrawer
          name={'sample name'}
          open={openEdit}
          setOpen={setOpenEdit}
          type={'sharehouse'}
        />
        <DeleteConfirmationDrawer
          deleteItem={'sample name'}
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
  // menuItems: { title: string; icon: ReactNode }[];
}

/**
 * HeaderContainer
 * @description
 * This component is used to render the top header item.
 * @param {string} type - The type of the header item.
 * @param {string} pageTitle - The title of the page.
//  * @param {ReactNode[]} menuItems - The list of menu items.
 *
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
 * const pageTitle = 'Setup';
 * const menuItems = [
 * {title: 'Edit', icon: <SquarePen />},
 * {title: 'Delete', icon: <Trash2 />},
 * ];
 *
 * return (
 *  <Header type={'HeaderItemWithDropDown'} pageTitle={'test'} />
 * );
 * ```
 *
 * HeaderItemOnlyBreadcrumb
 * @example
 * ```tsx
 * return (
 * <Header type={'HeaderItemOnlyBreadcrumb'} pageTitle={'test'} />
 * );
 */

// TODO: If menuItems is not needed as a prop, remove it from the interface and the component
export default function Header({
  type,
  pageTitle,
  // menuItems,
}: IHeaderContainerProps) {
  return (
    <header className="sticky top-0 z-10 bg-primary text-white max-w-screen-sm w-full">
      <div className="container flex items-center justify-between h-14 py-4 px-4">
        {type === 'HeaderItemForTop' ? (
          <HeaderItemForTop />
        ) : type === 'HeaderItemWithDropDown' ? (
          // TODO: Implement DropDown menu
          <HeaderItemWithDropDown pageTitle={pageTitle} />
        ) : (
          <HeaderItemOnlyBreadcrumb pageTitle={pageTitle} />
        )}
      </div>
    </header>
  );
}
