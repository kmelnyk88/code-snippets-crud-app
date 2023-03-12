import mongoose from 'mongoose'

const credentialsSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
})

const User = mongoose.model('Credentials', credentialsSchema)

const userModel = {}
export default userModel

/**
 *
 * @param {string} providedUsername that is retrieved from the login form
 * @returns {Promise<object>} that represents user credentials
 */
userModel.getUser = async (providedUsername) => {
  const user = await User.findOne({ username: providedUsername })
  return user
}

/**
 * Create user based on the passed parameters and save record to db.
 *
 * @param {*} username provided credentials
 * @param {*} password provided credentials
 * @returns {Promise<string>} username of the newly created user
 */
userModel.createNewUser = async (username, password) => {
  let newUser = new User({
    username,
    password
  })
  newUser = await newUser.save()
  return newUser.username
}
