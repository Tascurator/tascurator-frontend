import { Tables } from '@/types/database.types';

export type TShareHouse = Tables<'ShareHouse'>;

export type TRotationAssignment = Tables<'RotationAssignment'>;

export type TAssignmentSheet = Tables<'AssignmentSheet'>;

export type TCategory = Tables<'Category'>;

export type TTask = Tables<'Task'>;

export type TTenantPlaceholder = Tables<'TenantPlaceholder'>;

export type TTenant = Tables<'Tenant'>;

export type TAssignedData = {
  assignments: [
    {
      category?: {
        id: string;
        name: string;
      };
      assigneePlaceholderId?: number;
      assignee: {
        id: string;
        name: string;
      };
      tasks?: [
        {
          id: string;
          title: string;
          description: string;
          isCompleted: boolean;
        },
      ];
    },
  ];
};
