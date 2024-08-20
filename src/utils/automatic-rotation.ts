import prisma from '@/lib/prisma';
import { convertToPDT, getToday } from '@/utils/dates';
import { AssignedData } from '@/services/AssignedData';
import { TSanitizedPrismaShareHouse } from '@/types/server';
import { Prisma } from '@prisma/client';

/**
 * Automatically rotate the assignments for the share houses.
 * This checks if the current date is after the end date of the assignment sheet.
 * If it is, it generates the next rotation based on the rotation cycle.
 *
 * This also ensures the gap between the end date of the assignment sheet and the current date is filled with the next rotations,
 * meaning if the rotation cycle is 7 days and the end date of the assignment sheet is 2022-12-31,
 * and the current date is 2023-01-10, it will generate the next rotation for 2023-01-07 (generates 2 rotations).
 *
 * @param sharehouses - The share houses to rotate
 */
export const automaticRotation = async (
  sharehouses: TSanitizedPrismaShareHouse | TSanitizedPrismaShareHouse[],
) => {
  for (const sharehouse of ([] as TSanitizedPrismaShareHouse[]).concat(
    sharehouses,
  )) {
    const today = getToday();
    const endDate = convertToPDT(sharehouse.assignmentSheet.endDate).toDate();

    /**
     * Check if it's time to rotate the assignments.
     * If the current date is before the end date of the assignment sheet, skip the rotation.
     */
    if (today < endDate) continue;

    const { categories, tenantPlaceholders, rotationCycle } =
      sharehouse.RotationAssignment;

    await prisma.$transaction(async (prisma) => {
      /**
       * Calculate how many rotations are needed to be done by comparing today's date with the end date of the assignment sheet
       */
      let rotationsNeeded = 0;

      while (today >= endDate) {
        endDate.setDate(endDate.getDate() + rotationCycle);
        rotationsNeeded++;
      }

      /**
       * Populate the AssignedData object with the current AssignedData, start date and end date
       */
      let assignedData = new AssignedData(
        sharehouse.assignmentSheet.assignedData,
        sharehouse.assignmentSheet.startDate,
        sharehouse.assignmentSheet.endDate,
      );

      /**
       * Loop through each rotation needed and generate the next rotation
       */
      for (let i = 0; i < rotationsNeeded; i++) {
        /**
         * Generate next rotation's AssignedData based on the current categories, tenant placeholders and rotation cycle
         */
        assignedData = assignedData.createNextRotation(
          categories,
          tenantPlaceholders,
          rotationCycle,
        );
      }

      /**
       * Update the assignment sheet with the new AssignedData
       */
      await prisma.assignmentSheet.update({
        where: { id: sharehouse.assignmentSheet.id },
        data: {
          startDate: assignedData.getStartDate(),
          endDate: assignedData.getEndDate(),
          assignedData:
            assignedData.getAssignedData() as unknown as Prisma.JsonArray,
        },
      });

      /**
       * Apply the new assignment sheet data to the share house
       */
      sharehouse.assignmentSheet.startDate = assignedData.getStartDate();
      sharehouse.assignmentSheet.endDate = assignedData.getEndDate();
      sharehouse.assignmentSheet.assignedData = assignedData.getAssignedData();

      /**
       * Update each tenant with the extra assigned count.
       * Also, (automatically) apply the updated extra assigned count to the tenant placeholders in the share house.
       */
      for (const tenantPlaceholder of tenantPlaceholders) {
        const { tenant, tenantId } = tenantPlaceholder;

        if (!tenant || !tenantId) continue;

        await prisma.tenant.update({
          where: { id: tenantId },
          data: {
            extraAssignedCount: tenant.extraAssignedCount,
          },
        });
      }
    });
  }
};
