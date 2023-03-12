import express from 'express'
import session from 'express-session'
import router from './route/router.mjs'
import { handleErrors, handleErrorsHelper } from './controller/error_controller.mjs'

const app = express()

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))

const sessionOptions = {
  secret: "Say_'Friend'_and_enter",
  // not authenticated sessions won't be saved to the storage
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24 },
  resave: false
}
app.use(session(sessionOptions))

// router is used for all routes
app.use('/', router)

// custom error handling middleware
app.use(handleErrors)
app.use(handleErrorsHelper)

export default (port = 3000) => {
  app.listen(port, () => {
    console.log(`Listening at port ${port}`)
  })
}
