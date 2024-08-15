/**
 * This file contains all the messages displayed in the application.
 */
export const SERVER_ERROR_MESSAGES = {
  AUTH_REQUIRED: 'You are not logged in. Please log in to continue.',
  CHANGE_SAME_NAME: 'The name is the same as before the change.',
  COMPLETION_ERROR: (action: string) => `An error occurred while ${action}.`,
  CONSOLE_COMPLETION_ERROR: (action: string) => `Error ${action}.`,
  DELETE_NOT_ALLOWED: (entity: string) =>
    `You cannot delete this ${entity}; at least one ${entity} must remain.`,
  DUPLICATE_ENTRY: (entity: string) =>
    `This ${entity} is already taken and cannot be reused.`,
  EMPTY_ARRAY: (entity: string) =>
    `The provided ${entity} array is empty. Please include at least one ${entity}.`,
  INTERNAL_SERVER_ERROR:
    'An internal server error occurred. Please try again later.',
  MAX_LIMIT_REACHED: (entity: string, max: number) =>
    `The number of ${entity} has reached the maximum limit of ${max}.`,
  NOT_FOUND: (entity: string) => `The specified ${entity} could not be found.`,
  NO_DATA_PROVIDED:
    'No data provided in the request. Please include the necessary information.',
  UNASSIGNED_TASK_UPDATE_ERROR:
    'The request contains tasks that the tenant has not been assigned. Only assigned tasks can be updated.',
  UNAUTHORIZED: 'You are not authorized. Please log in and try again.',
  EMAIL_SEND_ERROR:
    'An error occurred while sending the email. Please try again later.',
  ENV_KEYS_MISSING: (keys: string[]) =>
    `The following environment key(s) are missing: ${keys.join(', ')}.`,
  INVALID_TOKEN_RESET_PASSWORD:
    'Invalid or expired token. Please try resetting your password again.',
  INVALID_TOKEN_VERIFICATION: 'Invalid token. Please try signing up.',
  COOL_DOWN_EMAIL_VERIFICATION: 'Please wait 30 minutes before trying again.',
  EXPIRED_TOKEN_VERIFICATION:
    'The token has expired. Please resend the email and verify your account again.',
  NOT_EXISTING_USER: 'Email does not exist.',
  EXISTING_EMAIL: 'Email already in use. please log in.',
  CREDENTIAL_FIELDS_INVALID: 'Invalid fields',
  PAST_END_DATE_ERROR:
    'Your task details are outdated. Please refresh the page to view the latest tasks.',
};
