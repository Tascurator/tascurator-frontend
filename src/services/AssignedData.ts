import {
  hasTasks,
  IAssignedData,
  IAssignedTask,
  ICategoriesEqualTenants,
  ICategoriesGreaterThanTenants,
  ICategoryWithoutSingleTenant,
  TAssignedCategory,
  TPrismaCategory,
  TPrismaTask,
  TPrismaTenantPlaceholder,
} from '@/types/server';
import { addDays } from '@/utils/dates';
import { RotationCycle } from '@/types/commons';

/**
 * Represents the assigned data for a specific rotation period based on a given assignedData.
 * Provides methods to access and manipulate the assigned data and generate the next rotation's assigned data based on the current one.
 */
export class AssignedData {
  private readonly assignedData: IAssignedData;
  private readonly startDate: Date;
  private readonly endDate: Date;

  constructor(assignedData: IAssignedData, startDate: Date, endDate: Date) {
    this.assignedData = assignedData;
    this.startDate = startDate;
    this.endDate = endDate;
  }

  /**
   * Returns the assigned data for current rotation
   */
  public getAssignedData = (): IAssignedData => this.assignedData;

  /**
   * Returns the start date of the rotation in UTC+0 time
   */
  public getStartDate = (): Date => this.startDate;

  /**
   * Returns the end date of the rotation in UTC+0 time
   */
  public getEndDate = (): Date => this.endDate;

  /**
   * Returns the assignments for the current rotation
   */
  public getAssignments = (): TAssignedCategory[] =>
    this.assignedData.assignments;

  /**
   * Retrieves the tenants in the current rotation
   */
  public getTenants = (): {
    name: string;
    id: string;
    tenantPlaceholderId: number;
  }[] => {
    return this.getAssignments()
      .map((category) => {
        if (category.tenantPlaceholderId !== null && category.tenant) {
          return {
            id: category.tenant.id,
            name: category.tenant.name,
            tenantPlaceholderId: category.tenantPlaceholderId,
          };
        }
        return null;
      })
      .filter((tenant) => tenant !== null);
  };

  /**
   * Checks if a given tenant exists in the current rotation
   */
  public hasTenant = (tenantId: string): boolean =>
    this.getTenants().findIndex((tenant) => tenant.id === tenantId) !== -1;

  /**
   * Retrieves the assigned categories for a given tenant
   *
   * @param tenantId - The tenant ID
   */
  public getAssignedCategories = (tenantId: string) => {
    /**
     * Populate the assigned categories, which type is ICategoriesEqualTenants or ICategoriesGreaterThanTenants (because we only need the categories that have the given tenant assigned)
     */
    return this.getAssignments()
      .filter((category) => hasTasks(category))
      .filter((category) => category.tenant.id === tenantId)
      .map((category) => {
        return {
          id: category.category.id,
          name: category.category.name,
          tasks: category.tasks,
        };
      });
  };

  /**
   * Changes the completion status of a task
   *
   * @param tenantId - The tenant ID
   * @param taskId - The task ID
   * @param status - The new completion status
   */
  public toggleTaskCompletion = (
    tenantId: string,
    taskId: string,
    status: boolean,
  ) => {
    const assignments = this.getAssignments();
    const assignment = assignments.find((a) => a.tenant?.id === tenantId);
    if (!assignment) return;

    const task = assignment.tasks?.find((t) => t.id === taskId);
    if (!task) return;

    task.isCompleted = status;
  };

  /**
   * Calculates the number of extra assignments for each tenant in the current rotation's assigned data.
   *
   * Use this method to get and update the extraAssignedCount of each tenant in database.
   *
   * @returns An object with the tenants and their extraAssignedCount updates
   */
  public calculateExtraAssignments = (): {
    tenants: { id: string; increasedExtraAssignedCount: number }[];
  } => {
    const extraAssignmentCounts: { [tenantId: string]: number } = {};

    /**
     * Initialize count tracking for each tenant
     */
    this.getAssignments().reduce((acc, assignment) => {
      if (assignment.tenant) {
        if (!acc[assignment.tenant.id]) {
          acc[assignment.tenant.id] = 0;
        }
        acc[assignment.tenant.id]++;
      }
      return acc;
    }, extraAssignmentCounts);

    /**
     * Convert to the required return format
     */
    return {
      tenants: Object.entries(extraAssignmentCounts)
        .map(([id, count]) => {
          if (count <= 1) return null;

          return {
            id,
            increasedExtraAssignedCount: count - 1, // -1 because we want only the number of EXTRA assignments
          };
        })
        .filter((tenant) => tenant !== null),
    };
  };

