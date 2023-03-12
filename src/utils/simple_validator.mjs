
/**
 * Check for empty or null string
 *
 * @param {string} field from the submission form
 * @returns {boolean} true if invalid string, false if valid
 */
export default function emptyField (field) {
  return !field || !field.trim() || field.trim().length === 0
}
