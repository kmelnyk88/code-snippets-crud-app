import snippetModel from '../model/snippet_model.mjs'
import { ERR } from './error_controller.mjs'
import emptyField from '../utils/simple_validator.mjs'
import { md } from '../utils/markdown.mjs'

const snippetsController = {}
export default snippetsController

/**
 *
 * @param {*} req http request
 * @param {*} res http response
 * @param {*} next reference to the error handling middleware (need to be explicitly called in async functions)
 */
snippetsController.list = async (req, res, next) => {
  try {
    const snippets = await snippetModel.getAllSnippets()
    for (let i = 0; i < snippets.length; i++) {
      snippets[i].markdown = md.render(snippets[i].snippet)
    }
    const flashMessage = req.session.flashMessage
    req.session.flashMessage = null
    res.render('start_page', { snippets, username: req.session.userId, flashMessage })
  } catch (error) {
    next(error)
  }
}

/**
 * Compiles and sends view to create a new code snippet to the user
 *
 * @param {*} req http request
 * @param {*} res http response
 */
snippetsController.newSnippetForm = (req, res) => {
  if (!req.session.userId) ERR.Forbidden.throw()
  res.render('new_snippet', { flashMessage: undefined, formFields: {} })
}

/**
 * Coordinates the process of post request to create new code snippet
 *
 * @param {*} req http request
 * @param {*} res http response
 * @param {*} next reference to the error handling middleware (need to be explicitly called in async functions)
 */
snippetsController.postNewSnippet = async (req, res, next) => {
  try {
    if (!req.session.userId) ERR.Forbidden.throw()
    if (emptyField(req.body.title) || emptyField(req.body.snippet)) ERR.NewSnippetValidation.throw()
    await snippetModel.createSnippet(req.body.title, req.body.snippet, req.session.userId)
    req.session.flashMessage = { type: 'alert-success', message: `Code snippet "${req.body.title}" created!` }
    res.redirect('/')
  } catch (error) {
    next(error)
  }
}

/**
 * Compiles and sends view to edit code snippet to the user that is the author of the code snippet
 *
 * @param {*} req http request
 * @param {*} res http response
 * @param {*} next reference to the error handling middleware (need to be explicitly called in async functions)
 */
snippetsController.editSnippetForm = async (req, res, next) => {
  try {
    const snippet = await checkRequestState(req)
    res.render('edit_snippet', { flashMessage: undefined, formFields: snippet })
  } catch (error) {
    next(error)
  }
}

/**
 * Coordinates the process of posting updates of the code snippet
 *
 * @param {*} req http request
 * @param {*} res http response
 * @param {*} next reference to the error handling middleware (need to be explicitly called in async functions)
 */
snippetsController.postSnippetUpdate = async (req, res, next) => {
  try {
    const snippet = await checkRequestState(req)
    if (emptyField(req.body.title) || emptyField(req.body.snippet)) {
      // need to save snippet id to render form in the error controller middleware
      req.body.id = req.params.id
      ERR.EditSnippetValidation.throw()
    }
    await snippetModel.updateSnippet(snippet.id, req.body.title, req.body.snippet)
    req.session.flashMessage = { type: 'alert-success', message: `Code snippet "${req.body.title}" updated!` }
    res.redirect('/')
  } catch (error) {
    next(error)
  }
}

/**
 * Coordintates the process of post request to delete a certain code snippet
 *
 * @param {*} req http request
 * @param {*} res http response
 * @param {*} next reference to the error handling middleware (need to be explicitly called in async functions)
 */
snippetsController.delete = async (req, res, next) => {
  try {
    const snippet = await checkRequestState(req)

    await snippetModel.deleteSnippet(snippet.id)
    res.redirect('/')
  } catch (error) {
    next(error)
  }
}

/**
 * Helper function to be used in some methods of snippet controller.
 * Performs basic checks before the actual code snippet deletion from db.
 * Could have been inserted as the middleware in the controller methods,
 * but I decided to keep it as a separate explicitly invoked function.
 *
 * @param {*} req http request
 * @returns {object} that is a code snippet retrieved from the db
 */
async function checkRequestState (req) {
  if (!req.session.userId) ERR.Forbidden.throw()
  const snippet = await snippetModel.getSnippet(req.params.id)
  if (!snippet) ERR.NotFound.throw()
  if (snippet.author !== req.session.userId) ERR.Forbidden.throw()
  return snippet
}
