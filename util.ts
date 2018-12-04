const fastLevenshtein = require('fast-levenshtein')

function levenshtein(s1: string, s2: string) {
    return fastLevenshtein.get(s1, s2)
}

export { levenshtein } 