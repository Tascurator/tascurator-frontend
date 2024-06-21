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

import { ReactNode } from 'react';

// Header Item for Landload top page
function HeaderItemForTop() {
  return (
    <>
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
      <button type={'button'} className="p-2">
        <LogOutIcon />
      </button>
    </>
  );
}

// TODO: Implement DropDown menu
function HeaderItemWithDropDown({
  pageTitle,
  menuItems,
}: {
  pageTitle: string;
  menuItems: { title: string; icon: React.ReactNode }[];
}) {
  return (
    <>
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
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="p-2">
            <Ellipsis />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuGroup>
            {menuItems.map((item, index) => (
              <DropdownMenuItemWithIcon key={index} icon={item.icon}>
                {item.title}
              </DropdownMenuItemWithIcon>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
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
  menuItems: { title: string; icon: ReactNode }[];
}

/**
 * HeaderContainer
 * @description
 * This component is used to render the top header item.
 * @param {string} type - The type of the header item.
 * @param {string} pageTitle - The title of the page.
 * @param {ReactNode[]} menuItems - The list of menu items.
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
  menuItems,
}: IHeaderContainerProps) {
  return (
    <header className="sticky top-0 z-10 bg-primary text-white max-w-screen-sm w-full">
      <div className="container flex items-center justify-between h-14 py-4 px-4">
        {type === 'HeaderItemForTop' ? (
          <HeaderItemForTop />
        ) : type === 'HeaderItemWithDropDown' ? (
          // TODO: Implement DropDown menu
          <HeaderItemWithDropDown pageTitle={pageTitle} menuItems={menuItems} />
        ) : (
          <HeaderItemOnlyBreadcrumb pageTitle={pageTitle} />
        )}
      </div>
    </header>
  );
}
