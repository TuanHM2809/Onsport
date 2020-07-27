const lodash = require('lodash')

const { badWords } = require('./bad-words.json')

const badWordsSorted = lodash(badWords).sortBy(el => el.length).reverse().value()
let badWordsConcat = ''
for (const x in badWordsSorted) {
  badWordsConcat = `${badWordsConcat}${badWords[x]}|`
}
badWordsConcat = badWordsConcat.substr(0, badWordsConcat.length - 1)
const filter = (message, censor = '*') => {
  const regex = `${badWordsConcat}`
  return message.replace(new RegExp(regex, 'gi'), (match, offset, whole) => Array(match.length + 1).join(censor))
}
module.exports = filter
