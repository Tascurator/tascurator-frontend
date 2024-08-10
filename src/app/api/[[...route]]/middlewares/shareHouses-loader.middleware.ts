import { createMiddleware } from 'hono/factory';
import prisma from '@/lib/prisma';
import { THonoEnv } from '@/app/api/[[...route]]/route';
import { TSanitizedPrismaShareHouse } from '@/types/server';

/**
 * Finds an object in an array by the 'id' key.
 *
 * @template T - The type of the objects in the array. Must extend `Record<string, unknown>`.
 * @param array - The array of objects to search through.
 * @param id - The value of the 'id' key to search for.
 * @returns {T | null} - The object that matches the search criteria, or `null` if not found.
 *
 * @example
 * const users = [
 *   { id: '1', name: 'Alice' },
 *   { id: '2', name: 'Bob' },
 *   { id: '3', name: 'Charlie' },
 * ];
 *
 * const user = findById(users, '2'); // Returns { id: '2', name: 'Bob' }
 * const nonExistentUser = findById(users, '4'); // Returns null
 */
const findById = <T extends Record<string, unknown>>(
  array: T[],
  id: string,
): T | null => array.find((item) => item['id'] === id) ?? null;

/**
 * Middleware that loads all share houses that the logged-in landlord owns.
 */
export const shareHousesLoaderMiddleware = createMiddleware<THonoEnv>(
  async (c, next) => {
    const landlordId = c.get('session').user.id;

    /**
     * Retrieve all share houses that the landlord owns
     */
    const sharehouses = await prisma.shareHouse.findMany({
      where: { landlordId },
      include: {
        assignmentSheet: true,
        RotationAssignment: {
          select: {
            rotationCycle: true,
            categories: {
              include: {
                tasks: {
                  orderBy: [{ createdAt: 'asc' }, { id: 'asc' }],
                },
              },
              orderBy: [{ createdAt: 'asc' }, { id: 'asc' }],
            },
            tenantPlaceholders: {
              include: {
                tenant: true,
              },
              orderBy: {
                index: 'asc',
              },
            },
          },
        },
      },
    });

    /**
     * Create a sanitized version of the share houses
     */
    const sanitizedSharehouses: TSanitizedPrismaShareHouse[] = sharehouses
      .map(({ id, name, createdAt, assignmentSheet, RotationAssignment }) => {
        /**
         * Check if the share house, RotationAssignment or AssignmentSheet is not found
         */
        if (!RotationAssignment) return null;

        return {
          id,
          name,
          createdAt,
          assignmentSheet,
          RotationAssignment,
        };
      })
      .filter((sharehouse) => sharehouse !== null);

    /**
     * Set the share houses in the context
     */
    c.set('sharehouses', sanitizedSharehouses);

    const getRotationAssignmentBySharehouseId = (sharehouseId: string) =>
      findById(sanitizedSharehouses, sharehouseId)?.RotationAssignment ?? null;

    const getAssignmentSheetBySharehouseId = (sharehouseId: string) =>
      findById(sanitizedSharehouses, sharehouseId)?.assignmentSheet ?? null;

    const getCategoriesBySharehouseId = (sharehouseId: string) =>
      findById(sanitizedSharehouses, sharehouseId)?.RotationAssignment
        .categories ?? [];

    const getTasksByCategoryId = (categoryId: string) => {
      for (const sharehouse of sanitizedSharehouses) {
        for (const category of sharehouse.RotationAssignment.categories) {
          if (category.id === categoryId) return category.tasks;
        }
      }
      return [];
    };

    const getTenantsBySharehouseId = (sharehouseId: string) => {
      const sharehouse = findById(sanitizedSharehouses, sharehouseId);
      return sharehouse?.RotationAssignment.tenantPlaceholders ?? [];
    };

    const getSharehouseById = (id: string) =>
      findById(sanitizedSharehouses, id);

    const getCategoryById = (id: string) => {
      for (const sharehouse of sanitizedSharehouses) {
        const category = findById(sharehouse.RotationAssignment.categories, id);
        if (category) return category;
      }
      return null;
    };

    const getTaskById = (id: string) => {
      for (const sharehouse of sanitizedSharehouses) {
        for (const category of sharehouse.RotationAssignment.categories) {
          const task = findById(category.tasks, id);
          if (task) return task;
        }
      }
      return null;
    };

    const getTenantById = (id: string) => {
      for (const sharehouse of sanitizedSharehouses) {
        for (const tenantPlaceholder of sharehouse.RotationAssignment
          .tenantPlaceholders) {
          if (tenantPlaceholder.tenant?.id === id) {
            return tenantPlaceholder.tenant;
          }
        }
      }
      return null;
    };

    /**
     * Set the helper functions in the context
     */
    c.set(
      'getRotationAssignmentBySharehouseId',
      getRotationAssignmentBySharehouseId,
    );
    c.set('getAssignmentSheetBySharehouseId', getAssignmentSheetBySharehouseId);
    c.set('getCategoriesBySharehouseId', getCategoriesBySharehouseId);
    c.set('getTasksByCategoryId', getTasksByCategoryId);
    c.set('getTenantsBySharehouseId', getTenantsBySharehouseId);
    c.set('getSharehouseById', getSharehouseById);
    c.set('getCategoryById', getCategoryById);
    c.set('getTaskById', getTaskById);
    c.set('getTenantById', getTenantById);

    await next();
  },
);
