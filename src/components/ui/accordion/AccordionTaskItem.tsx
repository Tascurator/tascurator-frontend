'use client';

import { EllipsisIcon } from 'lucide-react';
import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItemWithIcon,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { TaskCreationDrawer } from '@/components/ui/drawers/tasks/TaskCreationDrawer';
import { TaskDeletionDrawer } from '../drawers/deletions/without-checkbox/TaskDeletionDrawer';
import { DROPDOWN_ITEMS } from '@/constants/dropdown-items';
import { ICategoryWithoutTasks } from '@/types/commons';
import { removeHtmlTags } from '@/utils/task-description';
import { cn } from '@/lib/utils';

/**
 * Constants used in the dropdown menu.
 */
const { EDIT_TASK, DELETE_TASK } = DROPDOWN_ITEMS;

/**
 * User action type to determine whether the user wants to edit or delete a task.
 * This type is used to determine which drawer to open.
 */
type TUserAction = 'edit' | 'delete';

interface IUserActionsDropdownMenuProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  setDrawerOpen: (value: boolean) => void;
  setUserAction: (value: TUserAction) => void;
  isMinAmountOfTask: boolean;
}

/**
 * Display a dropdown menu with edit and delete options.
 * When this dropdown menu is opened is handled by the parent component.
 */
const UserActionsDropdownMenu = ({
  open,
  setOpen,
  setDrawerOpen,
  setUserAction,
  isMinAmountOfTask,
}: IUserActionsDropdownMenuProps) => {
  const handleItemClick = (item: TUserAction) => {
    if ((!isMinAmountOfTask && item === 'delete') || item === 'edit') {
      setUserAction(item);
      setDrawerOpen(true);
    }
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger />
      <DropdownMenuContent align={'end'} className={'-mt-5'}>
        <DropdownMenuGroup>
          {/* Edit option */}
          <DropdownMenuItemWithIcon
            icon={EDIT_TASK.icon}
            onClick={() => handleItemClick('edit')}
          >
            {EDIT_TASK.text}
          </DropdownMenuItemWithIcon>

          {/* Delete option */}
          <DropdownMenuItemWithIcon
            icon={DELETE_TASK.icon}
            onClick={() => handleItemClick('delete')}
            className={cn(
              isMinAmountOfTask &&
                '[&>*]:text-slate-300 text-slate-300 cursor-not-allowed',
            )}
          >
            {DELETE_TASK.text}
          </DropdownMenuItemWithIcon>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

interface IAccordionTaskItemProps {
  id: string;
  title: string;
  description: string;
  category: ICategoryWithoutTasks;
  isMinAmountOfTask: boolean;
}

/**
 * Display a task's title and description with a dropdown menu icon.
 *
 * @example
 * <AccordionTaskItem id="1" category="Category" title="Task title" description="Task description" />
 */
export const AccordionTaskItem = ({
  id,
  category,
  title,
  description,
  isMinAmountOfTask,
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
   *
   * edit: The drawer to edit a task
   * delete: The drawer to delete a task
   */
  const [userAction, setUserAction] = useState<TUserAction>('edit');

  return (
    <div className={'bg-white flex rounded-xl'}>
      <div className={'flex-1 flex flex-col pl-4 py-4 gap-y-2'}>
        <h3 className={'text-base font-medium'}>{title}</h3>
        <p className={'text-sm line-clamp-2'}>{removeHtmlTags(description)}</p>
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
        isMinAmountOfTask={isMinAmountOfTask}
      />

      {/* Task creation drawer */}
      <TaskCreationDrawer
        category={category}
        task={{
          id,
          title,
          description,
        }}
        editOpen={isDrawerOpen && userAction === 'edit'}
        setEditOpen={setIsDrawerOpen}
      />

      {/* Task deletion drawer */}
      <TaskDeletionDrawer
        title={title}
        open={isDrawerOpen && userAction === 'delete'}
        setOpen={setIsDrawerOpen}
        taskId={id}
      />
    </div>
  );
};
