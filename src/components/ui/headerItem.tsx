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
 *  <Header>
 *   <HeaderItemForTop />
 * </Header>
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
 * <Header>
 *   <HeaderItemWithDropDown pageTitle="Sample Share House" menuItems={menuItems} />
 * </Header>
 * );
 * ```
 *
 * HeaderItemWithoutDropDown
 * @example
 * ```tsx
 * return (
 * <Header>
 *  <HeaderItemWithoutDropDown pageTitle="Setup" />
 * </Header>
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

function HeaderItemWithoutDropDown({ pageTitle }: { pageTitle: string }) {
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

export { HeaderItemForTop, HeaderItemWithDropDown, HeaderItemWithoutDropDown };
