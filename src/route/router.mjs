import express from 'express'
import snippetsController from '../controller/snippets_controller.mjs'
import userController from '../controller/user_controller.mjs'
import { ERR } from '../controller/error_controller.mjs'

const router = express.Router()
export default router

// routes that are handled by snippets controller
router.get('', snippetsController.list)
router.get('/new', snippetsController.newSnippetForm)
router.post('', snippetsController.postNewSnippet)
router.get('/edit/:id', snippetsController.editSnippetForm)
router.post('/edit/:id', snippetsController.postSnippetUpdate)
router.post('/delete/:id', snippetsController.delete)

// routes that are handled by user controller
router.get('/login', userController.login)
router.post('/login', userController.authorize)
router.get('/logout', userController.logout)

// resources that do not exist on the server
router.get('*', (req, res) => ERR.NotFound.throw())
router.post('*', (req, res) => ERR.NotFound.throw())