  /**
   * Create a new instance of AssignedData with the next rotation's assigned data
   *
   * @param categories - The latest categories with tasks to assign
   * @param tenantPlaceholders - The latest tenant placeholders to assign to
   * @param rotationCycle - The latest rotation cycle
   */
  public createNextRotation = (
    categories: TPrismaCategory[],
    tenantPlaceholders: TPrismaTenantPlaceholder[],
    rotationCycle: RotationCycle,
  ): AssignedData => {
    /**
     * Note:
     * The startDate is already in UTC+0 time, and adding days to it will not affect the result.
     * Therefore, converting it to PDT time is not necessary.
     */
    const startDate = this.getEndDate();
    const endDate = addDays(startDate, rotationCycle);
    const nextAssignedData = this.generateNextAssignedData(
      categories,
      tenantPlaceholders,
    );

    return new AssignedData(nextAssignedData, startDate, endDate);
  };

  /**
   * Generate next rotation's assigned data
   *
   * @param categories - The categories with tasks to assign
   * @param tenantPlaceholders - The tenant placeholders to assign to
   * @protected
   */
  protected generateNextAssignedData = (
    categories: TPrismaCategory[],
    tenantPlaceholders: TPrismaTenantPlaceholder[],
  ): IAssignedData => {
    /**
     * Throw an error if there are no categories
     */
    if (categories.length < 1) {
      throw new Error('No categories found');
    }

    /**
     * Get the current array index of the head placeholder
     *
     * If the tenant placeholders array is [0, 1, 2, 3, 4] and the head placeholder is 0,
     * the current head placeholder index is 0.
     */
    const currentHeadPlaceholderIndex =
      this.getTenantPlaceholderRotationStartIndex();

    /**
     * Get the next head placeholder index after rotation
     *
     * If the tenant placeholders array is [0, 1, 2, 3, 4],
     * the next array after rotation is [4, 0, 1, 2, 3] (rotated to the right by 1).
     * So, the next head placeholder index is 1.
     */
    const nextHeadPlaceholderIndex =
      this.calculateNextTenantPlaceholderHeadIndex(
        currentHeadPlaceholderIndex,
        tenantPlaceholders.length,
      );

    /**
     * Filters the TenantPlaceholders array to remove all elements that have no tenant assigned
     * after an element with tenant assigned is found.
     *
     * @example
     * [
     *   { index: 0, tenant: { id: '1', name: 'Tenant 1' } },
     *   { index: 1, tenant: null },
     *   { index: 2, tenant: { id: '2', name: 'Tenant 2' } },
     *   { index: 3, tenant: null },
     *   { index: 4, tenant: null}
     * ]
     *
     * After filtering:
     * [
     *   { index: 0, tenant: { id: '1', name: 'Tenant 1' } },
     *   { index: 1, tenant: null },
     *   { index: 2, tenant: { id: '2', name: 'Tenant 2' } }
     * ]
     */
    const filteredTenantPlaceholders = tenantPlaceholders.filter(
      (_, index) =>
        index <=
        tenantPlaceholders
          .map((item) => item.tenant !== null)
          .lastIndexOf(true),
    );

    /**
     * Initialize the new assigned data object
     */
    const newAssignedData: IAssignedData = { assignments: [] };

    /**
     * Firstly, check if there is at least 1 tenant in the share house.
     * If not, returns an object like below:
     *
     * {
     *   assignments: [
     *    {
     *      category: { id: string, name: string },
     *      tenantPlaceholderId: number | null,
     *      tenant: null,
     *      tasks: null,
     *    }
     *   ]
     * }
     */
    if (
      filteredTenantPlaceholders.length < 1 ||
      filteredTenantPlaceholders.filter((tp) => tp.tenant).length < 1
    ) {
      return this.assignWithoutTenants(categories, nextHeadPlaceholderIndex);
    }

    /**
     * Iterate through each category and assign a tenant and tasks to it
     */
    categories.forEach((category, i) => {
      const assignment = this.assignCategory(
        category,
        i,
        nextHeadPlaceholderIndex,
        filteredTenantPlaceholders,
        categories,
      );

      newAssignedData.assignments.push(assignment);
    });

    /**
     * If there are more tenants than categories, assign the remaining tenants to no categories with no tasks.
     * Also, increase the extra assigned count for each tenant.
     *
     * The object structure for the assigned category should be:
     * if Categories < Tenants:
     * {
     *   category: null,
     *   tenantPlaceholderId: number,
     *   tenant: { id: string, name: string },
     *   tasks: null,
     * }
     */
    this.assignRemainingTenants(
      categories.length,
      filteredTenantPlaceholders,
      nextHeadPlaceholderIndex,
      newAssignedData,
    );

    return newAssignedData;
  };

