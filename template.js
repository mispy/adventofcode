const { _, log, ...aoc } = require('./dist/util')

/** @param {string} input */
function main(input) {
    const lines = aoc.linesTrim(input)
}

function runPuzzle(testCases, actual) {
    testCases.map(main)
    // main(actual)
}

const testCases = [
`
test
foo
`,
`
`,
`    
`
].map(t => t.trim()).filter(t => t.length)

const actual = `
`.trim()

runPuzzle(testCases, actual)