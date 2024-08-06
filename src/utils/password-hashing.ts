import bcrypt, { genSalt } from 'bcryptjs';
import { SERVER_ERROR_MESSAGES } from '@/constants/server-error-messages';

const { ENV_KEYS_MISSING, COMPLETION_ERROR } = SERVER_ERROR_MESSAGES;

/**
 * Hashes a password using bcrypt
 *
 * @param password - The password to hash
 * @returns A promise that resolves with the hashed password
 */
export const hashPassword = async (password: string) => {
  const salt = process.env.PASSWORD_SALT_ROUNDS;

  if (!salt) {
    throw new Error(ENV_KEYS_MISSING(['PASSWORD_SALT_ROUNDS']));
  }

  if (Number.isNaN(Number(salt))) {
    throw new Error(COMPLETION_ERROR('hashing the password'));
  }

  const saltRounds = await genSalt(Number(salt));

  return bcrypt.hash(password, saltRounds);
};
