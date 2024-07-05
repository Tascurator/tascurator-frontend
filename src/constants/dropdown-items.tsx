import {
  CirclePlusIcon,
  NotebookPen,
  NotebookPenIcon,
  SquarePenIcon,
  Trash2Icon,
} from 'lucide-react';
import { ReactNode } from 'react';

interface IDropdownItems {
  [key: string]: {
    icon: ReactNode;
    text: string;
  };
}

/**
 * This file contains all the dropdown items used in the application.
 */
export const DROPDOWN_ITEMS: IDropdownItems = {
  // ShareHouse
  EDIT_SHAREHOUSE_NAME: {
    icon: <SquarePenIcon />,
    text: 'Edit share house name',
  },
  MANAGE_SHAREHOUSE: {
    icon: <NotebookPen />,
    text: 'Manage share house',
  },
  DELETE_SHAREHOUSE: {
    icon: <Trash2Icon />,
    text: 'Delete share house',
  },

  // Category
  EDIT_CATEGORY_NAME: {
    icon: <SquarePenIcon />,
    text: 'Edit category name',
  },
  DELETE_CATEGORY: {
    icon: <Trash2Icon />,
    text: 'Delete category',
  },

  // Task
  ADD_TASK: {
    icon: <CirclePlusIcon />,
    text: 'Add task',
  },
  EDIT_TASK: {
    icon: <NotebookPenIcon />,
    text: 'Edit task',
  },
  DELETE_TASK: {
    icon: <Trash2Icon />,
    text: 'Delete task',
  },

  // Tenant
  EDIT_TENANT: {
    icon: <SquarePenIcon />,
    text: 'Edit tenant setting',
  },
  DELETE_TENANT: {
    icon: <Trash2Icon />,
    text: 'Delete tenant',
  },
};
