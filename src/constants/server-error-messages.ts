/**
 * This file contains all the error messages displayed in the application.
 */
export const SERVER_ERROR_MESSAGES = {
  AUTH_REQUIRED: 'You are not logged in. Please log in to continue.',
  NOT_FOUND: (entity: string) => `The specified ${entity} could not be found.`,
  NAME_EXISTS: (entity: string) =>
    `A ${entity} with the same name already exists in this sharehouse.`,
  EMAIL_EXISTS: 'A tenant with this email already exists.',
  INTERNAL_SERVER_ERROR:
    'An internal server error occurred. Please try again later.',
  COMPLETION_ERROR: (entity: string) =>
    `An error occurred while ${entity} completion.`,
};
