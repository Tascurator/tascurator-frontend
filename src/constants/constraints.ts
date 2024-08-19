/**
 * This file contains all the constraints used in the application.
 */
export const CONSTRAINTS = {
  // Password
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 30,
  PASSWORD_MIN_CAPITAL_LETTERS: 1,
  PASSWORD_MIN_LOWERCASE_LETTERS: 1,
  PASSWORD_MIN_SPECIAL_CHARACTERS: 1,
  PASSWORD_MIN_NUMBERS: 1,

  // Shared house
  SHAREHOUSE_MAX_AMOUNT: 10,
  SHAREHOUSE_NAME_MIN_LENGTH: 1,
  SHAREHOUSE_NAME_MAX_LENGTH: 50,

  // Tenant
  TENANT_MAX_AMOUNT: 10,
  TENANT_NAME_MIN_LENGTH: 1,
  TENANT_NAME_MAX_LENGTH: 30,

  // Category
  CATEGORY_MIN_AMOUNT: 1,
  CATEGORY_MAX_AMOUNT: 15,
  CATEGORY_NAME_MIN_LENGTH: 1,
  CATEGORY_NAME_MAX_LENGTH: 30,

  // Task
  TASK_MIN_AMOUNT: 1,
  TASK_MAX_AMOUNT: 20,
  TASK_TITLE_MIN_LENGTH: 1,
  TASK_TITLE_MAX_LENGTH: 50,
  TASK_DESCRIPTION_MIN_LENGTH: 10,
  TASK_DESCRIPTION_MAX_LENGTH: 1000,

  // Rotation
  ROTATION_WEEKLY: 7,
  ROTATION_FORTNIGHTLY: 14,

  // Verification email token expiration time
  VERIFICATION_EMAIL_TOKEN_EXPIRATION_TIME: 3 * 60 * 60 * 1000, // 3 hours

  // Check email token expiration time before sending a new one
  VERIFICATION_EMAIL_RESEND_COOLDOWN_TIME: 30 * 60 * 1000, // 30 minutes

  // Password reset token expiration time
  PASSWORD_RESET_TOKEN_EXPIRATION_TIME: 3 * 60 * 60 * 1000, // 3 hours
};
