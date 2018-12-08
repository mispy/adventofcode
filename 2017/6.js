const { _, log, runSamples, ...aoc } = require('../dist/util')

/** @param {string[]} lines */
function main(lines) {
    blocks = aoc.ints(lines[0])
    log(blocks)
    let seen = new Set()
    let steps = 0
    while (true) {
        let i = blocks.indexOf(_.max(blocks))
        let n = blocks[i]
        blocks[i] = 0
        while (n > 0) {
            i++
            if (i >= blocks.length)
                i = 0

            blocks[i] += 1
            n -= 1
        }

        steps += 1

        let c = blocks.join(" ")
        log(c)
        if (c === lines[0])
            break
        else       
            seen.add(c)
    }

    log(steps)
}

runSamples(main, [
/*`
0 2 7 0
`,*/
//`5	1	10	0	1	7	13	14	3	12	8	10	7	12	0	6`,
`
1 1 14 13 12 11 10 9 8 7 7 5 5 3 3 0
`
])