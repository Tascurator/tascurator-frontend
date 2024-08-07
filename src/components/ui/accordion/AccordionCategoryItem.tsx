'use client';
import { CircleEllipsis } from 'lucide-react';
import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItemWithIcon,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DROPDOWN_ITEMS } from '@/constants/dropdown-items';
import { NameEditionDrawer } from '@/components/ui/drawers/names/NameEditionDrawer';
import { AccordionTrigger } from '@/components/ui/accordion';
import { TaskCreationDrawer } from '@/components/ui/drawers/tasks/TaskCreationDrawer';
import { DeleteConfirmationDrawer } from '@/components/ui/drawers/deletions/with-checkbox/DeleteConfirmationDrawer';
import { ICategory, ITask } from '@/types/commons';
import { SetupTaskCreationDrawer } from '@/components/ui/drawers/tasks/SetupTaskCreationDrawer';
import { SetupDeleteConfirmationDrawer } from '../drawers/deletions/with-checkbox/SetupDeleteConfirmationDrawer';

/**
 * Constants used in the dropdown menu.
 */
const { EDIT_CATEGORY_NAME, DELETE_CATEGORY, ADD_TASK } = DROPDOWN_ITEMS;

/**
 * User action type to determine whether the user wants to edit, delete a category, or add a task.
 * This type is used to determine which drawer to open.
 */
type TUserAction = 'edit' | 'add' | 'delete';

interface IUserActionsDropdownMenuProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  setDrawerOpen: (value: boolean) => void;
  setUserAction: (value: TUserAction) => void;
}

/**
 * Display a dropdown menu with edit, add, and delete options.
 * When this dropdown menu is opened is handled by the parent component.
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
      <DropdownMenuContent align={'end'} className={'-mt-2'}>
        <DropdownMenuGroup>
          {/* Edit option */}
          <DropdownMenuItemWithIcon
            icon={EDIT_CATEGORY_NAME.icon}
            onClick={() => handleItemClick('edit')}
          >
            {EDIT_CATEGORY_NAME.text}
          </DropdownMenuItemWithIcon>

          {/* Add option */}
          <DropdownMenuItemWithIcon
            icon={ADD_TASK.icon}
            onClick={() => handleItemClick('add')}
          >
            {ADD_TASK.text}
          </DropdownMenuItemWithIcon>

          {/* Delete option */}
          <DropdownMenuItemWithIcon
            icon={DELETE_CATEGORY.icon}
            onClick={() => handleItemClick('delete')}
          >
            {DELETE_CATEGORY.text}
          </DropdownMenuItemWithIcon>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

interface IAccordionCategoryItemProps {
  category: ICategory;
  type?: string;

  // todo change any to the correct type
  /* eslint-disable @typescript-eslint/no-explicit-any */
  onsubmitData: (data: any) => void;
}

/**
 * Display a category's title with a dropdown menu icon.
 *
 * @example
 * <AccordionCategoryItem id={"1"} name={'Kitchen'} category={'Kitchen'} />
 */
export const AccordionCategoryItem = ({
  category,
  type,
  onsubmitData,
}: IAccordionCategoryItemProps) => {
  /**
   * State to manage the dropdown menu open state.
   */
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  /**
   * State to manage the drawer open state.
   */
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  /**
   * State to manage the user action whether the user wants to edit, delete a category, or add a task.
   * This state is used to determine which drawer to open.
   *
   * edit: The drawer to edit a category name
   * add: The drawer to add a task
   * delete: The drawer to delete a category
   */
  const [userAction, setUserAction] = useState<TUserAction>('edit');

  return (
    <div className={'flex rounded-xl'}>
      <div className="flex items-center w-full">
        <AccordionTrigger>{category.name}</AccordionTrigger>
        <button
          className={
            'flex justify-center items-center p-4 hover:cursor-pointer'
          }
          onClick={() => setIsDropdownOpen((prev) => !prev)}
        >
          <CircleEllipsis className={'size-5'} />
        </button>
      </div>

      <UserActionsDropdownMenu
        open={isDropdownOpen}
        setOpen={setIsDropdownOpen}
        setDrawerOpen={setIsDrawerOpen}
        setUserAction={setUserAction}
      />

      {/* Category name edit drawer */}
      <NameEditionDrawer
        name={category.name}
        open={isDrawerOpen && userAction === 'edit'}
        setOpen={setIsDrawerOpen}
        type={'category'}
        id={category.id}
      />

      {/* Task create drawer */}
      {type === 'setup' ? (
        <SetupTaskCreationDrawer
          category={category}
          editOpen={isDrawerOpen && userAction === 'add'}
          setEditOpen={setIsDrawerOpen}
          addTask={onsubmitData as (task: ITask) => void}
        />
      ) : (
        <TaskCreationDrawer
          category={category}
          editOpen={isDrawerOpen && userAction === 'add'}
          setEditOpen={setIsDrawerOpen}
        />
      )}

      {/* Category deletion drawer */}
      {type === 'setup' ? (
        <SetupDeleteConfirmationDrawer
          id={category.id}
          idType={'category'}
          deleteItem={category.name}
          open={isDrawerOpen && userAction === 'delete'}
          setOpen={setIsDrawerOpen}
        />
      ) : (
        <DeleteConfirmationDrawer
          id={category.id}
          idType={'category'}
          deleteItem={category.name}
          open={isDrawerOpen && userAction === 'delete'}
          setOpen={setIsDrawerOpen}
        />
      )}
    </div>
  );
};
