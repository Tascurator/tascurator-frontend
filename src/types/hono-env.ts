import { Session } from 'next-auth';
import {
  TPrismaCategory,
  TPrismaTask,
  TPrismaTenant,
  TSanitizedPrismaShareHouse,
} from '@/types/server';

export type THonoEnv = {
  Variables: {
    session: Session;
    sharehouses: TSanitizedPrismaShareHouse[];

    getRotationAssignmentBySharehouseId: (
      sharehouseId: string,
    ) => TSanitizedPrismaShareHouse['RotationAssignment'] | null;
    getAssignmentSheetBySharehouseId: (
      sharehouseId: string,
    ) => TSanitizedPrismaShareHouse['assignmentSheet'] | null;
    getCategoriesBySharehouseId: (
      sharehouseId: string,
    ) => TSanitizedPrismaShareHouse['RotationAssignment']['categories'];
    getTasksByCategoryId: (
      categoryId: string,
    ) => TSanitizedPrismaShareHouse['RotationAssignment']['categories'][0]['tasks'];
    getTenantsBySharehouseId: (
      sharehouseId: string,
      orderBy?: 'placeholderIndex' | 'tenantCreatedAt',
    ) => NonNullable<
      TSanitizedPrismaShareHouse['RotationAssignment']['tenantPlaceholders'][0]['tenant']
    >[];
    getSharehouseById: (id: string) => TSanitizedPrismaShareHouse | null;
    getCategoryById: (id: string) => {
      shareHouseId: string;
      category: TPrismaCategory;
    } | null;
    getTaskById: (id: string) => {
      shareHouseId: string;
      categoryId: string;
      task: TPrismaTask;
    } | null;
    getTenantById: (id: string) => {
      shareHouseId: string;
      tenant: TPrismaTenant;
    } | null;
  };
};
