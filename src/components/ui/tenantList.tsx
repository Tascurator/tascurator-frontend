import { Avatar } from '@/components/ui/avatar';
import { Ellipsis, Trash2, SquarePen, User } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItemWithIcon,
} from '@/components/ui/dropdown-menu';

interface ITenantListItemProps {
  name: string;
}

/**
 * @example
 * ```tsx
 * return (
 * <TenantListItem name='Momo'/>
 * )
 */
export const TenantListItem = ({ name }: ITenantListItemProps) => {
  return (
    <div className="flex items-center justify-between w-full h-full">
      <div>
        <Avatar>
          <User />
        </Avatar>
      </div>
      <div className="ml-4">{name}</div>
      <div className="ml-auto">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-4">
              <Ellipsis />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuGroup>
              <DropdownMenuItemWithIcon icon={<SquarePen />}>
                Edit name
              </DropdownMenuItemWithIcon>
              <DropdownMenuItemWithIcon icon={<Trash2 />}>
                Delete
              </DropdownMenuItemWithIcon>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
