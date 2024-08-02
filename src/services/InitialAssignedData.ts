import { addDays } from '@/utils/dates';
import { AssignedData } from '@/services/AssignedData';
import { TPrismaShareHouse } from '@/types/server';
import { RotationCycle } from '@/types/commons';
import { SERVER_ERROR_MESSAGES } from '@/constants/server-error-messages';

/**
 * Represents the initial assigned data for a share house, extending the AssignedData class.
 * Automatically generates the initial assigned data for the first rotation cycle once instantiated.
 */
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
      throw new Error(
        SERVER_ERROR_MESSAGES.NOT_FOUND('share house or rotation assignment'),
      );
    }

    /**
     * Check if there is at least 1 category with at least 1 task and 1 tenant
     */
    if (
      this.sharehouse.RotationAssignment.categories.length < 1 ||
      this.sharehouse.RotationAssignment.categories[0].tasks.length < 1
    ) {
      throw new Error('No categories, tasks found in the rotation assignment');
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

  /**
   * Randomly toggles some tasks in the current assigned data for each tenant.
   *
   * @note This is intended to use in seed data generation for mock data.
   */
  public toggleTasksRandomly() {
    const assignedData = this.getAssignedData();

    for (const assignment of assignedData.assignments) {
      if (!assignment.tasks) continue;

      for (const task of assignment.tasks) {
        if (Math.random() > 0.5) {
          this.toggleTaskCompletion(assignment.tenant.id, task.id, true);
        }
      }
    }
  }
}
