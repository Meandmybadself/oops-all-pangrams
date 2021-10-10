const glob = require('glob')
const fs = require('fs')
const { uniq } = require('lodash')

const isEligibleWord = (word) =>
    word.length >= 7 &&
    word === word.toLowerCase() && // no uppercase
    !word.match(/[\W]/) && // no special characters
    getWordLetters(word).length == 7

const getWordLetters = word => uniq(word.split(''))

const wordLists = glob.sync('./input/*.txt').map(fileName => {
    console.log('fileName', fileName)
    return fs.readFileSync(fileName, 'utf8')
        .split('\n')
        .filter(isEligibleWord)
})

const combined = [...new Set([].concat(...wordLists))].sort()

fs.writeFileSync('../01-build/words.json', JSON.stringify(combined))