import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Ellipsis, Trash2, SquarePen } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItemWithIcon,
} from '@/components/ui/dropdown-menu';

interface TenantListProps {
  fallback: string;
  name: string;
}

/**
 * @example
 * ```tsx
 * return (
 * <TenantList fallback='MM' name='Momo'/>
 * )
 */
const TenantList = ({ fallback, name }: TenantListProps) => {
  return (
    <div className="flex items-center justify-between w-full h-full mx-5 my-3">
      <div>
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>{fallback}</AvatarFallback>
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
                {' '}
                Edit name{' '}
              </DropdownMenuItemWithIcon>
              <DropdownMenuItemWithIcon icon={<Trash2 />}>
                {' '}
                Delete{' '}
              </DropdownMenuItemWithIcon>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default TenantList;
