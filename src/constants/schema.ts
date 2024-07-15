import { CONSTRAINTS } from '@/constants/constraints';
import { ERROR_MESSAGES } from '@/constants/error-messages';
import { z } from 'zod';

import { removeHtmlTags } from '@/utils/task-description';

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
 * // custom validator for task description length
 */
const taskDescriptionLengthMinValidate = (description: string) => {
  const cleanedDescription = removeHtmlTags(description);
  return cleanedDescription.length >= TASK_DESCRIPTION_MIN_LENGTH;
};

const taskDescriptionLengthMaxValidate = (description: string) => {
  const cleanedDescription = removeHtmlTags(description);
  return cleanedDescription.length <= TASK_DESCRIPTION_MAX_LENGTH;
};

/**
 * The schema for the category creation or update form
 */

export const categoryCreationSchema = z.object({
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
  description: z
    .string()
    .refine(
      taskDescriptionLengthMinValidate,
      minLength('Description', TASK_DESCRIPTION_MIN_LENGTH),
    )
    .refine(
      taskDescriptionLengthMaxValidate,
      maxLength('Description', TASK_DESCRIPTION_MAX_LENGTH),
    ),
});

/**
 * The schema for the task creation form
 */

export const taskCreationSchema = z.object({
  categoryId: z.string(),
  title: z
    .string()
    .min(TASK_TITLE_MIN_LENGTH, minLength('Title', TASK_TITLE_MIN_LENGTH))
    .max(TASK_TITLE_MAX_LENGTH, maxLength('Title', TASK_TITLE_MAX_LENGTH)),
  description: z
    .string()
    .refine(
      taskDescriptionLengthMinValidate,
      minLength('Description', TASK_DESCRIPTION_MIN_LENGTH),
    )
    .refine(
      taskDescriptionLengthMaxValidate,
      maxLength('Description', TASK_DESCRIPTION_MAX_LENGTH),
    ),
});

/**
 * The schema for the task edit form
 */
export const taskEditSchema = z.object({
  categoryId: z.string(),
  taskId: z.string(),
  title: z
    .string()
    .min(TASK_TITLE_MIN_LENGTH, minLength('Title', TASK_TITLE_MIN_LENGTH))
    .max(TASK_TITLE_MAX_LENGTH, maxLength('Title', TASK_TITLE_MAX_LENGTH)),
  description: z
    .string()
    .refine(
      taskDescriptionLengthMinValidate,
      minLength('Description', TASK_DESCRIPTION_MIN_LENGTH),
    )
    .refine(
      taskDescriptionLengthMaxValidate,
      maxLength('Description', TASK_DESCRIPTION_MAX_LENGTH),
    ),
});

/**
 * The schema for the task update form
 */

export const taskUpdateSchema = taskCreationSchema
  .omit({ categoryId: true })
  .partial();

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
export type TTaskEditSchema = z.infer<typeof taskEditSchema>;
export type TCategoryCreationSchema = z.infer<typeof categoryCreationSchema>;

export type TShareHouseNameSchema = z.infer<typeof shareHouseNameSchema>;
export type TCategoryNameSchema = z.infer<typeof categoryNameSchema>;

const { TENANT_NAME_MIN_LENGTH, TENANT_NAME_MAX_LENGTH } = CONSTRAINTS;

export const tenantInvitationSchema = z.object({
  name: z
    .string()
    .min(TENANT_NAME_MIN_LENGTH, minLength('Name', TENANT_NAME_MIN_LENGTH))
    .max(TENANT_NAME_MAX_LENGTH, maxLength('Name', TENANT_NAME_MAX_LENGTH)),
  email: z.string().email(ERROR_MESSAGES.EMAIL_INVALID).trim(),
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
