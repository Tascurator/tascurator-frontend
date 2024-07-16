import type { ICategory, ITask, ITenant } from '@/types/commons';

/**
 * The object structure for AssignedTask
 */
export interface IAssignedTask extends ITask {
  isCompleted: boolean;
}

/**
 * The object structure for AssignedCategory
 * for when the number of tenants is equal to the number of tasks
 */
export interface ICategoriesEqualTenants {
  category: Omit<ICategory, 'tasks'>;
  tenantPlaceholderId: number;
  tenant: Omit<ITenant, 'email'>;
  tasks: IAssignedTask[];
}

/**
 * The object structure for AssignedCategory
 * for when the number of tenants is greater than the number of tasks
 */
export interface ICategoriesGreaterThanTenants {
  category: Omit<ICategory, 'tasks'>;
  tenantPlaceholderId: null;
  tenant: Omit<ITenant, 'email'>;
  tasks: IAssignedTask[];
}

/**
 * The object structure for AssignedCategory
 * for when the number of tenants is less than the number of tasks
 */
export interface ICategoriesLessThanTenants {
  category: null;
  tenantPlaceholderId: number;
  tenant: Omit<ITenant, 'email'>;
  tasks: null;
}

/**
 * The object structure for AssignedCategory
 * for when there is no tenant
 */
export interface ICategoryWithoutSingleTenant {
  category: Omit<ICategory, 'tasks'>;
  tenantPlaceholderId: number | null;
  tenant: null;
  tasks: null;
}

/**
 * The object structure for AssignedCategory
 */
export type TAssignedCategory =
  | ICategoriesEqualTenants
  | ICategoriesGreaterThanTenants
  | ICategoriesLessThanTenants
  | ICategoryWithoutSingleTenant;

/**
 * The object structure for AssignedData
 *
 * @note This replicates the JSON structure of the assignedData in the AssignmentSheet table.
 */
export interface IAssignedData {
  assignments: TAssignedCategory[];
}
