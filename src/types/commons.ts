/**
 * The object structure for ShareHouse
 */
export interface IShareHouse {
  id: string;
  name: string;
}

/**
 * The object structure for Task
 */
export interface ITask {
  id: string;
  title: string;
  description: string;
}

/**
 * The object structure for Category
 */
export interface ICategory {
  id: string;
  name: string;
  tasks: ITask[];
}

/**
 * The object structure for Tenant
 */
export interface ITenant {
  id: string;
  name: string;
  email: string;
}

/**
 * The object structure for AssignedTask
 *
 * @note This type is mainly used in the backend.
 */
export interface IAssignedTask {
  id: string;
  title: string;
  description: string;
  isCompleted: boolean;
}

/**
 * The object structure for AssignedCategory
 *
 * @note This type is mainly used in the backend.
 */
export interface IAssignedCategory {
  category: { id: string; name: string } | null;
  tenantPlaceholderId: number | null;
  tenant: Omit<ITenant, 'email'> | null;
  tasks: IAssignedTask[] | null;
}

/**
 * The object structure for AssignedData
 *
 * This replicates the JSON structure of the assignedData in the AssignmentSheet table.
 *
 * @note This type is mainly used in the backend.
 */
export interface IAssignedData {
  assignments: IAssignedCategory[];
}
