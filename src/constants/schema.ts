import { CONSTRAINTS } from '@/constants/constraints';
import { ERROR_MESSAGES } from '@/constants/error-messages';
import { z } from 'zod';

const {
  TASK_TITLE_MIN_LENGTH,
  TASK_TITLE_MAX_LENGTH,
  TASK_DESCRIPTION_MIN_LENGTH,
  TASK_DESCRIPTION_MAX_LENGTH,
  CATEGORY_NAME_MIN_LENGTH,
  CATEGORY_NAME_MAX_LENGTH,
  SHAREHOUSE_NAME_MIN_LENGTH,
  SHAREHOUSE_NAME_MAX_LENGTH,
  PASSWORD_MIN_NUMBERS,
  PASSWORD_MAX_LENGTH,
} = CONSTRAINTS;

const { minLength, maxLength } = ERROR_MESSAGES;

/**
 * The schema for the task creation or update form
 */
export const taskCreationSchema = z.object({
  category: z
    .string()
    .min(
      CATEGORY_NAME_MIN_LENGTH,
      minLength('Category', CATEGORY_NAME_MIN_LENGTH),
    )
    .max(
      CATEGORY_NAME_MAX_LENGTH,
      maxLength('Category', CATEGORY_NAME_MAX_LENGTH),
    ),
  title: z
    .string()
    .min(TASK_TITLE_MIN_LENGTH, minLength('Title', TASK_TITLE_MIN_LENGTH))
    .max(TASK_TITLE_MAX_LENGTH, maxLength('Title', TASK_TITLE_MAX_LENGTH)),
  description: z.string(),
  descriptionCount: z
    .string()
    .min(
      TASK_DESCRIPTION_MIN_LENGTH,
      minLength('DescriptionCount', TASK_DESCRIPTION_MIN_LENGTH),
    )
    .max(
      TASK_DESCRIPTION_MAX_LENGTH,
      maxLength('DescriptionCount', TASK_DESCRIPTION_MAX_LENGTH),
    ),
});

/**
 * The schema for the sharehouse edit or update form
 */

export const shareHouseNameSchema = z.object({
  name: z
    .string()
    .min(
      SHAREHOUSE_NAME_MIN_LENGTH,
      minLength('ShareHouse name', SHAREHOUSE_NAME_MIN_LENGTH),
    )
    .max(
      SHAREHOUSE_NAME_MAX_LENGTH,
      maxLength('ShareHouse name', SHAREHOUSE_NAME_MAX_LENGTH),
    ),
});

/**
 * The schema for the category edit or update form
 */

export const categoryNameSchema = z.object({
  name: z
    .string()
    .min(
      CATEGORY_NAME_MIN_LENGTH,
      minLength('Category name', CATEGORY_NAME_MIN_LENGTH),
    )
    .max(
      CATEGORY_NAME_MAX_LENGTH,
      maxLength('Category name', CATEGORY_NAME_MAX_LENGTH),
    ),
});

export type TTaskCreationSchema = z.infer<typeof taskCreationSchema>;

export type TShareHouseNameSchema = z.infer<typeof shareHouseNameSchema>;
export type TCategoryNameSchema = z.infer<typeof categoryNameSchema>;

const { TENANT_NAME_MIN_LENGTH, TENANT_NAME_MAX_LENGTH } = CONSTRAINTS;

export const tenantInvitationSchema = z.object({
  name: z
    .string()
    .min(TENANT_NAME_MIN_LENGTH, minLength('Name', TENANT_NAME_MIN_LENGTH))
    .max(TENANT_NAME_MAX_LENGTH, maxLength('Name', TENANT_NAME_MAX_LENGTH)),
  email: z.string().email(ERROR_MESSAGES.EMAIL_INVALID),
});

export type TTenantInvitationSchema = z.infer<typeof tenantInvitationSchema>;

export const loginSchema = z.object({
  email: z.string().email(ERROR_MESSAGES.EMAIL_INVALID),
  password: z
    .string()
    .min(PASSWORD_MIN_NUMBERS, minLength('Password', PASSWORD_MIN_NUMBERS))
    .max(PASSWORD_MAX_LENGTH, maxLength('Password', PASSWORD_MAX_LENGTH)),
});

export type TLoginSchema = z.infer<typeof loginSchema>;
