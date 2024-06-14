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

/**
 * HeaderItemForTop
 * @description
 * This component is used to render the top header item.
 * @example
 * ```tsx
 * return (
 *  <HeaderContainer>
 *   <HeaderItemForTop />
 * </HeaderContainer>
 * );
 * ```
 *
 * HeaderItemWithDropDown
 * @example
 * ```tsx
 * const menuItems = [
 * {title: 'Edit', icon: <SquarePen />},
 * {title: 'Delete', icon: <Trash2 />},
 * ];
 *
 * return (
 * <HeaderContainer>
 *   <HeaderItemWithDropDown pageTitle="Sample Share House" menuItems={menuItems} />
 * </HeaderContainer>
 * );
 * ```
 *
 * HeaderItemOnlyBreadcrumb
 * @example
 * ```tsx
 * return (
 * <HeaderContainer>
 *  <HeaderItemOnlyBreadcrumb pageTitle="Setup" />
 * </HeaderContainer>
 * );
 */

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
      <button className="p-2">
        <LogOutIcon />
      </button>
    </>
  );
}

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

export { HeaderItemForTop, HeaderItemWithDropDown, HeaderItemOnlyBreadcrumb };
