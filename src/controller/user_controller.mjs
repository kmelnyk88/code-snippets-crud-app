import userModel from '../model/user_model.mjs'
import { ERR } from './error_controller.mjs'
import emptyField from '../utils/simple_validator.mjs'
import { hash, comparePasswords } from '../utils/hashing.mjs'

const userController = {}
export default userController

/**
 * Send login form view to the user if the user is not already loged in
 *
 * @param {*} req http request
 * @param {*} res http response
 */
userController.login = (req, res) => {
  // if there's a session in the session store, then user is already authorized, thus he/she should not get access to the login page
  if (req.session.userId) ERR.Forbidden.throw()
  res.render('login', { flashMessage: undefined })
}

/**
 * Validate provided credentials.
 * Update session with user info after successful authorization.
 *
 * @param {*} req http request
 * @param {*} res http response
 * @param {*} next reference to the error handling middleware (needs to be explicitly called in async functions)
 */
userController.authorize = async (req, res, next) => {
  try {
    if (req.session.userId) ERR.Forbidden.throw()
    if (emptyField(req.body.username) || emptyField(req.body.pwd)) ERR.CredentialsValidation.throw()

    const userAlreadyExist = await userModel.getUser(req.body.username)
    if (userAlreadyExist) {
      const samePassword = await comparePasswords(req.body.pwd, userAlreadyExist.password)
      if (samePassword) {
        req.session.userId = userAlreadyExist.username
        req.session.flashMessage = { type: 'alert-success', message: `Welcome back, ${req.session.userId} ❤️!` }
        res.redirect('/')
      } else {
        // username already exists in the db, cannot register user with the same username but different password
        ERR.UserDuplication.throw()
      }
    } else {
      // completely new user, need to save him/her to db and save the session to the store
      const newUsername = await userModel.createNewUser(req.body.username, await hash(req.body.pwd))
      req.session.userId = newUsername
      req.session.flashMessage = { type: 'alert-success', message: `Welcome, ${req.session.userId}! We hope you enjoy your stay 🙂` }
      res.redirect('/')
    }
  } catch (error) {
    next(error)
  }
}

/**
 * Performs log out (delete session from the session store and redirect to start page on successful log out).
 * Restricts log out for the users that are not loged in.
 *
 * @param {*} req http request
 * @param {*} res http response
 */
userController.logout = (req, res) => {
  if (!req.session.userId) ERR.Forbidden.throw()
  // completely delete session from the storage
  req.session.destroy(err => {
    // error controller should handle it
    if (err) throw err
    res.redirect('/')
  })
}
