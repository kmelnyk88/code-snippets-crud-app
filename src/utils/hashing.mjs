import bcrypt from 'bcrypt'

/**
 * Password hashing
 *
 * @param {string} password provided by the user
 * @returns {Promise<string>} hashed password
 */
export async function hash (password) {
  const saltRounds = 10
  const hashedPassword = await bcrypt.hash(password, saltRounds)
  return hashedPassword
}

/**
 *
 * @param {string} password provided by the user
 * @param {string} passwordFromDB hashed password
 * @returns {Promise<boolean>} true if passwords match, false otherwise
 */
export async function comparePasswords (password, passwordFromDB) {
  const result = await bcrypt.compare(password, passwordFromDB)
  return result
}
