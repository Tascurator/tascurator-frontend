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
}

/**
 * The object structure for Category
 */
export interface ICategory {
  id: string;
  name: string;
  tasks: ITask[];
}

/**
 * The object structure for Tenant
 */
export interface ITenant {
  id: string;
  name: string;
  email: string;
}
