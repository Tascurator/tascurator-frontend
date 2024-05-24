import {
  CirclePlusIcon,
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
  // Add
  ADD_TASK: {
    icon: <CirclePlusIcon />,
    text: 'Add task',
  },

  // Delete
  DELETE: {
    icon: <Trash2Icon />,
    text: 'Delete',
  },
  DELETE_CATEGORY: {
    icon: <Trash2Icon />,
    text: 'Delete category',
  },

  // Edit
  EDIT: {
    icon: <SquarePenIcon />,
    text: 'Edit',
  },
  EDIT_SHAREHOUSE: {
    icon: <SquarePenIcon />,
    text: 'Edit share house name',
  },
  EDIT_CATEGORY_NAME: {
    icon: <SquarePenIcon />,
    text: 'Edit category name',
  },
  EDIT_TASK: {
    icon: <NotebookPenIcon />,
    text: 'Edit task',
  },
  EDIT_TENANT: {
    icon: <SquarePenIcon />,
    text: 'Edit tenant',
  },
};
