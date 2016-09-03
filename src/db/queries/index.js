import glob from 'glob'
import path from 'path'
import { QueryFile as PostgresQueryFile } from 'pg-promise'

const queries = {}

function loadQueries (extension, fn) {
  const filenames = glob.sync(path.join(__dirname, `**/*.${extension}`))
  for (const filename of filenames) {
    const queryName = path.basename(filename, `.${extension}`)
    if (queryName in queries) {
      log.warn(`Duplicate query named '${queryName}'`)
    } else {
      queries[queryName] = fn(filename)
    }
  }
}

loadQueries('sql', (file) => new PostgresQueryFile(file))

module.exports = queries
export default queries
