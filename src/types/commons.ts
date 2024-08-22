/**
 * The object structure for ShareHouse
 */
export interface IShareHouse {
  id: string;
  name: string;
}

/**
 * The object structure for Task
 */
export interface ITask {
  id: string;
  title: string;
  description: string;
  categoryId?: string;
}

/**
 * The object structure for Category
 */
export interface ICategory {
  id: string;
  name: string;
  tasks: ITask[];
}

export type ICategoryWithoutTasks = Omit<ICategory, 'tasks'>;

/**
 * The object structure for Tenant
 */
export interface ITenant {
  id: string;
  name: string;
  email: string;
}

/**
 * The object structure for share house data
 */
export interface ICardContentProps {
  id?: string | undefined;
  name: string | null;
  maxTasks?: number | null;
  completedTasks?: number | null;
  tenant: {
    id: string;
    name: string;
  };
  isComplete?: boolean;
  className?: string;
}

/**
 * The enum for RotationCycle
 * - Weekly: 7 days
 * - Fortnightly: 14 days
 */
export enum RotationCycle {
  Weekly = 7,
  Fortnightly = 14,
}

/**
 * The object structure for verification email token data
 */
export interface ITokenData {
  id: string;
  email: string;
  token: string;
  expiresAt: Date;
}
