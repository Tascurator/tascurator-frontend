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
import { SetupDeleteConfirmationDrawer } from '@/components/ui/drawers/deletions/with-checkbox/SetupDeleteConfirmationDrawer';
import { SetupNameEditionDrawer } from '@/components/ui/drawers/names/SetupNameEditionDrawer';
import { CONSTRAINTS } from '@/constants/constraints';
import { cn } from '@/lib/utils';
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
  isMinAmountOfCategory: boolean;
  isMaxAmountOfTask: boolean;
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
  isMinAmountOfCategory,
  isMaxAmountOfTask,
}: IUserActionsDropdownMenuProps) => {
  const handleItemClick = (item: TUserAction) => {
    if (
      (!isMinAmountOfCategory && item === 'delete') ||
      (!isMaxAmountOfTask && item === 'add') ||
      item === 'edit'
    ) {
      setUserAction(item);
      setDrawerOpen(true);
    }
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
            className={cn(
              isMaxAmountOfTask &&
                '[&>*]:text-slate-300 text-slate-300 cursor-not-allowed',
            )}
          >
            {ADD_TASK.text}
          </DropdownMenuItemWithIcon>

          {/* Delete option */}
          <DropdownMenuItemWithIcon
            icon={DELETE_CATEGORY.icon}
            onClick={() => handleItemClick('delete')}
            className={cn(
              isMinAmountOfCategory &&
                '[&>*]:text-slate-300 text-slate-300 cursor-not-allowed',
            )}
          >
            {DELETE_CATEGORY.text}
          </DropdownMenuItemWithIcon>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

interface IAccordionCategoryItemProps {
  taskAmount: number;
  category: ICategory;
  type?: string;

  onUpsertTask?: (task: ITask) => void;
  onUpdateName?: (id: string, newName: string) => void;
  categoryData?: ICategory[];
  onDelete?: (id: string) => void;
  isMinAmountOfCategory: boolean;
  isMaxAmountOfTask: boolean;
}

/**
 * Display a category's title with a dropdown menu icon.
 *
 * @example
 * <AccordionCategoryItem id={"1"} name={'Kitchen'} category={'Kitchen'} />
 */
export const AccordionCategoryItem = ({
  taskAmount,
  category,
  type,
  onUpsertTask,
  onUpdateName,
  onDelete,
  categoryData,
  isMinAmountOfCategory,
  isMaxAmountOfTask,
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

  const handleUpdateName = (newName: string) => {
    if (onUpdateName) {
      onUpdateName(category.id, newName);
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(category.id);
    }
  };

  const handleUpsertTask = (task: ITask) => {
    if (onUpsertTask) {
      onUpsertTask(task);
    }
  };

  return (
    <div className={'flex rounded-xl'}>
      <div className="flex items-center w-full">
        <AccordionTrigger>
          <span className="line-clamp-2">{category.name}</span>
          <span className="flex-grow pl-2 text-sm font-normal">
            ({taskAmount}/{CONSTRAINTS.TASK_MAX_AMOUNT})
          </span>
        </AccordionTrigger>
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
        isMinAmountOfCategory={isMinAmountOfCategory}
        isMaxAmountOfTask={isMaxAmountOfTask}
      />

      {type === 'setup' ? (
        <>
          {/* Task create drawer */}
          <SetupTaskCreationDrawer
            category={category}
            editOpen={isDrawerOpen && userAction === 'add'}
            setEditOpen={setIsDrawerOpen}
            onUpsertTask={handleUpsertTask}
          />

          {/* Category name edit drawer */}
          <SetupNameEditionDrawer
            name={category.name}
            open={isDrawerOpen && userAction === 'edit'}
            setOpen={setIsDrawerOpen}
            type={'category'}
            categoryData={categoryData}
            onUpdateName={handleUpdateName}
          />

          {/* Category deletion drawer */}
          <SetupDeleteConfirmationDrawer
            idType={'category'}
            deleteItem={category.name}
            open={isDrawerOpen && userAction === 'delete'}
            setOpen={setIsDrawerOpen}
            onDelete={handleDelete}
          />
        </>
      ) : (
        <>
          {/* Task create drawer */}
          <TaskCreationDrawer
            category={category}
            editOpen={isDrawerOpen && userAction === 'add'}
            setEditOpen={setIsDrawerOpen}
          />

          {/* Category name edit drawer */}
          <NameEditionDrawer
            name={category.name}
            open={isDrawerOpen && userAction === 'edit'}
            setOpen={setIsDrawerOpen}
            type={'category'}
            id={category.id}
          />

          {/* Category deletion drawer */}
          <DeleteConfirmationDrawer
            id={category.id}
            idType={'category'}
            deleteItem={category.name}
            open={isDrawerOpen && userAction === 'delete'}
            setOpen={setIsDrawerOpen}
          />
        </>
      )}
    </div>
  );
};
