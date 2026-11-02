/**
 * Utility functions for generating dynamic test data.
 * Helps avoid using static data that may conflict between test runs.
 */

/**
 * Generate a random email address
 * @param prefix - Prefix for the email (default: 'user')
 * @returns A unique email address
 */
export function generateRandomEmail(prefix = 'user'): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  return `${prefix}.${timestamp}.${random}@example.com`;
}

/**
 * Generate a random password
 * @param length - Length of the password (default: 12)
 * @returns A random password string
 */
export function generateRandomPassword(length = 12): string {
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Generate a random user object
 * @returns A user object with name, email, and password
 */
export function generateRandomUser() {
  return {
    name: `User_${Date.now()}`,
    email: generateRandomEmail(),
    password: generateRandomPassword(),
  };
}