  /**
   * Return the tenant placeholder index from which the array is rotated
   *
   * @example
   * [0, 1, 2, 3, 4] -> The rotation start index is 0
   * [1, 2, 3, 4, 0] -> The rotation start index is 4
   * [2, 3, 4, 1] -> The head index = 3
   * [1, 2, 3] -> The head index = 0
   * [2, 3, 1] -> The head index = 2
   * [3, 4, 5] -> The head index = 0
   */
  private getTenantPlaceholderRotationStartIndex = (): number | null => {
    const assignments = this.assignedData.assignments.map(
      (category) => category.tenantPlaceholderId,
    );

    return assignments.indexOf(0) ?? null;
  };

  /**
   * Find the new placeholder index after right rotation
   *
   * @param currentTenantPlaceholderHeadIndex - The index from which the array is rotated
   * @param tenantPlaceholdersLength - The length of the tenant placeholders array
   * @example
   * currentTenantPlaceholderHeadIndex = 1
   * tenantPlaceholdersLength = 5
   *
   * Before: [0, 1, 2, 3, 4]
   * After:  [4, 0, 1, 2, 3]
   *
   * Return the new placeholder head index, which is 1.
   */
  protected calculateNextTenantPlaceholderHeadIndex = (
    currentTenantPlaceholderHeadIndex: number | null,
    tenantPlaceholdersLength: number,
  ): number => {
    /**
     * If the array length is 0, thrown an error
     */
    if (tenantPlaceholdersLength === 0) {
      throw new Error('Tenant placeholders length is 0');
    }

    /**
     * If the current rotation start index is null, return the first index
     */
    if (currentTenantPlaceholderHeadIndex === null) {
      return 0;
    }

    /**
     * Calculate the new placeholder index after rotation
     */
    return (currentTenantPlaceholderHeadIndex + 1) % tenantPlaceholdersLength;
  };

  /**
   * Return the next tenant placeholder index responsible for the given category after rotation
   *
   * @param categoryIndex - The index of the category
   * @param rotationStartIndex - The index from which the array is rotated
   * @param categoriesLength - The length of the tenant placeholders array
   *
   * @example
   * categoryIndex = 1
   * rotationStartIndex = 1
   * categoriesLength = 5
   *
   * This means that the array is rotated to the right by 1.
   * The category index is 1.
   * The length of the array is 5.
   *
   * Before: [0, 1, 2, 3, 4]
   * After:  [4, 0, 1, 2, 3]
   *
   * Return the new tenant placeholder index, which is 0.
   */
  private calculateNextPlaceholderIndexIndex = (
    categoryIndex: number,
    rotationStartIndex: number,
    categoriesLength: number,
  ): number => {
    /**
     * If the array length is 0, thrown an error
     */
    if (categoriesLength === 0) {
      throw new Error('Categories length is 0');
    }

    /**
     * Check if the category index is out of bounds
     */
    if (categoryIndex < 0) {
      throw new Error('Category index is out of bounds');
    }

    /**
     * Calculate and return the tenant placeholder index responsible for the given category after rotation
     */
    return (
      (categoryIndex + categoriesLength - rotationStartIndex) % categoriesLength
    );
  };

  /**
   * Helper function to get the tenant placeholder by index
   *
   * @param tenantPlaceholders - The tenant placeholders array
   * @param index - The index of the tenant placeholder
   * @returns The tenant placeholder object or null if not found
   */
  private getTenantPlaceholderByIndex = (
    tenantPlaceholders: TPrismaTenantPlaceholder[],
    index: number,
  ): TPrismaTenantPlaceholder | null => {
    /**
     * Find the tenant placeholder with the given index
     */
    const tp = tenantPlaceholders.find(
      (placeholder) => placeholder.index === index,
    );

    return tp ?? null;
  };

