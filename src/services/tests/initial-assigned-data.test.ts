import { beforeEach, describe, expect, it } from 'vitest';
import { RotationCycle } from '@/types/commons';
import { InitialAssignedData } from '@/services/InitialAssignedData';
import { IAssignedData, TShareHouseAssignmentData } from '@/types/server';
import { addDays } from '@/utils/dates';

export const createSharehouse = (
  overrides: Partial<TShareHouseAssignmentData> = {},
): TShareHouseAssignmentData => ({
  assignmentSheet: {
    id: '1',
    startDate: new Date('2025-01-01T00:00:00Z'),
    endDate: new Date('2025-01-08T00:00:00Z'),
    assignedData: { assignments: [] },
  },
  RotationAssignment: {
    rotationCycle: 7,
    categories: [
      {
        id: '1',
        rotationAssignmentId: '1',
        name: 'Category 1',
        createdAt: new Date(),
        tasks: [
          {
            id: '1',
            title: 'Task 1',
            description: 'Description 1',
            categoryId: '1',
            createdAt: new Date(),
          },
        ],
      },
    ],
    tenantPlaceholders: [
      {
        rotationAssignmentId: '1',
        index: 0,
        tenantId: '1',
        tenant: {
          id: '1',
          name: 'Tenant 1',
          email: 'tests@test.com',
          extraAssignedCount: 0,
          createdAt: new Date(),
        },
      },
    ],
  },
  ...overrides,
});

