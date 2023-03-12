import mongoose from 'mongoose'

const codeSnippetSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  snippet: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
})

const Snippet = mongoose.model('Snippet', codeSnippetSchema)

const snippetModel = {}
export default snippetModel

/**
 * Get all code snippets from the db
 *
 * @returns {Promise<Array>} collection of code snippets stored in the db
 */
snippetModel.getAllSnippets = async () => {
  const snippets = await Snippet.find().sort({ date: 'desc' })
  return snippets
}

/**
 * Get the code snippet with the certain id
 *
 * @param {string} id aka primary key of the code snippet record
 * @returns {Promise<object>} code snippet
 */
snippetModel.getSnippet = async (id) => {
  const snippet = await Snippet.findById(id)
  return snippet
}

/**
 * Create new code snippet record and save it to db
 *
 * @param {string} title of the code snippet
 * @param {string} snippet content
 * @param {string} author of the code snippet
 */
snippetModel.createSnippet = async (title, snippet, author) => {
  const newSnippet = new Snippet({
    title,
    snippet,
    author
  })
  await newSnippet.save()
}

/**
 *
 * @param {string} id aka primary key of the code snippet record
 * @param {string} title of the code snippet
 * @param {string} snippet content
 */
snippetModel.updateSnippet = async (id, title, snippet) => {
  await Snippet.updateOne({ _id: id }, { $set: { title, snippet } }, { runValidators: true })
}

/**
 *
 * @param {string} id id aka primary key of the code snippet record
 */
snippetModel.deleteSnippet = async (id) => {
  await Snippet.deleteOne({ _id: id })
}