  /**
   * Helper function to get the tenant with the least number of extra assignments
   *
   * @returns The tenant with the least number of extra assignments
   */
  private getTenantWithFewAssignments = (
    tenantPlaceholders: TPrismaTenantPlaceholder[],
  ) => {
    /**
     * Throw an error if there are no tenant placeholders or tenants found
     */
    if (
      tenantPlaceholders.length < 1 ||
      tenantPlaceholders.filter((tp) => tp.tenant).length < 1
    ) {
      throw new Error('No tenant placeholders or tenants found');
    }

    /**
     * Get the tenants from the tenant placeholders
     */
    const tenants = tenantPlaceholders
      .map((tp) => tp.tenant)
      .filter((tenant) => tenant !== null);

    /**
     * Throw an error if there are no tenants found
     */
    if (tenants.length < 1) {
      throw new Error('No tenants found');
    }

    /**
     * Find the tenant with the least number of extra assignments
     */
    tenants.sort((a, b) => a.extraAssignedCount - b.extraAssignedCount);
    const tenant = tenants[0];

    /**
     * Increase the extra assigned count for the tenant
     */
    tenant.extraAssignedCount++;

    return tenant;
  };

  /**
   * Assign categories to placeholders without tenants
   *
   * @param categories - The categories with tasks to assign
   * @param nextHeadPlaceholderIndex - The next head index of the tenant placeholders
   * @returns The assigned data without tenants
   */
  private assignWithoutTenants = (
    categories: TPrismaCategory[],
    nextHeadPlaceholderIndex: number,
  ): IAssignedData => {
    const newAssignedData: IAssignedData = { assignments: [] };
    categories.forEach((category, i) => {
      const assignedCategory: ICategoryWithoutSingleTenant = {
        category: { id: category.id, name: category.name },
        tenantPlaceholderId: this.calculateNextPlaceholderIndexIndex(
          i,
          nextHeadPlaceholderIndex,
          categories.length,
        ),
        tenant: null,
        tasks: null,
      };
      newAssignedData.assignments.push(assignedCategory);
    });
    return newAssignedData;
  };

  /**
   * Assign a category to the appropriate tenant or placeholder
   *
   * @param category - The category to assign
   * @param index - The index of the category
   * @param nextHeadPlaceholderIndex - The next head index of the tenant placeholders
   * @param tenantPlaceholders - The tenant placeholders array
   * @param categories - The categories array
   * @returns The assigned category
   */
  private assignCategory = (
    category: TPrismaCategory,
    index: number,
    nextHeadPlaceholderIndex: number,
    tenantPlaceholders: TPrismaTenantPlaceholder[],
    categories: TPrismaCategory[],
  ): TAssignedCategory => {
    /**
     * Calculate the placeholder index for the tenant
     */
    const calculatedPlaceholderIndex = this.calculateNextPlaceholderIndexIndex(
      index,
      nextHeadPlaceholderIndex,
      Math.max(categories.length, tenantPlaceholders.length),
    );

    /**
     * Get the target placeholder for the category
     */
    const targetPlaceholder = this.getTenantPlaceholderByIndex(
      tenantPlaceholders,
      calculatedPlaceholderIndex,
    );

    /**
     * If the index is greater than the length of the tenant placeholders array,
     * assign the category to the tenant with the least number of extra assignments
     *
     * The object structure for the assigned category should be:
     * if Categories > Tenants:
     * {
     *   category: { id: string, name: string },
     *   tenantPlaceholderId: null,
     *   tenant: { id: string, name: string },
     *   tasks: [{ id: string, title: string, description: string, isCompleted: boolean }]
     * }
     */
    if (!targetPlaceholder || !targetPlaceholder.tenant) {
      return this.assignCategoryToTenantWithFewestAssignments(
        category,
        tenantPlaceholders,
      );
    }

    /**
     * Assign the category to the found tenant
     *
     * The object structure for the assigned category should be:
     * if Categories = Tenants:
     * {
     *   category: { id: string, name: string },
     *   tenantPlaceholderId: number,
     *   tenant: { id: string, name: string },
     *   tasks: [{ id: string, title: string, description: string, isCompleted: boolean }]
     * }
     */
    return this.createAssignedCategory(category, targetPlaceholder);
  };

