import bcrypt, { genSaltSync } from 'bcryptjs';

/**
 * Hashes a password using bcrypt
 *
 * @param password - The password to hash
 * @returns A promise that resolves with the hashed password
 */
export const hashPassword = async (password: string) => {
  const salt = process.env.PASSWORD_SALT_ROUNDS;

  if (!salt) {
    throw new Error('PASSWORD_SALT_ROUNDS environment variable is not set');
  }

  if (Number.isNaN(Number(salt))) {
    throw new Error(
      'PASSWORD_SALT_ROUNDS environment variable is not a number',
    );
  }

  return bcrypt.hash(password, genSaltSync(Number(salt)));
};
