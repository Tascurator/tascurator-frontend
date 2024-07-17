import type { ICategory, ITask, ITenant } from '@/types/commons';
import { Prisma } from '@prisma/client';

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
 * The object structure for Ass AssignedCategory
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

/**
 * Function to check if the category has tasks.
 * @param category
 */
export const hasTasks = (
  category: TAssignedCategory,
): category is ICategoriesEqualTenants | ICategoriesGreaterThanTenants => {
  return category.tasks !== null;
};

interface ICurrentRotation {
  startDate: string;
  endDate: string;
  categories: {
    id: string;
    name: string;
    tasks: IAssignedTask[];
  }[];
}

interface ISubsequentRotation {
  startDate: string;
  endDate: string;
  categories: {
    id: string;
    name: string;
    tasks: Pick<IAssignedTask, 'id' | 'title'>[];
  }[];
}

type RotationKeys = 1 | 2 | 3 | 4;

/**
 * The response type for 'api/tenant/[assignment_sheet_id]/[tenant_id]'
 */
export type TRotationScheduleForecast = {
  [key in RotationKeys]: key extends 1 ? ICurrentRotation : ISubsequentRotation;
};

/**
 * Type representing the Prisma ShareHouse object with the assignmentSheet and RotationAssignment included.
 */
export type TPrismaShareHouse = Prisma.ShareHouseGetPayload<{
  select: {
    assignmentSheet: true;
    RotationAssignment: {
      select: {
        rotationCycle: true;
        categories: {
          include: { tasks: true };
        };
        tenantPlaceholders: {
          include: {
            tenant: true;
          };
        };
      };
    };
  };
}>;

/**
 * Type representing the Prisma Category object with the tasks included.
 */
export type TPrismaCategory = Prisma.CategoryGetPayload<{
  include: { tasks: true };
}>;

/**
 * Type representing the Prisma Task object.
 */
export type TPrismaTask = Prisma.TaskGetPayload<NonNullable<unknown>>;

/**
 * Type representing the Prisma Tenant object.
 */
export type TPrismaTenantPlaceholder = Prisma.TenantPlaceholderGetPayload<{
  include: { tenant: true };
}>;
