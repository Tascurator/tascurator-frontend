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

interface IUserActionsDropdownMenuProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  setDrawerOpen: (value: boolean) => void;
  setUserAction: (value: TUserAction) => void;
}

/**
 * Display a dropdown menu with edit and delete options.
 * When a dropdown item is clicked, the user action is set and the corresponding drawer is opened.
 */
const UserActionsDropdownMenu = ({
  open,
  setOpen,
  setDrawerOpen,
  setUserAction,
}: IUserActionsDropdownMenuProps) => {
  const handleItemClick = (item: TUserAction) => {
    setUserAction(item);
    setDrawerOpen(true);
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger />
      <DropdownMenuContent align={'end'} className={'-mt-10'}>
        <DropdownMenuGroup>
          {/* Edit option */}
          <DropdownMenuItemWithIcon
            icon={<SquarePenIcon />}
            onClick={() => handleItemClick('edit')}
          >
            Edit
          </DropdownMenuItemWithIcon>

          {/* Delete option */}
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
 * Display a task's title and description with a dropdown menu icon.
 */
export const AccordionTaskItem = ({
  title,
  description,
}: IAccordionTaskItemProps) => {
  /**
   * State to manage the dropdown menu open state.
   */
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  /**
   * State to manage the drawer open state.
   */
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  /**
   * State to manage the user action whether the user wants to edit or delete the task.
   * This state is used to determine which drawer to open.
   */
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
