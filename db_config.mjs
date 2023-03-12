import mongoose from 'mongoose'

/**
 *
 * @param {*} uri db connection string
 */
export async function connectToDB (uri) {
  mongoose.connection.on('connected', () => {
    console.log('DB connection is established.')
  })
  mongoose.connection.on('disconnected', () => console.log('DB is disconnected.'))

  process.on('SIGINT', () => {
    mongoose.connection.close(() => {
      process.exit(0)
    })
  })

  mongoose.set('strictQuery', false)
  return mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
}
