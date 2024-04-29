import { Tables } from '@/types/database.types';

/**
 * The structure of the table: `ShareHouse`
 * @property {string} id
 * @property {string} name - The name of the share house
 * @property {string} landlord_id - The landlord of the share house
 * @property {string} assignment_sheet_id - The assignment sheet that the share house is associated with
 */
export type TShareHouse = Tables<'ShareHouse'>;

/**
 * The structure of the table: `RotationAssignment`
 * @property {string} id
 * @property {number} rotation_cycle - The rotation cycle of the assignment
 * @property {string} share_house_id - The share house that the rotation assignment is associated with
 */
export type TRotationAssignment = Tables<'RotationAssignment'>;

/**
 * The structure of the table: `AssignmentSheet`
 * @property {string} id
 * @property {string} start_date - The start date of the assignment sheet
 * @property {string} end_date - The end date of the assignment sheet
 * @property {JSON} assigned_data - The assigned data of the assignment sheet
 */
export type TAssignmentSheet = Tables<'AssignmentSheet'>;

/**
 * The structure of the table: `Category`
 * @property {string} id
 * @property {string} name - The name of the category
 * @property {string} rotation_assignment_id - The rotation assignment that the category is associated with
 */
export type TCategory = Tables<'Category'>;

/**
 * The structure of the table: `Task`
 * @property {string} id
 * @property {string} title - The title of the task
 * @property {string} description - The description of the task
 * @property {string} category_id - The category that the task is associated with
 */
export type TTask = Tables<'Task'>;

/**
 * The structure of the table: `TenantPlaceholder`
 * @property {number} index
 * @property {string} rotation_assignment_id - The rotation assignment that the tenant is associated with
 * @property {string | null} tenant_id - The tenant that this placeholder is associated with
 */
export type TTenantPlaceholder = Tables<'TenantPlaceholder'>;

/**
 * The structure of the table: `Tenant`
 * @property {string} id
 * @property {string} name - The name of the tenant
 * @property {string} email - The email of the tenant
 * @property {number} extra_assigned_count - The number of extra assignments for the tenant
 */
export type TTenant = Tables<'Tenant'>;

/**
 * The structure of the column `assigned_data` in the table: `AssignmentSheet`
 */
export type TAssignedData = {
  assignments: [
    {
      category?: {
        id: string;
        name: string;
      };
      assigneePlaceholderId?: number;
      assignee: {
        id: string;
        name: string;
      };
      tasks?: [
        {
          id: string;
          title: string;
          description: string;
          isCompleted: boolean;
        },
      ];
    },
  ];
};
