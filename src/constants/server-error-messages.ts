/**
 * This file contains all the error messages displayed in the application.
 */
export const SERVER_ERROR_MESSAGES = {
  AUTH_REQUIRED: 'You are not logged in. Please log in to continue.',
  NOT_FOUND: (entity: string) => `The specified ${entity} could not be found.`,
  DUPLICATE_ENTRY: (field: string, entity: string, context: string) =>
    `A ${entity} with the same ${field} already exists in the ${context}.`,
  INTERNAL_SERVER_ERROR:
    'An internal server error occurred. Please try again later.',
  COMPLETION_ERROR: (action: string) => `An error occurred while ${action}.`,
  DELETE_NOT_ALLOWED: (entity: string) =>
    `You are not allowed to delete this ${entity}.`,
  MAX_LIMIT_REACHED: (entity: string, max: number) =>
    `The number of ${entity} has reached the maximum limit of ${max}.`,
  UNAUTHORIZED: 'You are not authorized. Please log in and try again.',
  NO_DATA_PROVIDED:
    'No data provided in the request. Please include the necessary information.',
  EMPTY_ARRAY: (entity: string) =>
    `The provided ${entity} array is empty. Please include at least one ${entity}.`,
  UNASSIGNED_TASK_UPDATE_ERROR:
    'The request contains tasks that the tenant has not been assigned. Only assigned tasks can be updated.',
};
