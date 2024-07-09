export const PASSWORD_CONSTRAINTS = {
  // Dynamic constraints
  minLength: (field: string, min: number) => `At least ${min} ${field}.`,
  lessLength: (field: string, min: number) =>
    `Less than or equal to ${min} ${field}.`,
  graterLength: (field: string, max: number) =>
    `Greater than or equal to ${max} ${field}.`,
};