describe('InitialAssignedData class', () => {
  let sharehouse: TShareHouseAssignmentData;
  let startDate: Date;
  const rotationCycle = RotationCycle.Weekly;

  beforeEach(() => {
    startDate = new Date('2025-01-01T00:00:00Z');
    sharehouse = createSharehouse();
  });

  const expectError = (fn: () => void, message: string) => {
    expect(fn).toThrowError(message);
  };

  const addCategory = (id: string, title: string, description: string) => {
    sharehouse.RotationAssignment!.categories.push({
      id,
      rotationAssignmentId: '1',
      name: `Category ${id}`,
      createdAt: new Date(),
      tasks: [
        {
          id,
          title,
          description,
          categoryId: id,
          createdAt: new Date(),
        },
      ],
    });
  };

  const addTenant = (id: string, name: string) => {
    sharehouse.RotationAssignment!.tenantPlaceholders.push({
      rotationAssignmentId: '1',
      index: sharehouse.RotationAssignment!.tenantPlaceholders.length,
      tenantId: id,
      tenant: {
        id,
        name,
        email: `${name.toLowerCase().replace(' ', '')}@test.com`,
        extraAssignedCount: 0,
        createdAt: new Date(),
      },
    });
  };

  it('should throw an error if sharehouse or rotation assignment is missing', () => {
    const invalidSharehouse = {} as TShareHouseAssignmentData;
    expectError(
      () =>
        new InitialAssignedData(invalidSharehouse, startDate, rotationCycle),
      'Share house or rotation assignment not found',
    );
  });

  it('should throw an error if trying to generate AssignedData without any categories', () => {
    sharehouse.RotationAssignment!.categories = [];
    expectError(
      () => new InitialAssignedData(sharehouse, startDate, rotationCycle),
      'No categories, tasks or tenants found in the rotation assignment',
    );
  });

  it('should throw an error if trying to generate AssignedData with 1 category but no tasks', () => {
    sharehouse.RotationAssignment!.categories[0].tasks = [];
    expectError(
      () => new InitialAssignedData(sharehouse, startDate, rotationCycle),
      'No categories, tasks or tenants found in the rotation assignment',
    );
  });

  it('should throw an error if trying to generate AssignedData without any tenant', () => {
    sharehouse.RotationAssignment!.tenantPlaceholders = [];
    expectError(
      () => new InitialAssignedData(sharehouse, startDate, rotationCycle),
      'No categories, tasks or tenants found in the rotation assignment',
    );
  });

  it('should set the end date based on the rotation cycle', () => {
    const assignedData = new InitialAssignedData(
      sharehouse,
      startDate,
      rotationCycle,
    );
    expect(assignedData.getEndDate()).toEqual(addDays(startDate, 7));
  });

  const expectAssignedData = (
    actual: IAssignedData,
    expected: IAssignedData,
  ) => {
    expect(actual).toEqual(expected);
  };

  describe('Categories === Tenants', () => {
    it('should generate AssignedData with 1 category and 1 tenant', () => {
      const assignedData = new InitialAssignedData(
        sharehouse,
        startDate,
        rotationCycle,
      );

      const expectedData: IAssignedData = {
        assignments: [
          {
            category: {
              id: '1',
              name: 'Category 1',
            },
            tenantPlaceholderId: 0,
            tenant: {
              id: '1',
              name: 'Tenant 1',
            },
            tasks: [
              {
                id: '1',
                title: 'Task 1',
                description: 'Description 1',
                isCompleted: false,
              },
            ],
          },
        ],
      };

      expectAssignedData(assignedData.getAssignedData(), expectedData);
    });

    it('should generate AssignedData with 2 categories and 2 tenants', () => {
      addCategory('2', 'Task 2', 'Description 2');
      addTenant('2', 'Tenant 2');

      const assignedData = new InitialAssignedData(
        sharehouse,
        startDate,
        rotationCycle,
      );

      const expectedData: IAssignedData = {
        assignments: [
          {
            category: {
              id: '1',
              name: 'Category 1',
            },
            tenantPlaceholderId: 0,
            tenant: {
              id: '1',
              name: 'Tenant 1',
            },
            tasks: [
              {
                id: '1',
                title: 'Task 1',
                description: 'Description 1',
                isCompleted: false,
              },
            ],
          },
          {
            category: {
              id: '2',
              name: 'Category 2',
            },
            tenantPlaceholderId: 1,
            tenant: {
              id: '2',
              name: 'Tenant 2',
            },
            tasks: [
              {
                id: '2',
                title: 'Task 2',
                description: 'Description 2',
                isCompleted: false,
              },
            ],
          },
        ],
      };

      expectAssignedData(assignedData.getAssignedData(), expectedData);
    });

    it('should generate AssignedData with 3 categories and 3 tenants', () => {
      addCategory('2', 'Task 2', 'Description 2');
      addCategory('3', 'Task 3', 'Description 3');
      addTenant('2', 'Tenant 2');
      addTenant('3', 'Tenant 3');

      const assignedData = new InitialAssignedData(
        sharehouse,
        startDate,
        rotationCycle,
      );

      const expectedData: IAssignedData = {
        assignments: [
          {
            category: {
              id: '1',
              name: 'Category 1',
            },
            tenantPlaceholderId: 0,
            tenant: {
              id: '1',
              name: 'Tenant 1',
            },
            tasks: [
              {
                id: '1',
                title: 'Task 1',
                description: 'Description 1',
                isCompleted: false,
              },
            ],
          },
          {
            category: {
              id: '2',
              name: 'Category 2',
            },
            tenantPlaceholderId: 1,
            tenant: {
              id: '2',
              name: 'Tenant 2',
            },
            tasks: [
              {
                id: '2',
                title: 'Task 2',
                description: 'Description 2',
                isCompleted: false,
              },
            ],
          },
          {
            category: {
              id: '3',
              name: 'Category 3',
            },
            tenantPlaceholderId: 2,
            tenant: {
              id: '3',
              name: 'Tenant 3',
            },
            tasks: [
              {
                id: '3',
                title: 'Task 3',
                description: 'Description 3',
                isCompleted: false,
              },
            ],
          },
        ],
      };

      expectAssignedData(assignedData.getAssignedData(), expectedData);
    });
  });

  describe('Categories > Tenants', () => {
    it('should generate AssignedData with 2 categories and 1 tenant', () => {
      addCategory('2', 'Task 2', 'Description 2');

      const assignedData = new InitialAssignedData(
        sharehouse,
        startDate,
        rotationCycle,
      );

      const expectedData: IAssignedData = {
        assignments: [
          {
            category: {
              id: '1',
              name: 'Category 1',
            },
            tenantPlaceholderId: 0,
            tenant: {
              id: '1',
              name: 'Tenant 1',
            },
            tasks: [
              {
                id: '1',
                title: 'Task 1',
                description: 'Description 1',
                isCompleted: false,
              },
            ],
          },
          {
            category: {
              id: '2',
              name: 'Category 2',
            },
            tenantPlaceholderId: null,
            tenant: {
              id: '1',
              name: 'Tenant 1',
            },
            tasks: [
              {
                id: '2',
                title: 'Task 2',
                description: 'Description 2',
                isCompleted: false,
              },
            ],
          },
        ],
      };

      expectAssignedData(assignedData.getAssignedData(), expectedData);
    });

    it('should generate AssignedData with 3 categories and 1 tenant', () => {
      addCategory('2', 'Task 2', 'Description 2');
      addCategory('3', 'Task 3', 'Description 3');

      const assignedData = new InitialAssignedData(
        sharehouse,
        startDate,
        rotationCycle,
      );

      const expectedData: IAssignedData = {
        assignments: [
          {
            category: {
              id: '1',
              name: 'Category 1',
            },
            tenantPlaceholderId: 0,
            tenant: {
              id: '1',
              name: 'Tenant 1',
            },
            tasks: [
              {
                id: '1',
                title: 'Task 1',
                description: 'Description 1',
                isCompleted: false,
              },
            ],
          },
          {
            category: {
              id: '2',
              name: 'Category 2',
            },
            tenantPlaceholderId: null,
            tenant: {
              id: '1',
              name: 'Tenant 1',
            },
            tasks: [
              {
                id: '2',
                title: 'Task 2',
                description: 'Description 2',
                isCompleted: false,
              },
            ],
          },
          {
            category: {
              id: '3',
              name: 'Category 3',
            },
            tenantPlaceholderId: null,
            tenant: {
              id: '1',
              name: 'Tenant 1',
            },
            tasks: [
              {
                id: '3',
                title: 'Task 3',
                description: 'Description 3',
                isCompleted: false,
              },
            ],
          },
        ],
      };

      expectAssignedData(assignedData.getAssignedData(), expectedData);
    });

    it('should generate AssignedData with 4 categories and 2 tenants', () => {
      addCategory('2', 'Task 2', 'Description 2');
      addCategory('3', 'Task 3', 'Description 3');
      addCategory('4', 'Task 4', 'Description 4');
      addTenant('2', 'Tenant 2');

      const assignedData = new InitialAssignedData(
        sharehouse,
        startDate,
        rotationCycle,
      );

      const expectedData: IAssignedData = {
        assignments: [
          {
            category: {
              id: '1',
              name: 'Category 1',
            },
            tenantPlaceholderId: 0,
            tenant: {
              id: '1',
              name: 'Tenant 1',
            },
            tasks: [
              {
                id: '1',
                title: 'Task 1',
                description: 'Description 1',
                isCompleted: false,
              },
            ],
          },
          {
            category: {
              id: '2',
              name: 'Category 2',
            },
            tenantPlaceholderId: 1,
            tenant: {
              id: '2',
              name: 'Tenant 2',
            },
            tasks: [
              {
                id: '2',
                title: 'Task 2',
                description: 'Description 2',
                isCompleted: false,
              },
            ],
          },
          {
            category: {
              id: '3',
              name: 'Category 3',
            },
            tenantPlaceholderId: null,
            tenant: {
              id: '1',
              name: 'Tenant 1',
            },
            tasks: [
              {
                id: '3',
                title: 'Task 3',
                description: 'Description 3',
                isCompleted: false,
              },
            ],
          },
          {
            category: {
              id: '4',
              name: 'Category 4',
            },
            tenantPlaceholderId: null,
            tenant: {
              id: '2',
              name: 'Tenant 2',
            },
            tasks: [
              {
                id: '4',
                title: 'Task 4',
                description: 'Description 4',
                isCompleted: false,
              },
            ],
          },
        ],
      };

      expectAssignedData(assignedData.getAssignedData(), expectedData);
    });
  });

  describe('Categories < Tenants', () => {
    it('should generate AssignedData with 1 category and 2 tenants', () => {
      addTenant('2', 'Tenant 2');

      const assignedData = new InitialAssignedData(
        sharehouse,
        startDate,
        rotationCycle,
      );

      const expectedData: IAssignedData = {
        assignments: [
          {
            category: {
              id: '1',
              name: 'Category 1',
            },
            tenantPlaceholderId: 0,
            tenant: {
              id: '1',
              name: 'Tenant 1',
            },
            tasks: [
              {
                id: '1',
                title: 'Task 1',
                description: 'Description 1',
                isCompleted: false,
              },
            ],
          },
          {
            category: null,
            tenantPlaceholderId: 1,
            tenant: {
              id: '2',
              name: 'Tenant 2',
            },
            tasks: null,
          },
        ],
      };

      expectAssignedData(assignedData.getAssignedData(), expectedData);
    });

    it('should generate AssignedData with 1 category and 3 tenants', () => {
      addTenant('2', 'Tenant 2');
      addTenant('3', 'Tenant 3');

      const assignedData = new InitialAssignedData(
        sharehouse,
        startDate,
        rotationCycle,
      );

      const expectedData: IAssignedData = {
        assignments: [
          {
            category: {
              id: '1',
              name: 'Category 1',
            },
            tenantPlaceholderId: 0,
            tenant: {
              id: '1',
              name: 'Tenant 1',
            },
            tasks: [
              {
                id: '1',
                title: 'Task 1',
                description: 'Description 1',
                isCompleted: false,
              },
            ],
          },
          {
            category: null,
            tenantPlaceholderId: 1,
            tenant: {
              id: '2',
              name: 'Tenant 2',
            },
            tasks: null,
          },
          {
            category: null,
            tenantPlaceholderId: 2,
            tenant: {
              id: '3',
              name: 'Tenant 3',
            },
            tasks: null,
          },
        ],
      };

      expectAssignedData(assignedData.getAssignedData(), expectedData);
    });

    it('should generate AssignedData with 2 categories and 4 tenants', () => {
      addCategory('2', 'Task 2', 'Description 2');
      addTenant('2', 'Tenant 2');
      addTenant('3', 'Tenant 3');
      addTenant('4', 'Tenant 4');

      const assignedData = new InitialAssignedData(
        sharehouse,
        startDate,
        rotationCycle,
      );

      const expectedData: IAssignedData = {
        assignments: [
          {
            category: {
              id: '1',
              name: 'Category 1',
            },
            tenantPlaceholderId: 0,
            tenant: {
              id: '1',
              name: 'Tenant 1',
            },
            tasks: [
              {
                id: '1',
                title: 'Task 1',
                description: 'Description 1',
                isCompleted: false,
              },
            ],
          },
          {
            category: {
              id: '2',
              name: 'Category 2',
            },
            tenantPlaceholderId: 1,
            tenant: {
              id: '2',
              name: 'Tenant 2',
            },
            tasks: [
              {
                id: '2',
                title: 'Task 2',
                description: 'Description 2',
                isCompleted: false,
              },
            ],
          },
          {
            category: null,
            tenantPlaceholderId: 2,
            tenant: {
              id: '3',
              name: 'Tenant 3',
            },
            tasks: null,
          },
          {
            category: null,
            tenantPlaceholderId: 3,
            tenant: {
              id: '4',
              name: 'Tenant 4',
            },
            tasks: null,
          },
        ],
      };

      expectAssignedData(assignedData.getAssignedData(), expectedData);
    });
  });
});
