import { addDays } from '@/utils/dates';
import { AssignedData } from '@/services/AssignedData';
import { TPrismaShareHouse } from '@/types/server';
import { RotationCycle } from '@/types/commons';

export class InitialAssignedData extends AssignedData {
  private readonly sharehouse: TPrismaShareHouse;

  constructor(
    sharehouse: TPrismaShareHouse,
    startDate: Date,
    rotationCycle: RotationCycle,
  ) {
    super({ assignments: [] }, startDate, addDays(startDate, rotationCycle));

    this.sharehouse = sharehouse;

    this.generate();
  }

  private generate() {
    /**
     * Check if the share house or rotation assignment is missing (should not happen)
     */
    if (!this.sharehouse || !this.sharehouse.RotationAssignment) {
      throw new Error('Share house or rotation assignment not found');
    }

    /**
     * Check if there is at least 1 category with at least 1 task and 1 tenant
     */
    if (
      this.sharehouse.RotationAssignment.categories.length < 1 ||
      this.sharehouse.RotationAssignment.categories[0].tasks.length < 1 ||
      this.sharehouse.RotationAssignment.tenantPlaceholders.length < 1
    ) {
      throw new Error(
        'No categories, tasks or tenants found in the rotation assignment',
      );
    }

    const { categories, tenantPlaceholders } =
      this.sharehouse.RotationAssignment;

    /**
     * Generate the assigned data for the first rotation cycle
     */
    const assignedData = this.generateNextAssignedData(
      categories,
      tenantPlaceholders,
    );

    this.getAssignedData().assignments = assignedData.assignments;
  }
}
