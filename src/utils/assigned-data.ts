import { PrismaClient } from '@prisma/client';

interface ITenant {
  id: string;
  name: string;
}

interface IAssignedTask {
  id: string;
  name: string;
  description: string;
  isCompleted: boolean;
}

interface IAssignedCategory {
  category: { id: string; name: string } | null;
  tenantPlaceholderId: number | null;
  tenant: ITenant | null;
  tasks: IAssignedTask[] | null;
}

export interface IAssignedData {
  assignments: IAssignedCategory[];
}

/**
 * Generate assigned data based on the rotation assignment and tenant placeholders
 *
 * if Categories === Tenants
 *   Assign each category to a tenant
 * else if Categories < Tenants
 *   Assign each category to a tenant
 *   Assign the remaining tenants to no categories with no tasks
 * else if Categories > Tenants
 *   Assign each category to a tenant
 *   Assign the remaining categories to a tenant with the least number of extra assignments
 *
 * @param prisma - The Prisma client
 * @param rotationAssignmentId - The ID of the rotation assignment
 * @returns The assigned data object
 */
export const generateAssignedData = async (
  prisma: PrismaClient,
  rotationAssignmentId: string,
): Promise<IAssignedData> => {
  /**
   * Retrieve rotation assignment with categories and their tasks
   */
  const rotationAssignmentWithCategories =
    await prisma.rotationAssignment.findUnique({
      where: { id: rotationAssignmentId },
      include: {
        categories: {
          include: { tasks: true },
        },
      },
    });

  /**
   * Retrieve tenant placeholders related to the rotation assignment
   */
  const tenantPlaceholders = await prisma.tenantPlaceholder.findMany({
    where: { rotationAssignmentId },
    include: { tenant: true },
  });

  /**
   * Check if rotation assignment or tenant placeholders are missing (should not happen)
   */
  if (!rotationAssignmentWithCategories || tenantPlaceholders.length === 0) {
    console.error('Rotation assignment or tenant placeholders not found');
    return { assignments: [] };
  }

  /**
   * Initialize the head placeholder index to 0
   *
   * TODO: Implement an algorithm to dynamically set the head of the tenant placeholders based on the last rotation's assigned data
   */
  let headPlaceholderIndex = 0;

  /**
   * Initialize the assigned data object with an empty assignments array
   */
  const assignedData: IAssignedData = { assignments: [] };

  /**
   * Helper function to get the tenant placeholder by index
   *
   * @param index - The index of the tenant placeholder
   * @returns The tenant placeholder object or null if not found
   */
  const getTenantPlaceholderByIndex = (index: number) => {
    return (
      tenantPlaceholders.find((placeholder) => placeholder.index === index) ||
      null
    );
  };

  /**
   * Helper function to get the tenant with the least number of extra assignments
   *
   * @returns The tenant with the least number of extra assignments
   */
  const getTenantWithLeastAssignments = () => {
    return tenantPlaceholders
      .filter((tp) => tp.tenant)
      .sort(
        (a, b) => a.tenant!.extraAssignedCount - b.tenant!.extraAssignedCount,
      )[0].tenant;
  };

  /**
   * Iterate through each category and assign a tenant and tasks to it
   *
   * TODO: Implement an algorithm to rotate the tenants based on the last rotation's assigned data
   */
  for (const category of rotationAssignmentWithCategories.categories) {
    /**
     * Retrieve the tenant placeholder by index
     */
    const foundPlaceholder = getTenantPlaceholderByIndex(headPlaceholderIndex);
    /**
     * Retrieve the tenant from the tenant placeholder
     * or
     * retrieve the tenant with the least number of extra assignments if the tenant placeholder is not found
     */
    const tenant = foundPlaceholder?.tenant ?? getTenantWithLeastAssignments();

    /**
     * Assign the category to the tenant with the tenant placeholder index
     *
     * The object structure for the assigned category should be:
     * if Categories === Tenants:
     * {
     *   category: { id: string, name: string },
     *   tenantPlaceholderId: number,
     *   tenant: { id: string, name: string },
     *   tasks: [{ id: string, name: string, description: string, isCompleted: boolean }, ...],
     * }
     *
     * if Categories < Tenants:
     * {
     *   category: { id: string, name: string },
     *   tenantPlaceholderId: null,
     *   tenant: { id: string, name: string },
     *   tasks: [{ id: string, name: string, description: string, isCompleted: boolean }, ...],
     * }
     */
    const assignedCategory: IAssignedCategory = {
      category: { id: category.id, name: category.name },
      tenantPlaceholderId: foundPlaceholder?.tenant
        ? foundPlaceholder?.index ?? null
        : null,
      tenant: tenant ? { id: tenant.id, name: tenant.name } : null,
      tasks: category.tasks.map((task) => ({
        id: task.id,
        name: task.title,
        description: task.description,
        isCompleted: Boolean(Math.round(Math.random())), // 1/2 chance of being completed
      })),
    };

    /**
     * Add the assigned category to the assignments array
     */
    assignedData.assignments.push(assignedCategory);

    /**
     * Increase the head placeholder index
     */
    if (headPlaceholderIndex === tenantPlaceholders.length - 1) {
      headPlaceholderIndex = 0;
    } else headPlaceholderIndex++;
  }

  /**
   * If there are more tenants than categories, assign the remaining tenants to no categories with no tasks.
   * Also, increase the extra assigned count for each tenant.
   *
   * The object structure for the extra tenants should be:
   * {
   *   category: null,
   *   tenantPlaceholderId: null,
   *   tenant: { id: string, name: string },
   *   tasks: null,
   * }
   */
  if (assignedData.assignments.length < tenantPlaceholders.length) {
    const assignedTenants = assignedData.assignments.map(
      (assignment) => assignment.tenant?.id,
    );
    const extraTenants = tenantPlaceholders
      .filter(
        (placeholder) => !assignedTenants.includes(placeholder.tenant?.id),
      )
      .map((placeholder) => ({
        category: null,
        tenantPlaceholderId: placeholder.index,
        tenant: placeholder.tenant
          ? { id: placeholder.tenant.id, name: placeholder.tenant.name }
          : null,
        tasks: null,
      }));

    /**
     * Increase the extra assigned count for each tenant
     */
    for (const extraCategory of extraTenants) {
      await prisma.tenant.update({
        where: { id: extraCategory.tenant?.id },
        data: {
          extraAssignedCount: {
            increment: 1,
          },
        },
      });
    }

    /**
     * Add the extra tenants to the assignments array
     */
    assignedData.assignments.push(...extraTenants);
  }

  return assignedData;
};
