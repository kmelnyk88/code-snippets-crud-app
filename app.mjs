import * as dotenv from 'dotenv'
import app from './src/server.mjs'
import { connectToDB } from './db_config.mjs'
dotenv.config()

await connectToDB(process.env.DB_CONNECTION).catch(err => {
  console.error(`DB connection error: ${err.message}`)
  process.exit(1)
})

app()
