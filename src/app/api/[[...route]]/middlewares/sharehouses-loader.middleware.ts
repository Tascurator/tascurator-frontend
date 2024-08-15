import { createMiddleware } from 'hono/factory';
import prisma from '@/lib/prisma';
import { THonoEnv } from '@/types/hono-env';
import { IAssignedData, TSanitizedPrismaShareHouse } from '@/types/server';
import { SERVER_ERROR_MESSAGES } from '@/constants/server-error-messages';

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
export const sharehousesLoaderMiddleware = createMiddleware<THonoEnv>(
  async (c, next) => {
    const landlordId = c.get('session').user.id;

    /**
     * Retrieve all share houses that the landlord owns if they exist.
     */
    const doesLandlordExist = await prisma.landlord.findUnique({
      where: { id: landlordId },
      include: {
        shareHouses: {
          include: {
            assignmentSheet: true,
            RotationAssignment: {
              select: {
                id: true,
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
        },
      },
    });

    /**
     * Check if the landlord exists
     * It could be that the landlord was deleted from the database, but the session still exists in the client.
     */
    if (!doesLandlordExist) {
      return c.json({ error: SERVER_ERROR_MESSAGES.UNAUTHORIZED }, 401);
    }

    const { shareHouses } = doesLandlordExist;

    /**
     * Create a sanitized version of the share houses
     */
    const sanitizedSharehouses: TSanitizedPrismaShareHouse[] = shareHouses
      .map(({ id, name, createdAt, assignmentSheet, RotationAssignment }) => {
        /**
         * Check if the RotationAssignment is not found
         */
        if (!RotationAssignment) return null;

        return {
          id,
          name,
          createdAt,
          assignmentSheet: {
            ...assignmentSheet,
            assignedData:
              assignmentSheet.assignedData as unknown as IAssignedData,
          },
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
      return (
        sharehouse?.RotationAssignment.tenantPlaceholders
          .map((tenantPlaceholder) => tenantPlaceholder.tenant ?? null)
          .filter((tenant) => tenant !== null) ?? []
      );
    };

    const getSharehouseById = (id: string) =>
      findById(sanitizedSharehouses, id);

    const getCategoryById = (id: string) => {
      for (const sharehouse of sanitizedSharehouses) {
        const category = findById(sharehouse.RotationAssignment.categories, id);
        if (category) return { shareHouseId: sharehouse.id, category };
      }
      return null;
    };

    const getTaskById = (id: string) => {
      for (const sharehouse of sanitizedSharehouses) {
        for (const category of sharehouse.RotationAssignment.categories) {
          const task = findById(category.tasks, id);
          if (task)
            return {
              shareHouseId: sharehouse.id,
              categoryId: category.id,
              task,
            };
        }
      }
      return null;
    };

    const getTenantById = (id: string) => {
      for (const sharehouse of sanitizedSharehouses) {
        for (const tenantPlaceholder of sharehouse.RotationAssignment
          .tenantPlaceholders) {
          if (tenantPlaceholder.tenant?.id === id) {
            return {
              shareHouseId: sharehouse.id,
              tenant: tenantPlaceholder.tenant,
            };
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
