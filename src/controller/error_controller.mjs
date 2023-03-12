
export const ERR = {
  UserDuplication: customError('UserDuplication', 409, 'Username already exists!'),
  CredentialsValidation: customError('CredentialsValidation', 422, 'Please provide both username and password!'),
  NewSnippetValidation: customError('NewSnippetValidation', 422, 'Please provide both title and snippet content!'),
  EditSnippetValidation: customError('EditSnippetValidation', 422, 'Please provide both title and snippet content!'),
  NotFound: customError('NotFound', 404, 'Resource not found.'),
  Forbidden: customError('Forbidden', 403, 'Access forbidden.')
}

/**
 * Custom error handling middleware
 *
 * @param {*} err error that is passed to the error handling middleware
 * @param {*} req instance of the http request
 * @param {*} res instance of the http response
 * @param {*} next reference to the next middleware (not actually used. passed to keep method signature)
 */
export function handleErrors (err, req, res, next) {
  console.error(`Request:${req.method}${req.url} ERROR! ${err.name}: code ${err.code}, message: ${err.message}`)
  switch (err.name) {
    case ERR.UserDuplication.name:
    case ERR.CredentialsValidation.name:
      warning(req, res, err, 'login')
      break
    case ERR.NewSnippetValidation.name:
      warning(req, res, err, 'new_snippet')
      break
    case ERR.EditSnippetValidation.name:
      warning(req, res, err, 'edit_snippet')
      break
    case ERR.Forbidden.name:
      error(res, err.code, 'partials/_alert_403')
      break
    case ERR.NotFound.name:
      error(res, err.code, 'partials/_alert_404')
      break
    default:
      error(res, 500, 'partials/_alert_500')
      break
  }
}

/**
 * This middleware is created in order to catch possible syntax errors with ejs files
 * that can occur when handleErrors function sends respond to the client
 *
 * @param {*} err error that is passed to the error handling middleware
 * @param {*} req instance of the http request
 * @param {*} res instance of the http response
 * @param {*} next reference to the next middleware (not actually used. passed to keep method signature)
 */
export function handleErrorsHelper (err, req, res, next) {
  console.error(`Request:${req.method}${req.url} ERROR! ${err.name}: code ${err.code}, message: ${err.message}`)
  res.status(500).send('500 Internal Server Error. Something went really wrong...')
}

/**
 * Warns user by displaying respective ejs view with the appropriate flash message
 *
 * @param {*} req instance of the http request
 * @param {*} res instance of the http response
 * @param {*} err error that is passed to the error handling middleware
 * @param {*} view ejs file to render
 */
function warning (req, res, err, view) {
  const partiallyProvidedData = {}
  if (err.name === ERR.NewSnippetValidation.name || err.name === ERR.EditSnippetValidation.name) {
    partiallyProvidedData.id = req.body.id
    partiallyProvidedData.title = req.body.title
    partiallyProvidedData.snippet = req.body.snippet
  }
  res.status(err.code).render(view, { flashMessage: { type: 'alert-warning', message: err.message }, formFields: partiallyProvidedData })
}

/**
 * Major error (403,,404 or 500)
 *
 * @param {*} res instance of the http response
 * @param {*} code error code (used to send http response status code)
 * @param {*} view ejs file to render
 */
function error (res, code, view) {
  res.status(code).render('alert_403_404_500', { alertContent: view })
}

/**
 * Create error like object with certain name, code and message
 *
 * @param {*} name error name
 * @param {*} code error code
 * @param {*} message error message
 * @returns {object} represent error like object
 */
function customError (name, code, message) {
  return {
    name,
    code,
    message,
    throw: throwError
  }
}

/**
 * Create Error, assign name, code, message and throw it
 */
function throwError () {
  const err = new Error()
  err.code = this.code
  err.name = this.name
  err.message = this.message
  throw err
}
