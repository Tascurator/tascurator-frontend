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
};
