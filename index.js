const memoryAdapter = require('./memoryAdapter');
const fileAdapter = require('./fileAdapter');

module.exports = (options) => {
  if (options && options.persistence) {
    const db = options.db ? options.db : 'cache.json';
    return fileAdapter(db);
  } return memoryAdapter();
}
