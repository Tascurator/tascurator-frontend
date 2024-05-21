'use client';

import { EllipsisIcon, SquarePenIcon, Trash2Icon } from 'lucide-react';
import { MouseEvent, useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItemWithIcon,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type TUserAction = 'edit' | 'delete';

interface IDropdownProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  setDrawerOpen: (value: boolean) => void;
  setUserAction: (value: TUserAction) => void;
}

const UserActionsDropdownMenu = ({
  open,
  setOpen,
  setDrawerOpen,
  setUserAction,
}: IDropdownProps) => {
  const handleItemClick = (item: TUserAction) => {
    setUserAction(item);
    setDrawerOpen(true);
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger />
      <DropdownMenuContent align={'end'} className={'-mt-10'}>
        <DropdownMenuGroup>
          <DropdownMenuItemWithIcon
            icon={<SquarePenIcon />}
            onClick={() => handleItemClick('edit')}
          >
            Edit
          </DropdownMenuItemWithIcon>
          <DropdownMenuItemWithIcon
            icon={<Trash2Icon />}
            onClick={() => handleItemClick('delete')}
          >
            Delete
          </DropdownMenuItemWithIcon>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

interface IAccordionTaskItemProps {
  title: string;
  description: string;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
}

/**
 * Use this component to display a task item in an accordion.
 *
 * @param title - The title of the task
 * @param description - The description of the task
 */
export const AccordionTaskItem = ({
  title,
  description,
}: IAccordionTaskItemProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [userAction, setUserAction] = useState<TUserAction>('edit');

  return (
    <div className={'bg-white flex rounded-xl'}>
      <div className={'flex-1 flex flex-col pl-4 py-4 gap-y-2'}>
        <h3 className={'text-base font-medium'}>{title}</h3>
        <p className={'text-sm line-clamp-2'}>{description}</p>
      </div>
      <button
        className={'flex justify-center items-center px-4 hover:cursor-pointer'}
        onClick={() => setIsDropdownOpen((prev) => !prev)}
      >
        <EllipsisIcon className={'size-5'} />
      </button>

      <UserActionsDropdownMenu
        open={isDropdownOpen}
        setOpen={setIsDropdownOpen}
        setDrawerOpen={setIsDrawerOpen}
        setUserAction={setUserAction}
      />

      {/* TODO: Implement drawers here  */}
      {isDrawerOpen && userAction === 'edit' && <div>Edit</div>}
      {isDrawerOpen && userAction === 'delete' && <div>Delete</div>}
    </div>
  );
};
