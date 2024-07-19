export const PASSWORD_CONSTRAINTS = {
  // Dynamic constraints
  minLength: (field: string, min: number) => `At least ${min} ${field}.`,
  length: (field: string, min: number, max: number) =>
    `Between ${min} and ${max} ${field}.`,
};