  /**
   * Assign a category to the tenant with the least number of extra assignments
   *
   * The object structure for the assigned category should be:
   * if Categories > Tenants:
   * {
   *   category: { id: string, name: string },
   *   tenantPlaceholderId: number | null,
   *   tenant: { id: string, name: string },
   *   tasks: [{ id: string, title: string, description: string, isCompleted: boolean }]
   * }
   *
   * @param category - The category to assign
   * @param tenantPlaceholders - The tenant placeholders array
   * @returns The assigned category with the tenant
   */
  private assignCategoryToTenantWithFewestAssignments(
    category: TPrismaCategory,
    tenantPlaceholders: TPrismaTenantPlaceholder[],
  ): ICategoriesGreaterThanTenants {
    /**
     * Get the tenant with the least number of extra assignments
     */
    const assignedTenant = this.getTenantWithFewAssignments(tenantPlaceholders);

    return {
      category: { id: category.id, name: category.name },
      tenantPlaceholderId: null,
      tenant: { id: assignedTenant.id, name: assignedTenant.name },
      tasks: category.tasks.map((task) => this.convertTaskToAssignedTask(task)),
    };
  }

  /**
   * Create an assigned category with the found placeholder
   *
   * The object structure for the assigned category should be:
   * if Categories = Tenants:
   * {
   *   category: { id: string, name: string },
   *   tenantPlaceholderId: number,
   *   tenant: { id: string, name: string },
   *   tasks: [{ id: string, title: string, description: string, isCompleted: boolean }]
   * }
   *
   * @param category - The category to assign
   * @param targetPlaceholder - The found tenant placeholder
   * @returns The assigned category with the tenant placeholder
   */
  private createAssignedCategory = (
    category: TPrismaCategory,
    targetPlaceholder: TPrismaTenantPlaceholder,
  ): ICategoriesEqualTenants => ({
    category: { id: category.id, name: category.name },
    tenantPlaceholderId: targetPlaceholder.index,
    tenant: {
      id: targetPlaceholder.tenant!.id,
      name: targetPlaceholder.tenant!.name,
    },
    tasks: category.tasks.map((task) => this.convertTaskToAssignedTask(task)),
  });

  /**
   * Assign remaining tenants to no categories with no tasks
   *
   * The object structure for the assigned category should be:
   * if Categories < Tenants:
   * {
   *   category: null,
   *   tenantPlaceholderId: number,
   *   tenant: { id: string, name: string },
   *   tasks: null,
   * }
   *
   * @param categoryCount - The count of categories
   * @param tenantPlaceholders - The tenant placeholders array
   * @param nextHeadPlaceholderIndex - The next head index of the tenant placeholders
   * @param newAssignedData - The new assigned data
   */
  private assignRemainingTenants = (
    categoryCount: number,
    tenantPlaceholders: TPrismaTenantPlaceholder[],
    nextHeadPlaceholderIndex: number,
    newAssignedData: IAssignedData,
  ) => {
    const tenantPlaceholdersLength = tenantPlaceholders.length;

    for (let i = categoryCount; i < tenantPlaceholdersLength; i++) {
      /**
       * Calculate the placeholder index for the tenant
       */
      const calculatedPlaceholderIndex =
        this.calculateNextPlaceholderIndexIndex(
          i,
          nextHeadPlaceholderIndex,
          tenantPlaceholdersLength,
        );

      /**
       * Get the target placeholder for the tenant
       */
      const targetPlaceholder = this.getTenantPlaceholderByIndex(
        tenantPlaceholders,
        calculatedPlaceholderIndex,
      );

      /**
       * If the tenant is not found, skip the iteration
       *
       * We don't need to include about tenant placeholders without tenants in the new assigned data
       * because we already assigned categories to tenants in the previous iterations.
       */
      if (!targetPlaceholder || !targetPlaceholder.tenant) continue;

      newAssignedData.assignments.push({
        category: null,
        tenantPlaceholderId: targetPlaceholder.index,
        tenant: {
          id: targetPlaceholder.tenant.id,
          name: targetPlaceholder.tenant.name,
        },
        tasks: null,
      });
    }
  };

  /**
   * Map a task to an assigned task
   *
   * @param task - The task to map
   * @returns The assigned task
   */
  private convertTaskToAssignedTask = (task: TPrismaTask): IAssignedTask => ({
    id: task.id,
    title: task.title,
    description: task.description,
    isCompleted: false,
  });
}
