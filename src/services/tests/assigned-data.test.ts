import { RotationCycle } from '@/types/commons';
import { InitialAssignedData } from '@/services/InitialAssignedData';
import { TPrismaShareHouse, IAssignedData } from '@/types/server';
import { beforeEach, describe, expect, it } from 'vitest';

describe('AssignedData class', () => {
  let sharehouse: TPrismaShareHouse;
  let initialAssignedData: InitialAssignedData;

  beforeEach(() => {
    sharehouse = {
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
            tasks: [
              {
                id: '1',
                title: 'Task 1',
                description: 'Description 1',
                categoryId: '1',
                createdAt: new Date().toISOString(),
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
              email: 'tenant1@test.com',
              extraAssignedCount: 0,
              createdAt: new Date().toISOString(),
            },
          },
        ],
      },
    };

    const startDate = new Date('2025-01-01T00:00:00Z');
    const rotationCycle = RotationCycle.Weekly;

    initialAssignedData = new InitialAssignedData(
      sharehouse,
      startDate,
      rotationCycle,
    );
  });

  it('should return the assigned data for the current rotation', () => {
    const assignedData = initialAssignedData.getAssignedData();
    expect(assignedData).toEqual(initialAssignedData.getAssignedData());
  });

  it('should return the start date of the rotation', () => {
    const startDate = initialAssignedData.getStartDate();
    expect(startDate).toEqual(initialAssignedData.getStartDate());
  });

  it('should return the end date of the rotation', () => {
    const endDate = initialAssignedData.getEndDate();
    expect(endDate).toEqual(initialAssignedData.getEndDate());
  });

  it('should return the assignments for the current rotation', () => {
    const assignments = initialAssignedData.getAssignments();
    expect(assignments).toEqual(
      initialAssignedData.getAssignedData().assignments,
    );
  });

  it('should calculate the number of extra assignments for each tenant', () => {
    const extraAssignments = initialAssignedData.calculateExtraAssignments();

    expect(extraAssignments).toEqual({
      tenants: [],
    });
  });

  it("should create the next rotation's AssignedData with the same ShareHouse data as initial", () => {
    const categories = sharehouse.RotationAssignment!.categories;
    const tenantPlaceholders =
      sharehouse.RotationAssignment!.tenantPlaceholders;
    const rotationCycle = sharehouse.RotationAssignment!.rotationCycle;

    const newAssignedDataInstance = initialAssignedData.createNextRotation(
      categories,
      tenantPlaceholders,
      rotationCycle,
    );

    /**
     * What we expect
     */
    const expectedData = {
      assignments: [
        {
          category: { id: '1', name: 'Category 1' },
          tenantPlaceholderId: 0,
          tenant: { id: '1', name: 'Tenant 1' },
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

    expect(newAssignedDataInstance.getAssignedData()).toEqual(expectedData);

    expect(newAssignedDataInstance.getStartDate()).toEqual(
      new Date('2025-01-08T00:00:00Z'),
    );
    expect(newAssignedDataInstance.getEndDate()).toEqual(
      new Date('2025-01-15T00:00:00Z'),
    );
  });

  describe("Next rotation's AssignedData creation with 2 categories = 2 tenants for the current rotation", () => {
    beforeEach(() => {
      sharehouse.RotationAssignment!.categories.push({
        id: '2',
        rotationAssignmentId: '1',
        name: 'Category 2',
        tasks: [
          {
            id: '2',
            title: 'Task 2',
            description: 'Description 2',
            categoryId: '2',
            createdAt: new Date().toISOString(),
          },
        ],
      });

      sharehouse.RotationAssignment!.tenantPlaceholders.push({
        rotationAssignmentId: '1',
        index: 1,
        tenantId: '2',
        tenant: {
          id: '2',
          name: 'Tenant 2',
          email: 'tenant_2@tascurator.com',
          extraAssignedCount: 0,
          createdAt: new Date().toISOString(),
        },
      });

      const startDate = new Date('2025-01-01T00:00:00Z');
      const rotationCycle = RotationCycle.Weekly;

      initialAssignedData = new InitialAssignedData(
        sharehouse,
        startDate,
        rotationCycle,
      );
    });

    it('should create with 2 categories = 2 tenants (same as current) (o, o)', () => {
      const categories = sharehouse.RotationAssignment!.categories;
      const tenantPlaceholders =
        sharehouse.RotationAssignment!.tenantPlaceholders;
      const rotationCycle = sharehouse.RotationAssignment!.rotationCycle;

      const currentData = initialAssignedData.getAssignedData();

      const expectedCurrentData = {
        assignments: [
          {
            category: { id: '1', name: 'Category 1' },
            tenantPlaceholderId: 0,
            tenant: { id: '1', name: 'Tenant 1' },
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
            category: { id: '2', name: 'Category 2' },
            tenantPlaceholderId: 1,
            tenant: { id: '2', name: 'Tenant 2' },
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

      const newAssignedDataInstance = initialAssignedData.createNextRotation(
        categories,
        tenantPlaceholders,
        rotationCycle,
      );

      /**
       * What we expect
       */
      const expectedData = {
        assignments: [
          {
            category: { id: '1', name: 'Category 1' },
            tenantPlaceholderId: 1,
            tenant: { id: '2', name: 'Tenant 2' },
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
            category: { id: '2', name: 'Category 2' },
            tenantPlaceholderId: 0,
            tenant: { id: '1', name: 'Tenant 1' },
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

      expect(currentData).toEqual(expectedCurrentData);
      expect(newAssignedDataInstance.getAssignedData()).toEqual(expectedData);

      expect(newAssignedDataInstance.getStartDate()).toEqual(
        new Date('2025-01-08T00:00:00Z'),
      );
      expect(newAssignedDataInstance.getEndDate()).toEqual(
        new Date('2025-01-15T00:00:00Z'),
      );
    });

    it('should create with 2 categories > 1 tenant (first tenant left) (x, o)', () => {
      sharehouse.RotationAssignment!.tenantPlaceholders[0].tenant = null;
      sharehouse.RotationAssignment!.tenantPlaceholders[0].tenantId = null;

      const categories = sharehouse.RotationAssignment!.categories;
      const tenantPlaceholders =
        sharehouse.RotationAssignment!.tenantPlaceholders;
      const rotationCycle = sharehouse.RotationAssignment!.rotationCycle;

      const newAssignedDataInstance = initialAssignedData.createNextRotation(
        categories,
        tenantPlaceholders,
        rotationCycle,
      );

      /**
       * What we expect
       */
      const expectedData = {
        assignments: [
          {
            category: { id: '1', name: 'Category 1' },
            tenantPlaceholderId: 1,
            tenant: { id: '2', name: 'Tenant 2' },
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
            category: { id: '2', name: 'Category 2' },
            tenantPlaceholderId: null,
            tenant: { id: '2', name: 'Tenant 2' },
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

      expect(newAssignedDataInstance.getAssignedData()).toEqual(expectedData);
    });

    it('should create with 2 categories > 1 tenant (second tenant left) (o, x)', () => {
      sharehouse.RotationAssignment!.tenantPlaceholders[1].tenant = null;

      const categories = sharehouse.RotationAssignment!.categories;
      const tenantPlaceholders =
        sharehouse.RotationAssignment!.tenantPlaceholders;
      const rotationCycle = sharehouse.RotationAssignment!.rotationCycle;

      const newAssignedDataInstance = initialAssignedData.createNextRotation(
        categories,
        tenantPlaceholders,
        rotationCycle,
      );

      /**
       * What we expect
       */
      const expectedData = {
        assignments: [
          {
            category: { id: '1', name: 'Category 1' },
            tenantPlaceholderId: null,
            tenant: { id: '1', name: 'Tenant 1' },
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
            category: { id: '2', name: 'Category 2' },
            tenantPlaceholderId: 0,
            tenant: { id: '1', name: 'Tenant 1' },
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

      expect(newAssignedDataInstance.getAssignedData()).toEqual(expectedData);
    });

    it('should create with 2 categories < 3 tenants (1 new tenant joined) (o, o, o)', () => {
      sharehouse.RotationAssignment!.tenantPlaceholders.push({
        rotationAssignmentId: '1',
        index: 2,
        tenantId: '3',
        tenant: {
          id: '3',
          name: 'Tenant 3',
          email: 'tenant_3@tascurator.com',
          extraAssignedCount: 0,
          createdAt: new Date().toISOString(),
        },
      });

      const categories = sharehouse.RotationAssignment!.categories;
      const tenantPlaceholders =
        sharehouse.RotationAssignment!.tenantPlaceholders;
      const rotationCycle = sharehouse.RotationAssignment!.rotationCycle;

      const newAssignedDataInstance = initialAssignedData.createNextRotation(
        categories,
        tenantPlaceholders,
        rotationCycle,
      );

      /**
       * What we expect
       */
      const expectedData: IAssignedData = {
        assignments: [
          {
            category: { id: '1', name: 'Category 1' },
            tenantPlaceholderId: 2,
            tenant: { id: '3', name: 'Tenant 3' },
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
            category: { id: '2', name: 'Category 2' },
            tenantPlaceholderId: 0,
            tenant: { id: '1', name: 'Tenant 1' },
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
            tenantPlaceholderId: 1,
            tenant: { id: '2', name: 'Tenant 2' },
            tasks: null,
          },
        ],
      };

      expect(newAssignedDataInstance.getAssignedData()).toEqual(expectedData);
    });

    it('should create with 2 categories = 2 tenants (1 tenant left, 1 new joined) (o, o)', () => {
      sharehouse.RotationAssignment!.tenantPlaceholders[0].tenant = null;
      sharehouse.RotationAssignment!.tenantPlaceholders[0].tenant = {
        id: '3',
        name: 'Tenant 3',
        email: 'tenant_3@tascurator.com',
        extraAssignedCount: 0,
      };

      const categories = sharehouse.RotationAssignment!.categories;
      const tenantPlaceholders =
        sharehouse.RotationAssignment!.tenantPlaceholders;
      const rotationCycle = sharehouse.RotationAssignment!.rotationCycle;

      const newAssignedDataInstance = initialAssignedData.createNextRotation(
        categories,
        tenantPlaceholders,
        rotationCycle,
      );

      /**
       * What we expect
       */
      const expectedData: IAssignedData = {
        assignments: [
          {
            category: { id: '1', name: 'Category 1' },
            tenantPlaceholderId: 1,
            tenant: { id: '2', name: 'Tenant 2' },
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
            category: { id: '2', name: 'Category 2' },
            tenantPlaceholderId: 0,
            tenant: { id: '3', name: 'Tenant 3' },
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

      expect(newAssignedDataInstance.getAssignedData()).toEqual(expectedData);
    });

    it('should create with 2 categories > 0 tenants (all tenants left) (x, x)', () => {
      sharehouse.RotationAssignment!.tenantPlaceholders[0].tenant = null;
      sharehouse.RotationAssignment!.tenantPlaceholders[1].tenant = null;

      const categories = sharehouse.RotationAssignment!.categories;
      const tenantPlaceholders =
        sharehouse.RotationAssignment!.tenantPlaceholders;
      const rotationCycle = sharehouse.RotationAssignment!.rotationCycle;

      const newAssignedDataInstance = initialAssignedData.createNextRotation(
        categories,
        tenantPlaceholders,
        rotationCycle,
      );

      /**
       * What we expect
       */
      const expectedData: IAssignedData = {
        assignments: [
          {
            category: { id: '1', name: 'Category 1' },
            tenantPlaceholderId: 1,
            tenant: null,
            tasks: null,
          },
          {
            category: { id: '2', name: 'Category 2' },
            tenantPlaceholderId: 0,
            tenant: null,
            tasks: null,
          },
        ],
      };

      expect(newAssignedDataInstance.getAssignedData()).toEqual(expectedData);
    });

    it('should create with 3 categories > 2 tenants (1 new category added) (o, o)', () => {
      sharehouse.RotationAssignment!.categories.push({
        id: '3',
        rotationAssignmentId: '1',
        name: 'Category 3',
        tasks: [
          {
            id: '3',
            title: 'Task 3',
            description: 'Description 3',
            categoryId: '3',
            createdAt: new Date().toISOString(),
          },
        ],
      });

      const categories = sharehouse.RotationAssignment!.categories;
      const tenantPlaceholders =
        sharehouse.RotationAssignment!.tenantPlaceholders;
      const rotationCycle = sharehouse.RotationAssignment!.rotationCycle;

      const newAssignedDataInstance = initialAssignedData.createNextRotation(
        categories,
        tenantPlaceholders,
        rotationCycle,
      );

      /**
       * What we expect
       */
      const expectedData: IAssignedData = {
        assignments: [
          {
            category: { id: '1', name: 'Category 1' },
            tenantPlaceholderId: null,
            tenant: { id: '1', name: 'Tenant 1' },
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
            category: { id: '2', name: 'Category 2' },
            tenantPlaceholderId: 0,
            tenant: { id: '1', name: 'Tenant 1' },
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
            category: { id: '3', name: 'Category 3' },
            tenantPlaceholderId: 1,
            tenant: { id: '2', name: 'Tenant 2' },
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

      expect(newAssignedDataInstance.getAssignedData()).toEqual(expectedData);
    });

    it('should create with 4 categories > 2 tenants (2 new categories added) (o, o)', () => {
      sharehouse.RotationAssignment!.categories.push({
        id: '3',
        rotationAssignmentId: '1',
        name: 'Category 3',
        tasks: [
          {
            id: '3',
            title: 'Task 3',
            description: 'Description 3',
            categoryId: '3',
            createdAt: new Date().toISOString(),
          },
        ],
      });

      sharehouse.RotationAssignment!.categories.push({
        id: '4',
        rotationAssignmentId: '1',
        name: 'Category 4',
        tasks: [
          {
            id: '4',
            title: 'Task 4',
            description: 'Description 4',
            categoryId: '4',
            createdAt: new Date().toISOString(),
          },
        ],
      });

      const categories = sharehouse.RotationAssignment!.categories;
      const tenantPlaceholders =
        sharehouse.RotationAssignment!.tenantPlaceholders;
      const rotationCycle = sharehouse.RotationAssignment!.rotationCycle;

      const newAssignedDataInstance = initialAssignedData.createNextRotation(
        categories,
        tenantPlaceholders,
        rotationCycle,
      );

      /**
       * What we expect
       */
      const expectedData: IAssignedData = {
        assignments: [
          {
            category: { id: '1', name: 'Category 1' },
            tenantPlaceholderId: null,
            tenant: { id: '1', name: 'Tenant 1' },
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
            category: { id: '2', name: 'Category 2' },
            tenantPlaceholderId: 0,
            tenant: { id: '1', name: 'Tenant 1' },
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
            category: { id: '3', name: 'Category 3' },
            tenantPlaceholderId: 1,
            tenant: { id: '2', name: 'Tenant 2' },
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
            category: { id: '4', name: 'Category 4' },
            tenantPlaceholderId: null,
            tenant: { id: '2', name: 'Tenant 2' },
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

      expect(newAssignedDataInstance.getAssignedData()).toEqual(expectedData);
    });

    it('should create with 1 category < 2 tenants (1 category deleted) (o, o)', () => {
      sharehouse.RotationAssignment!.categories.pop();

      const categories = sharehouse.RotationAssignment!.categories;
      const tenantPlaceholders =
        sharehouse.RotationAssignment!.tenantPlaceholders;
      const rotationCycle = sharehouse.RotationAssignment!.rotationCycle;

      const newAssignedDataInstance = initialAssignedData.createNextRotation(
        categories,
        tenantPlaceholders,
        rotationCycle,
      );

      /**
       * What we expect
       */
      const expectedData: IAssignedData = {
        assignments: [
          {
            category: { id: '1', name: 'Category 1' },
            tenantPlaceholderId: 1,
            tenant: { id: '2', name: 'Tenant 2' },
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
            tenantPlaceholderId: 0,
            tenant: { id: '1', name: 'Tenant 1' },
            tasks: null,
          },
        ],
      };

      expect(newAssignedDataInstance.getAssignedData()).toEqual(expectedData);
    });

    it('should create with 2 categories = 2 tenants (1 category deleted, 1 new category added) (o, o)', () => {
      sharehouse.RotationAssignment!.categories.pop();
      sharehouse.RotationAssignment!.categories.push({
        id: '3',
        rotationAssignmentId: '1',
        name: 'Category 3',
        tasks: [
          {
            id: '3',
            title: 'Task 3',
            description: 'Description 3',
            categoryId: '3',
            createdAt: new Date().toISOString(),
          },
        ],
      });

      const categories = sharehouse.RotationAssignment!.categories;
      const tenantPlaceholders =
        sharehouse.RotationAssignment!.tenantPlaceholders;
      const rotationCycle = sharehouse.RotationAssignment!.rotationCycle;

      const newAssignedDataInstance = initialAssignedData.createNextRotation(
        categories,
        tenantPlaceholders,
        rotationCycle,
      );

      /**
       * What we expect
       */
      const expectedData: IAssignedData = {
        assignments: [
          {
            category: { id: '1', name: 'Category 1' },
            tenantPlaceholderId: 1,
            tenant: { id: '2', name: 'Tenant 2' },
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
            category: { id: '3', name: 'Category 3' },
            tenantPlaceholderId: 0,
            tenant: { id: '1', name: 'Tenant 1' },
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

      expect(newAssignedDataInstance.getAssignedData()).toEqual(expectedData);
    });

    it('should create with 1 category < 3 tenants (1 category deleted, 1 new tenant joined) (o, o, o)', () => {
      sharehouse.RotationAssignment!.categories.pop();
      sharehouse.RotationAssignment!.tenantPlaceholders.push({
        rotationAssignmentId: '1',
        index: 2,
        tenantId: '3',
        tenant: {
          id: '3',
          name: 'Tenant 3',
          email: 'tenant_3@tascurator.com',
          extraAssignedCount: 0,
          createdAt: new Date().toISOString(),
        },
      });

      const categories = sharehouse.RotationAssignment!.categories;
      const tenantPlaceholders =
        sharehouse.RotationAssignment!.tenantPlaceholders;
      const rotationCycle = sharehouse.RotationAssignment!.rotationCycle;

      const newAssignedDataInstance = initialAssignedData.createNextRotation(
        categories,
        tenantPlaceholders,
        rotationCycle,
      );

      /**
       * What we expect
       */
      const expectedData: IAssignedData = {
        assignments: [
          {
            category: { id: '1', name: 'Category 1' },
            tenantPlaceholderId: 2,
            tenant: { id: '3', name: 'Tenant 3' },
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
            tenantPlaceholderId: 0,
            tenant: { id: '1', name: 'Tenant 1' },
            tasks: null,
          },
          {
            category: null,
            tenantPlaceholderId: 1,
            tenant: { id: '2', name: 'Tenant 2' },
            tasks: null,
          },
        ],
      };

      expect(newAssignedDataInstance.getAssignedData()).toEqual(expectedData);
    });

    it('should create with 2 categories = 2 tenants, but 4 TenantPlaceholders (x, o︎, o, x)', () => {
      sharehouse.RotationAssignment!.tenantPlaceholders[1].tenant = null;
      sharehouse.RotationAssignment!.tenantPlaceholders[1].tenantId = null;

      sharehouse.RotationAssignment!.tenantPlaceholders.push({
        rotationAssignmentId: '1',
        index: 2,
        tenantId: '3',
        tenant: {
          id: '3',
          name: 'Tenant 3',
          email: 'tenant_3@tascurator.com',
          extraAssignedCount: 0,
          createdAt: new Date().toISOString(),
        },
      });
      44;
      sharehouse.RotationAssignment!.tenantPlaceholders.push({
        rotationAssignmentId: '1',
        index: 3,
        tenantId: null,
        tenant: null,
      });

      const categories = sharehouse.RotationAssignment!.categories;
      const tenantPlaceholders =
        sharehouse.RotationAssignment!.tenantPlaceholders;
      const rotationCycle = sharehouse.RotationAssignment!.rotationCycle;

      const newAssignedDataInstance = initialAssignedData.createNextRotation(
        categories,
        tenantPlaceholders,
        rotationCycle,
      );

      /**
       * What we expect
       */
      const expectedData: IAssignedData = {
        assignments: [
          {
            category: { id: '1', name: 'Category 1' },
            tenantPlaceholderId: 2,
            tenant: { id: '3', name: 'Tenant 3' },
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
            category: { id: '2', name: 'Category 2' },
            tenantPlaceholderId: 0,
            tenant: { id: '1', name: 'Tenant 1' },
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

      expect(newAssignedDataInstance.getAssignedData()).toEqual(expectedData);
    });

    it('should throw an error if there are no categories (all categories deleted)', () => {
      sharehouse.RotationAssignment!.categories = [];

      const categories = sharehouse.RotationAssignment!.categories;
      const tenantPlaceholders =
        sharehouse.RotationAssignment!.tenantPlaceholders;
      const rotationCycle = sharehouse.RotationAssignment!.rotationCycle;

      expect(() =>
        initialAssignedData.createNextRotation(
          categories,
          tenantPlaceholders,
          rotationCycle,
        ),
      ).toThrowError('No categories found');
    });
  });

  describe("Next rotation's extra assignments calculation", () => {
    beforeEach(() => {
      sharehouse.RotationAssignment!.categories.push({
        id: '2',
        rotationAssignmentId: '1',
        name: 'Category 2',
        tasks: [
          {
            id: '2',
            title: 'Task 2',
            description: 'Description 2',
            categoryId: '2',
            createdAt: new Date().toISOString(),
          },
        ],
      });

      sharehouse.RotationAssignment!.tenantPlaceholders.push({
        rotationAssignmentId: '1',
        index: 1,
        tenantId: '2',
        tenant: {
          id: '2',
          name: 'Tenant 2',
          email: 'tenant_2@tascurator.com',
          extraAssignedCount: 0,
          createdAt: new Date().toISOString(),
        },
      });

      const startDate = new Date('2025-01-01T00:00:00Z');
      const rotationCycle = RotationCycle.Weekly;

      initialAssignedData = new InitialAssignedData(
        sharehouse,
        startDate,
        rotationCycle,
      );
    });

    it('should calculate with 2 categories = 2 tenants (o, o)', () => {
      const categories = sharehouse.RotationAssignment!.categories;
      const tenantPlaceholders =
        sharehouse.RotationAssignment!.tenantPlaceholders;
      const rotationCycle = sharehouse.RotationAssignment!.rotationCycle;

      const newAssignedDataInstance = initialAssignedData.createNextRotation(
        categories,
        tenantPlaceholders,
        rotationCycle,
      );

      const extraAssignments =
        newAssignedDataInstance.calculateExtraAssignments();

      const expectedExtraAssignments = {
        tenants: [],
      };

      expect(extraAssignments).toEqual(expectedExtraAssignments);
    });

    it('should calculate with 1 category < 2 tenants (o, o)', () => {
      sharehouse.RotationAssignment!.categories.pop();

      const categories = sharehouse.RotationAssignment!.categories;
      const tenantPlaceholders =
        sharehouse.RotationAssignment!.tenantPlaceholders;
      const rotationCycle = sharehouse.RotationAssignment!.rotationCycle;

      const newAssignedDataInstance = initialAssignedData.createNextRotation(
        categories,
        tenantPlaceholders,
        rotationCycle,
      );

      const extraAssignments =
        newAssignedDataInstance.calculateExtraAssignments();

      const expectedExtraAssignments = {
        tenants: [],
      };

      expect(extraAssignments).toEqual(expectedExtraAssignments);
    });

    it('should calculate with 3 categories > 2 tenants (o, o)', () => {
      sharehouse.RotationAssignment!.categories.push({
        id: '3',
        rotationAssignmentId: '1',
        name: 'Category 3',
        tasks: [
          {
            id: '3',
            title: 'Task 3',
            description: 'Description 3',
            categoryId: '3',
            createdAt: new Date().toISOString(),
          },
        ],
      });

      const categories = sharehouse.RotationAssignment!.categories;
      const tenantPlaceholders =
        sharehouse.RotationAssignment!.tenantPlaceholders;
      const rotationCycle = sharehouse.RotationAssignment!.rotationCycle;

      const newAssignedDataInstance = initialAssignedData.createNextRotation(
        categories,
        tenantPlaceholders,
        rotationCycle,
      );

      const extraAssignments =
        newAssignedDataInstance.calculateExtraAssignments();

      const expectedExtraAssignments = {
        tenants: [
          {
            id: '1',
            increasedExtraAssignedCount: 1,
          },
        ],
      };

      expect(extraAssignments).toEqual(expectedExtraAssignments);
    });

    it('should calculate with 4 categories > 2 tenants (o, o)', () => {
      sharehouse.RotationAssignment!.categories.push({
        id: '3',
        rotationAssignmentId: '1',
        name: 'Category 3',
        tasks: [
          {
            id: '3',
            title: 'Task 3',
            description: 'Description 3',
            categoryId: '3',
            createdAt: new Date().toISOString(),
          },
        ],
      });

      sharehouse.RotationAssignment!.categories.push({
        id: '4',
        rotationAssignmentId: '1',
        name: 'Category 4',
        tasks: [
          {
            id: '4',
            title: 'Task 4',
            description: 'Description 4',
            categoryId: '4',
            createdAt: new Date().toISOString(),
          },
        ],
      });

      const categories = sharehouse.RotationAssignment!.categories;
      const tenantPlaceholders =
        sharehouse.RotationAssignment!.tenantPlaceholders;
      const rotationCycle = sharehouse.RotationAssignment!.rotationCycle;

      const newAssignedDataInstance = initialAssignedData.createNextRotation(
        categories,
        tenantPlaceholders,
        rotationCycle,
      );

      const extraAssignments =
        newAssignedDataInstance.calculateExtraAssignments();

      const expectedExtraAssignments = {
        tenants: [
          {
            id: '1',
            increasedExtraAssignedCount: 1,
          },
          {
            id: '2',
            increasedExtraAssignedCount: 1,
          },
        ],
      };

      expect(extraAssignments).toEqual(expectedExtraAssignments);
    });

    it('should calculate with 5 categories > 2 tenants (o, o)', () => {
      sharehouse.RotationAssignment!.categories.push({
        id: '3',
        rotationAssignmentId: '1',
        name: 'Category 3',
        tasks: [
          {
            id: '3',
            title: 'Task 3',
            description: 'Description 3',
            categoryId: '3',
            createdAt: new Date().toISOString(),
          },
        ],
      });

      sharehouse.RotationAssignment!.categories.push({
        id: '4',
        rotationAssignmentId: '1',
        name: 'Category 4',
        tasks: [
          {
            id: '4',
            title: 'Task 4',
            description: 'Description 4',
            categoryId: '4',
            createdAt: new Date().toISOString(),
          },
        ],
      });

      sharehouse.RotationAssignment!.categories.push({
        id: '5',
        rotationAssignmentId: '1',
        name: 'Category 5',
        tasks: [
          {
            id: '5',
            title: 'Task 5',
            description: 'Description 5',
            categoryId: '5',
            createdAt: new Date().toISOString(),
          },
        ],
      });

      const categories = sharehouse.RotationAssignment!.categories;
      const tenantPlaceholders =
        sharehouse.RotationAssignment!.tenantPlaceholders;
      const rotationCycle = sharehouse.RotationAssignment!.rotationCycle;

      const newAssignedDataInstance = initialAssignedData.createNextRotation(
        categories,
        tenantPlaceholders,
        rotationCycle,
      );

      const extraAssignments =
        newAssignedDataInstance.calculateExtraAssignments();

      const expectedExtraAssignments = {
        tenants: [
          {
            id: '1',
            increasedExtraAssignedCount: 2,
          },
          {
            id: '2',
            increasedExtraAssignedCount: 1,
          },
        ],
      };

      expect(extraAssignments).toEqual(expectedExtraAssignments);
    });

    it('should calculate with 2 categories = 2 tenants, but 3 TenantPlaceholders (1 tenant left) (o, o, x)', () => {
      sharehouse.RotationAssignment!.tenantPlaceholders.push({
        rotationAssignmentId: '1',
        index: 2,
        tenantId: null,
        tenant: null,
      });

      const categories = sharehouse.RotationAssignment!.categories;
      const tenantPlaceholders =
        sharehouse.RotationAssignment!.tenantPlaceholders;
      const rotationCycle = sharehouse.RotationAssignment!.rotationCycle;

      const newAssignedDataInstance = initialAssignedData.createNextRotation(
        categories,
        tenantPlaceholders,
        rotationCycle,
      );

      const extraAssignments =
        newAssignedDataInstance.calculateExtraAssignments();

      const expectedExtraAssignments = {
        tenants: [],
      };

      expect(extraAssignments).toEqual(expectedExtraAssignments);
    });

    it('should calculate with 2 categories = 2 tenants, but 5 TenantPlaceholders (1 new tenant joined) (o, x, x, o, x)', () => {
      sharehouse.RotationAssignment!.tenantPlaceholders.push({
        rotationAssignmentId: '1',
        index: 2,
        tenantId: null,
        tenant: null,
      });

      sharehouse.RotationAssignment!.tenantPlaceholders.push({
        rotationAssignmentId: '1',
        index: 3,
        tenantId: null,
        tenant: null,
      });

      sharehouse.RotationAssignment!.tenantPlaceholders.push({
        rotationAssignmentId: '1',
        index: 4,
        tenantId: '5',
        tenant: {
          id: '5',
          name: 'Tenant 5',
          email: 'tenant_5@tascurator.com',
          extraAssignedCount: 0,
          createdAt: new Date().toISOString(),
        },
      });

      sharehouse.RotationAssignment!.tenantPlaceholders.push({
        rotationAssignmentId: '1',
        index: 5,
        tenantId: null,
        tenant: null,
      });

      const categories = sharehouse.RotationAssignment!.categories;
      const tenantPlaceholders =
        sharehouse.RotationAssignment!.tenantPlaceholders;
      const rotationCycle = sharehouse.RotationAssignment!.rotationCycle;

      const newAssignedDataInstance = initialAssignedData.createNextRotation(
        categories,
        tenantPlaceholders,
        rotationCycle,
      );

      const extraAssignments =
        newAssignedDataInstance.calculateExtraAssignments();

      const expectedExtraAssignments = {
        tenants: [],
      };

      expect(extraAssignments).toEqual(expectedExtraAssignments);
    });

    it('should calculate with 2 categories < 3 tenants, but 5 TenantPlaceholders (2 new tenants joined) (o, o, x, o, x)', () => {
      sharehouse.RotationAssignment!.tenantPlaceholders.push({
        rotationAssignmentId: '1',
        index: 2,
        tenantId: '3',
        tenant: {
          id: '3',
          name: 'Tenant 3',
          email: 'tenant_3@tascurator.com',
          extraAssignedCount: 0,
          createdAt: new Date().toISOString(),
        },
      });

      sharehouse.RotationAssignment!.tenantPlaceholders.push({
        rotationAssignmentId: '1',
        index: 3,
        tenantId: null,
        tenant: null,
      });

      sharehouse.RotationAssignment!.tenantPlaceholders.push({
        rotationAssignmentId: '1',
        index: 4,
        tenantId: '5',
        tenant: {
          id: '5',
          name: 'Tenant 5',
          email: 'tenant_5@tascurator.com',
          extraAssignedCount: 0,
          createdAt: new Date().toISOString(),
        },
      });

      sharehouse.RotationAssignment!.tenantPlaceholders.push({
        rotationAssignmentId: '1',
        index: 5,
        tenantId: null,
        tenant: null,
      });

      const categories = sharehouse.RotationAssignment!.categories;
      const tenantPlaceholders =
        sharehouse.RotationAssignment!.tenantPlaceholders;
      const rotationCycle = sharehouse.RotationAssignment!.rotationCycle;

      const newAssignedDataInstance = initialAssignedData.createNextRotation(
        categories,
        tenantPlaceholders,
        rotationCycle,
      );

      const extraAssignments =
        newAssignedDataInstance.calculateExtraAssignments();

      const expectedExtraAssignments = {
        tenants: [],
      };

      expect(extraAssignments).toEqual(expectedExtraAssignments);
    });
  });
});
