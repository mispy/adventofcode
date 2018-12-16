const { _, log, ...aoc } = require('./dist/util')

let regs = [0, 0, 0, 0]

function addr(l) {
    regs[l.c] = regs[l.a] + regs[l.b]
}

function addi(l) {
    regs[l.c] = regs[l.a] + l.b
}

function mulr(l) {
    regs[l.c] = regs[l.a] * regs[l.b]
}

function muli(l) {
    regs[l.c] = regs[l.a] * l.b
}

function banr(l) {
    regs[l.c] = regs[l.a] & regs[l.b]
}

function borr(l) {
    regs[l.c] = regs[l.a] | l.b
}

function bori(l) {
    regs[l.c] = regs[l.a] | regs[l.b]
}

function bani(l) {
    regs[l.c] = regs[l.a] & l.b
}

function setr(l) {
    regs[l.c] = regs[l.a]
}

function seti(l) {
    regs[l.c] = l.a
}

function gtir(l) {
    if (l.a > regs[l.b])
        regs[l.c] = 1 
    else
        regs[l.c] = 0
}

function gtri(l) {
    if (regs[l.a] > l.b)
        regs[l.c] = 1 
    else
        regs[l.c] = 0
}

function gtrr(l) {
    if (regs[l.a] > regs[l.b])
        regs[l.c] = 1 
    else
        regs[l.c] = 0
}

function eqir(l) {
    if (l.a === regs[l.b])
        regs[l.c] = 1 
    else
        regs[l.c] = 0
}

function eqri(l) {
    if (regs[l.a] === l.b)
        regs[l.c] = 1 
    else
        regs[l.c] = 0
}

function eqrr(l) {
    if (regs[l.a] === regs[l.b])
        regs[l.c] = 1 
    else
        regs[l.c] = 0
}

const ops = [addr, addi, mulr, muli, banr, bani, borr, bori, setr, seti, gtir, gtri, gtrr, eqir, eqri, eqrr]

function parse(l) {
    const [op, a, b, c] = aoc.ints(l)
    return { op, a, b, c}
}

/** @param {string} input */
function main(input) {
    const lines = aoc.linesTrim(input.split("\n\n\n")[0])
    let cases = []
    let lcase = null
    for (const line of lines) {
        if (!line.trim().length) continue

        if (line.match(/Before/)) {
            lcase = { before: aoc.ints(line) }
        } else if (line.match(/After/)) {
            lcase.after = aoc.ints(line)
            cases.push(lcase)
        } else {
            lcase.l = parse(line)
        }
    }

    const i2 = aoc.linesTrim(input.split("\n\n\n")[1])

    const pos = {}

    for (const c of cases) {
        const matches = ops.filter(op => {
            regs = _.clone(c.before)            
            op(c.l)
            return _.isEqual(regs, c.after)
        })
        let p = pos[c.l.op] || matches
        p = _.intersection(p, matches)
        pos[c.l.op] = p
        // if (matches.length >= 3) sum += 1
    }

    for (let i = 0; i < 10; i++) {
        for (const key in pos) {
            let p = pos[key]
            if (p.length === 1) continue
    
            for (const other of _.values(pos)) {
                if (other.length === 1)
                    p = p.filter(op => op !== other[0])                
            }
    
            for (const op of p) {
                if (_.values(pos).filter(other => other.includes(op)).length === 1) {
                    p = [op]
                    break
                }
            }
    
            pos[key] = p
        }    
    }

    regs = [0, 0, 0, 0]
    log(pos)
    for (const line of i2) {
        log(line)
        const l = parse(line)
        pos[l.op][0](l)
        log(regs[0])
    }
}

function runPuzzle(testCases, actual) {
    // testCases.map(main)
    main(actual)
}

const testCases = [
`
Before: [3, 2, 1, 1]
9 2 1 2
After:  [3, 2, 2, 1]
`,
`
`,
`    
`
].map(t => t.trim()).filter(t => t.length)

const actual = `
Before: [0, 1, 1, 0]
7 1 0 3
After:  [0, 1, 1, 1]

Before: [2, 3, 3, 0]
5 3 2 3
After:  [2, 3, 3, 2]

Before: [0, 2, 1, 3]
1 0 0 1
After:  [0, 0, 1, 3]

Before: [2, 3, 3, 2]
10 3 2 1
After:  [2, 4, 3, 2]

Before: [1, 1, 1, 3]
11 1 0 3
After:  [1, 1, 1, 1]

Before: [1, 1, 0, 2]
5 2 3 2
After:  [1, 1, 3, 2]

Before: [1, 0, 3, 2]
12 3 3 0
After:  [5, 0, 3, 2]

Before: [2, 1, 0, 3]
3 0 3 0
After:  [0, 1, 0, 3]

Before: [3, 2, 0, 0]
10 1 2 2
After:  [3, 2, 4, 0]

Before: [0, 0, 3, 2]
5 0 2 1
After:  [0, 2, 3, 2]

Before: [1, 2, 3, 3]
15 1 0 1
After:  [1, 1, 3, 3]

Before: [0, 1, 0, 2]
6 3 1 1
After:  [0, 3, 0, 2]

Before: [1, 0, 0, 0]
13 1 0 1
After:  [1, 1, 0, 0]

Before: [1, 1, 1, 1]
11 1 0 2
After:  [1, 1, 1, 1]

Before: [0, 1, 1, 0]
12 2 3 0
After:  [4, 1, 1, 0]

Before: [3, 3, 3, 1]
0 2 3 1
After:  [3, 0, 3, 1]

Before: [2, 0, 0, 1]
4 1 3 3
After:  [2, 0, 0, 1]

Before: [0, 3, 3, 2]
10 3 2 2
After:  [0, 3, 4, 2]

Before: [3, 1, 2, 0]
10 1 3 1
After:  [3, 3, 2, 0]

Before: [1, 2, 3, 1]
6 3 2 2
After:  [1, 2, 3, 1]

Before: [1, 0, 1, 2]
4 1 2 3
After:  [1, 0, 1, 1]

Before: [2, 0, 1, 0]
4 1 2 2
After:  [2, 0, 1, 0]

Before: [2, 1, 1, 3]
14 1 3 2
After:  [2, 1, 3, 3]

Before: [3, 2, 2, 1]
14 1 2 0
After:  [4, 2, 2, 1]

Before: [0, 1, 1, 1]
5 2 2 1
After:  [0, 3, 1, 1]

Before: [0, 0, 1, 0]
4 0 1 2
After:  [0, 0, 1, 0]

Before: [2, 2, 0, 3]
3 0 3 0
After:  [0, 2, 0, 3]

Before: [3, 0, 0, 1]
4 1 3 3
After:  [3, 0, 0, 1]

Before: [0, 0, 3, 3]
1 0 0 1
After:  [0, 0, 3, 3]

Before: [2, 0, 3, 2]
10 3 2 0
After:  [4, 0, 3, 2]

Before: [2, 2, 2, 2]
2 1 3 0
After:  [1, 2, 2, 2]

Before: [0, 1, 1, 0]
7 1 0 1
After:  [0, 1, 1, 0]

Before: [3, 0, 1, 2]
4 1 2 0
After:  [1, 0, 1, 2]

Before: [0, 2, 3, 3]
8 2 3 2
After:  [0, 2, 6, 3]

Before: [1, 1, 1, 1]
8 3 2 3
After:  [1, 1, 1, 2]

Before: [2, 3, 2, 0]
14 0 2 2
After:  [2, 3, 4, 0]

Before: [1, 1, 2, 0]
11 1 0 1
After:  [1, 1, 2, 0]

Before: [2, 0, 2, 3]
3 0 3 2
After:  [2, 0, 0, 3]

Before: [3, 0, 3, 3]
9 1 3 1
After:  [3, 3, 3, 3]

Before: [2, 2, 2, 2]
2 1 3 2
After:  [2, 2, 1, 2]

Before: [2, 0, 1, 2]
4 1 2 2
After:  [2, 0, 1, 2]

Before: [0, 1, 2, 1]
7 1 0 2
After:  [0, 1, 1, 1]

Before: [1, 0, 0, 1]
13 1 0 0
After:  [1, 0, 0, 1]

Before: [1, 0, 2, 3]
13 1 0 1
After:  [1, 1, 2, 3]

Before: [2, 1, 0, 2]
6 3 1 1
After:  [2, 3, 0, 2]

Before: [1, 0, 1, 2]
13 1 0 0
After:  [1, 0, 1, 2]

Before: [1, 2, 0, 3]
3 0 3 2
After:  [1, 2, 0, 3]

Before: [0, 1, 2, 3]
7 1 0 0
After:  [1, 1, 2, 3]

Before: [1, 2, 3, 2]
2 1 3 0
After:  [1, 2, 3, 2]

Before: [1, 0, 0, 2]
13 1 0 0
After:  [1, 0, 0, 2]

Before: [1, 3, 1, 3]
3 0 3 1
After:  [1, 0, 1, 3]

Before: [2, 0, 1, 2]
5 2 2 0
After:  [3, 0, 1, 2]

Before: [2, 3, 0, 3]
3 0 3 3
After:  [2, 3, 0, 0]

Before: [0, 2, 2, 2]
2 1 3 1
After:  [0, 1, 2, 2]

Before: [3, 0, 2, 3]
14 2 2 3
After:  [3, 0, 2, 4]

Before: [3, 1, 2, 1]
14 2 2 0
After:  [4, 1, 2, 1]

Before: [0, 1, 0, 1]
7 1 0 1
After:  [0, 1, 0, 1]

Before: [2, 1, 3, 1]
10 0 2 1
After:  [2, 4, 3, 1]

Before: [2, 1, 3, 3]
3 0 3 1
After:  [2, 0, 3, 3]

Before: [2, 2, 3, 3]
3 0 3 3
After:  [2, 2, 3, 0]

Before: [3, 2, 2, 1]
6 3 2 3
After:  [3, 2, 2, 3]

Before: [1, 2, 1, 1]
15 1 0 3
After:  [1, 2, 1, 1]

Before: [2, 2, 3, 0]
8 2 2 0
After:  [6, 2, 3, 0]

Before: [0, 2, 3, 3]
8 2 3 0
After:  [6, 2, 3, 3]

Before: [0, 1, 2, 1]
6 3 2 2
After:  [0, 1, 3, 1]

Before: [1, 2, 0, 3]
3 0 3 1
After:  [1, 0, 0, 3]

Before: [2, 3, 0, 3]
3 0 3 1
After:  [2, 0, 0, 3]

Before: [2, 2, 3, 2]
0 1 1 2
After:  [2, 2, 1, 2]

Before: [2, 2, 0, 1]
5 1 1 1
After:  [2, 3, 0, 1]

Before: [2, 0, 1, 0]
5 2 2 0
After:  [3, 0, 1, 0]

Before: [0, 0, 3, 0]
4 0 1 1
After:  [0, 1, 3, 0]

Before: [1, 1, 2, 2]
9 0 3 1
After:  [1, 3, 2, 2]

Before: [2, 2, 0, 3]
9 2 3 1
After:  [2, 3, 0, 3]

Before: [0, 1, 0, 3]
12 3 2 2
After:  [0, 1, 5, 3]

Before: [0, 0, 2, 2]
9 0 2 3
After:  [0, 0, 2, 2]

Before: [1, 3, 3, 0]
10 0 3 1
After:  [1, 3, 3, 0]

Before: [0, 2, 0, 1]
1 0 0 2
After:  [0, 2, 0, 1]

Before: [2, 0, 1, 3]
4 1 2 2
After:  [2, 0, 1, 3]

Before: [0, 3, 0, 2]
1 0 0 2
After:  [0, 3, 0, 2]

Before: [1, 1, 3, 2]
6 3 1 1
After:  [1, 3, 3, 2]

Before: [2, 1, 0, 2]
9 1 3 0
After:  [3, 1, 0, 2]

Before: [0, 3, 0, 0]
1 0 0 2
After:  [0, 3, 0, 0]

Before: [1, 1, 3, 2]
8 2 2 3
After:  [1, 1, 3, 6]

Before: [0, 2, 2, 0]
1 0 0 2
After:  [0, 2, 0, 0]

Before: [1, 0, 3, 1]
6 3 2 1
After:  [1, 3, 3, 1]

Before: [2, 1, 3, 3]
0 3 2 2
After:  [2, 1, 1, 3]

Before: [3, 0, 2, 1]
6 3 2 2
After:  [3, 0, 3, 1]

Before: [0, 1, 1, 3]
9 0 3 3
After:  [0, 1, 1, 3]

Before: [2, 2, 3, 1]
5 1 1 3
After:  [2, 2, 3, 3]

Before: [3, 0, 3, 3]
0 3 2 0
After:  [1, 0, 3, 3]

Before: [2, 0, 1, 3]
3 0 3 2
After:  [2, 0, 0, 3]

Before: [0, 0, 2, 1]
5 1 3 0
After:  [3, 0, 2, 1]

Before: [3, 3, 3, 2]
12 2 1 1
After:  [3, 4, 3, 2]

Before: [2, 1, 2, 2]
14 0 2 2
After:  [2, 1, 4, 2]

Before: [1, 1, 3, 1]
11 1 0 3
After:  [1, 1, 3, 1]

Before: [1, 0, 1, 2]
4 1 2 2
After:  [1, 0, 1, 2]

Before: [1, 2, 0, 0]
0 1 1 1
After:  [1, 1, 0, 0]

Before: [1, 0, 0, 1]
13 1 0 1
After:  [1, 1, 0, 1]

Before: [1, 3, 3, 2]
12 2 1 3
After:  [1, 3, 3, 4]

Before: [2, 2, 3, 0]
10 1 2 0
After:  [4, 2, 3, 0]

Before: [3, 1, 3, 2]
8 2 1 2
After:  [3, 1, 4, 2]

Before: [0, 2, 0, 1]
5 0 2 3
After:  [0, 2, 0, 2]

Before: [1, 1, 0, 2]
11 1 0 3
After:  [1, 1, 0, 1]

Before: [3, 0, 2, 2]
14 2 2 3
After:  [3, 0, 2, 4]

Before: [3, 1, 1, 2]
6 3 1 3
After:  [3, 1, 1, 3]

Before: [0, 0, 0, 3]
1 0 0 3
After:  [0, 0, 0, 0]

Before: [2, 2, 3, 0]
0 1 0 3
After:  [2, 2, 3, 1]

Before: [1, 2, 0, 0]
15 1 0 0
After:  [1, 2, 0, 0]

Before: [2, 0, 3, 1]
5 0 1 3
After:  [2, 0, 3, 3]

Before: [1, 0, 2, 2]
13 1 0 2
After:  [1, 0, 1, 2]

Before: [2, 2, 1, 1]
10 0 2 3
After:  [2, 2, 1, 4]

Before: [2, 3, 2, 3]
8 0 3 2
After:  [2, 3, 5, 3]

Before: [2, 1, 1, 1]
8 3 2 2
After:  [2, 1, 2, 1]

Before: [0, 0, 3, 1]
12 3 3 0
After:  [4, 0, 3, 1]

Before: [2, 1, 2, 1]
6 3 2 3
After:  [2, 1, 2, 3]

Before: [1, 1, 2, 3]
11 1 0 3
After:  [1, 1, 2, 1]

Before: [0, 3, 2, 3]
9 0 2 2
After:  [0, 3, 2, 3]

Before: [0, 1, 1, 2]
7 1 0 2
After:  [0, 1, 1, 2]

Before: [3, 2, 0, 3]
0 1 1 1
After:  [3, 1, 0, 3]

Before: [2, 3, 2, 3]
8 1 3 0
After:  [6, 3, 2, 3]

Before: [1, 2, 3, 3]
15 1 0 0
After:  [1, 2, 3, 3]

Before: [1, 0, 3, 1]
12 2 2 2
After:  [1, 0, 5, 1]

Before: [3, 2, 1, 1]
10 1 2 3
After:  [3, 2, 1, 4]

Before: [1, 1, 2, 1]
9 0 2 3
After:  [1, 1, 2, 3]

Before: [1, 0, 3, 1]
4 1 3 2
After:  [1, 0, 1, 1]

Before: [2, 2, 0, 2]
0 1 1 3
After:  [2, 2, 0, 1]

Before: [2, 1, 2, 3]
8 1 1 0
After:  [2, 1, 2, 3]

Before: [0, 2, 1, 2]
2 1 3 1
After:  [0, 1, 1, 2]

Before: [1, 0, 1, 1]
12 2 3 3
After:  [1, 0, 1, 4]

Before: [0, 3, 0, 3]
1 0 0 1
After:  [0, 0, 0, 3]

Before: [3, 0, 2, 3]
14 2 2 1
After:  [3, 4, 2, 3]

Before: [2, 1, 2, 1]
10 1 3 3
After:  [2, 1, 2, 3]

Before: [0, 1, 2, 2]
7 1 0 1
After:  [0, 1, 2, 2]

Before: [1, 0, 3, 1]
13 1 0 0
After:  [1, 0, 3, 1]

Before: [0, 1, 3, 2]
1 0 0 2
After:  [0, 1, 0, 2]

Before: [1, 1, 2, 0]
11 1 0 0
After:  [1, 1, 2, 0]

Before: [2, 2, 3, 0]
0 1 1 1
After:  [2, 1, 3, 0]

Before: [1, 0, 1, 0]
4 1 2 2
After:  [1, 0, 1, 0]

Before: [0, 1, 2, 1]
8 1 1 3
After:  [0, 1, 2, 2]

Before: [0, 1, 1, 1]
8 3 1 2
After:  [0, 1, 2, 1]

Before: [1, 0, 1, 2]
5 1 3 2
After:  [1, 0, 3, 2]

Before: [1, 3, 2, 3]
14 0 3 2
After:  [1, 3, 3, 3]

Before: [1, 1, 1, 3]
3 0 3 1
After:  [1, 0, 1, 3]

Before: [1, 3, 3, 3]
14 0 3 0
After:  [3, 3, 3, 3]

Before: [0, 2, 2, 3]
5 0 1 3
After:  [0, 2, 2, 1]

Before: [0, 1, 1, 1]
7 1 0 3
After:  [0, 1, 1, 1]

Before: [3, 1, 0, 3]
9 2 3 1
After:  [3, 3, 0, 3]

Before: [1, 1, 3, 3]
11 1 0 1
After:  [1, 1, 3, 3]

Before: [2, 1, 1, 3]
9 0 1 0
After:  [3, 1, 1, 3]

Before: [1, 1, 2, 3]
11 1 0 0
After:  [1, 1, 2, 3]

Before: [1, 1, 3, 3]
11 1 0 3
After:  [1, 1, 3, 1]

Before: [3, 0, 1, 1]
4 1 3 1
After:  [3, 1, 1, 1]

Before: [3, 2, 2, 0]
0 1 1 1
After:  [3, 1, 2, 0]

Before: [0, 1, 3, 0]
7 1 0 1
After:  [0, 1, 3, 0]

Before: [0, 1, 1, 1]
7 1 0 0
After:  [1, 1, 1, 1]

Before: [0, 2, 3, 0]
8 2 2 2
After:  [0, 2, 6, 0]

Before: [1, 0, 1, 1]
13 1 0 0
After:  [1, 0, 1, 1]

Before: [0, 1, 1, 2]
7 1 0 1
After:  [0, 1, 1, 2]

Before: [2, 1, 1, 3]
14 1 3 3
After:  [2, 1, 1, 3]

Before: [0, 2, 3, 2]
1 0 0 0
After:  [0, 2, 3, 2]

Before: [3, 0, 1, 3]
8 3 3 0
After:  [6, 0, 1, 3]

Before: [1, 1, 3, 0]
10 0 3 2
After:  [1, 1, 3, 0]

Before: [0, 1, 2, 3]
7 1 0 2
After:  [0, 1, 1, 3]

Before: [2, 0, 0, 3]
3 0 3 2
After:  [2, 0, 0, 3]

Before: [0, 1, 0, 0]
7 1 0 2
After:  [0, 1, 1, 0]

Before: [3, 1, 3, 3]
14 1 2 1
After:  [3, 3, 3, 3]

Before: [0, 3, 0, 1]
5 0 3 3
After:  [0, 3, 0, 3]

Before: [1, 2, 2, 2]
15 1 0 1
After:  [1, 1, 2, 2]

Before: [1, 1, 1, 0]
11 1 0 3
After:  [1, 1, 1, 1]

Before: [1, 2, 0, 3]
5 0 2 3
After:  [1, 2, 0, 3]

Before: [1, 2, 3, 0]
15 1 0 3
After:  [1, 2, 3, 1]

Before: [0, 1, 3, 3]
14 1 2 3
After:  [0, 1, 3, 3]

Before: [1, 1, 2, 3]
14 1 3 0
After:  [3, 1, 2, 3]

Before: [1, 0, 0, 0]
13 1 0 0
After:  [1, 0, 0, 0]

Before: [0, 2, 0, 1]
5 0 1 0
After:  [1, 2, 0, 1]

Before: [1, 2, 2, 2]
2 1 3 2
After:  [1, 2, 1, 2]

Before: [2, 1, 2, 3]
9 2 1 0
After:  [3, 1, 2, 3]

Before: [2, 2, 1, 3]
14 2 3 0
After:  [3, 2, 1, 3]

Before: [0, 3, 0, 3]
9 2 3 2
After:  [0, 3, 3, 3]

Before: [0, 1, 1, 1]
1 0 0 1
After:  [0, 0, 1, 1]

Before: [2, 0, 3, 1]
12 0 3 1
After:  [2, 5, 3, 1]

Before: [0, 1, 2, 3]
9 0 2 2
After:  [0, 1, 2, 3]

Before: [2, 2, 3, 2]
2 1 3 3
After:  [2, 2, 3, 1]

Before: [0, 2, 0, 2]
2 1 3 0
After:  [1, 2, 0, 2]

Before: [2, 2, 1, 3]
5 2 2 3
After:  [2, 2, 1, 3]

Before: [0, 1, 0, 2]
7 1 0 0
After:  [1, 1, 0, 2]

Before: [1, 0, 2, 2]
13 1 0 1
After:  [1, 1, 2, 2]

Before: [0, 0, 2, 0]
1 0 0 1
After:  [0, 0, 2, 0]

Before: [0, 0, 0, 2]
5 0 2 0
After:  [2, 0, 0, 2]

Before: [0, 1, 0, 2]
10 3 2 3
After:  [0, 1, 0, 4]

Before: [2, 3, 3, 1]
6 3 2 2
After:  [2, 3, 3, 1]

Before: [3, 2, 3, 2]
0 1 1 0
After:  [1, 2, 3, 2]

Before: [0, 1, 2, 2]
9 1 3 1
After:  [0, 3, 2, 2]

Before: [3, 1, 2, 1]
6 3 2 3
After:  [3, 1, 2, 3]

Before: [3, 3, 3, 2]
8 0 2 3
After:  [3, 3, 3, 6]

Before: [1, 1, 0, 1]
11 1 0 3
After:  [1, 1, 0, 1]

Before: [3, 2, 1, 1]
0 1 1 3
After:  [3, 2, 1, 1]

Before: [3, 0, 2, 3]
9 1 2 3
After:  [3, 0, 2, 2]

Before: [2, 3, 3, 3]
3 0 3 1
After:  [2, 0, 3, 3]

Before: [3, 0, 2, 1]
14 2 2 1
After:  [3, 4, 2, 1]

Before: [0, 0, 1, 3]
4 1 2 3
After:  [0, 0, 1, 1]

Before: [1, 0, 1, 2]
4 1 2 0
After:  [1, 0, 1, 2]

Before: [1, 3, 1, 1]
5 0 2 0
After:  [3, 3, 1, 1]

Before: [3, 2, 2, 2]
14 3 2 2
After:  [3, 2, 4, 2]

Before: [1, 0, 2, 1]
13 1 0 1
After:  [1, 1, 2, 1]

Before: [2, 2, 3, 3]
3 0 3 2
After:  [2, 2, 0, 3]

Before: [0, 0, 1, 3]
4 0 1 3
After:  [0, 0, 1, 1]

Before: [0, 3, 2, 1]
1 0 0 1
After:  [0, 0, 2, 1]

Before: [0, 0, 0, 0]
1 0 0 3
After:  [0, 0, 0, 0]

Before: [2, 3, 2, 3]
8 1 2 3
After:  [2, 3, 2, 5]

Before: [2, 0, 1, 3]
3 0 3 1
After:  [2, 0, 1, 3]

Before: [1, 3, 1, 3]
8 1 3 0
After:  [6, 3, 1, 3]

Before: [1, 0, 2, 0]
13 1 0 3
After:  [1, 0, 2, 1]

Before: [1, 2, 0, 3]
14 0 3 0
After:  [3, 2, 0, 3]

Before: [2, 2, 0, 3]
3 0 3 3
After:  [2, 2, 0, 0]

Before: [0, 2, 1, 3]
12 3 2 0
After:  [5, 2, 1, 3]

Before: [3, 2, 1, 2]
2 1 3 1
After:  [3, 1, 1, 2]

Before: [1, 2, 3, 3]
8 3 3 3
After:  [1, 2, 3, 6]

Before: [1, 2, 0, 2]
10 3 2 2
After:  [1, 2, 4, 2]

Before: [2, 2, 3, 3]
0 1 1 1
After:  [2, 1, 3, 3]

Before: [1, 0, 1, 3]
13 1 0 0
After:  [1, 0, 1, 3]

Before: [1, 0, 2, 3]
3 0 3 3
After:  [1, 0, 2, 0]

Before: [2, 2, 2, 1]
6 3 2 3
After:  [2, 2, 2, 3]

Before: [2, 0, 3, 2]
12 2 2 2
After:  [2, 0, 5, 2]

Before: [2, 2, 1, 1]
0 1 0 3
After:  [2, 2, 1, 1]

Before: [2, 1, 2, 3]
3 0 3 3
After:  [2, 1, 2, 0]

Before: [0, 1, 2, 0]
7 1 0 0
After:  [1, 1, 2, 0]

Before: [0, 2, 3, 2]
5 0 2 1
After:  [0, 2, 3, 2]

Before: [0, 0, 1, 0]
1 0 0 2
After:  [0, 0, 0, 0]

Before: [1, 0, 1, 1]
4 1 2 0
After:  [1, 0, 1, 1]

Before: [0, 0, 0, 2]
4 0 1 2
After:  [0, 0, 1, 2]

Before: [0, 2, 2, 2]
1 0 0 2
After:  [0, 2, 0, 2]

Before: [1, 0, 1, 3]
3 0 3 0
After:  [0, 0, 1, 3]

Before: [2, 2, 3, 1]
6 3 2 3
After:  [2, 2, 3, 3]

Before: [0, 1, 1, 3]
5 1 2 3
After:  [0, 1, 1, 3]

Before: [2, 1, 2, 0]
0 2 0 3
After:  [2, 1, 2, 1]

Before: [3, 2, 2, 3]
8 1 3 1
After:  [3, 5, 2, 3]

Before: [1, 1, 1, 2]
6 3 1 0
After:  [3, 1, 1, 2]

Before: [0, 0, 2, 3]
4 0 1 1
After:  [0, 1, 2, 3]

Before: [1, 2, 2, 1]
14 2 2 3
After:  [1, 2, 2, 4]

Before: [3, 1, 1, 1]
8 3 1 2
After:  [3, 1, 2, 1]

Before: [0, 2, 2, 3]
8 3 3 3
After:  [0, 2, 2, 6]

Before: [2, 0, 2, 1]
4 1 3 1
After:  [2, 1, 2, 1]

Before: [1, 2, 0, 2]
15 1 0 2
After:  [1, 2, 1, 2]

Before: [1, 0, 2, 0]
9 0 2 0
After:  [3, 0, 2, 0]

Before: [0, 2, 2, 3]
1 0 0 2
After:  [0, 2, 0, 3]

Before: [1, 1, 2, 0]
11 1 0 3
After:  [1, 1, 2, 1]

Before: [1, 2, 3, 1]
15 1 0 2
After:  [1, 2, 1, 1]

Before: [3, 2, 1, 3]
8 1 3 3
After:  [3, 2, 1, 5]

Before: [3, 0, 3, 1]
4 1 3 0
After:  [1, 0, 3, 1]

Before: [1, 1, 3, 3]
11 1 0 2
After:  [1, 1, 1, 3]

Before: [2, 3, 3, 3]
3 0 3 3
After:  [2, 3, 3, 0]

Before: [0, 1, 1, 0]
7 1 0 2
After:  [0, 1, 1, 0]

Before: [3, 1, 1, 0]
10 2 3 3
After:  [3, 1, 1, 3]

Before: [1, 1, 2, 1]
11 1 0 0
After:  [1, 1, 2, 1]

Before: [1, 2, 2, 3]
15 1 0 2
After:  [1, 2, 1, 3]

Before: [0, 1, 1, 1]
7 1 0 2
After:  [0, 1, 1, 1]

Before: [3, 2, 0, 1]
5 2 3 3
After:  [3, 2, 0, 3]

Before: [1, 3, 1, 2]
9 2 3 3
After:  [1, 3, 1, 3]

Before: [1, 0, 2, 0]
13 1 0 0
After:  [1, 0, 2, 0]

Before: [0, 2, 0, 2]
2 1 3 2
After:  [0, 2, 1, 2]

Before: [2, 3, 2, 1]
0 2 0 0
After:  [1, 3, 2, 1]

Before: [1, 3, 1, 3]
3 0 3 2
After:  [1, 3, 0, 3]

Before: [0, 1, 0, 2]
7 1 0 2
After:  [0, 1, 1, 2]

Before: [1, 2, 0, 2]
15 1 0 3
After:  [1, 2, 0, 1]

Before: [3, 3, 2, 1]
14 2 2 0
After:  [4, 3, 2, 1]

Before: [0, 0, 3, 1]
6 3 2 3
After:  [0, 0, 3, 3]

Before: [0, 1, 0, 0]
7 1 0 0
After:  [1, 1, 0, 0]

Before: [1, 1, 0, 3]
14 0 3 0
After:  [3, 1, 0, 3]

Before: [1, 3, 1, 0]
10 0 3 0
After:  [3, 3, 1, 0]

Before: [1, 1, 3, 3]
8 3 3 3
After:  [1, 1, 3, 6]

Before: [0, 0, 1, 3]
4 1 2 2
After:  [0, 0, 1, 3]

Before: [0, 2, 3, 1]
1 0 0 0
After:  [0, 2, 3, 1]

Before: [0, 0, 3, 3]
8 2 2 3
After:  [0, 0, 3, 6]

Before: [0, 1, 0, 3]
7 1 0 3
After:  [0, 1, 0, 1]

Before: [0, 1, 3, 2]
7 1 0 2
After:  [0, 1, 1, 2]

Before: [0, 1, 2, 0]
14 2 2 1
After:  [0, 4, 2, 0]

Before: [3, 1, 2, 1]
8 0 1 0
After:  [4, 1, 2, 1]

Before: [0, 1, 2, 1]
7 1 0 0
After:  [1, 1, 2, 1]

Before: [2, 2, 2, 3]
0 2 1 2
After:  [2, 2, 1, 3]

Before: [3, 1, 2, 0]
9 1 2 3
After:  [3, 1, 2, 3]

Before: [0, 1, 3, 1]
1 0 0 0
After:  [0, 1, 3, 1]

Before: [1, 0, 0, 3]
13 1 0 1
After:  [1, 1, 0, 3]

Before: [3, 3, 0, 1]
5 2 3 3
After:  [3, 3, 0, 3]

Before: [1, 0, 0, 2]
13 1 0 3
After:  [1, 0, 0, 1]

Before: [3, 2, 0, 3]
9 2 3 1
After:  [3, 3, 0, 3]

Before: [1, 1, 0, 2]
10 3 2 0
After:  [4, 1, 0, 2]

Before: [2, 1, 2, 1]
12 2 3 2
After:  [2, 1, 5, 1]

Before: [1, 2, 0, 1]
12 1 3 0
After:  [5, 2, 0, 1]

Before: [1, 0, 2, 1]
10 0 3 3
After:  [1, 0, 2, 3]

Before: [1, 2, 0, 1]
15 1 0 2
After:  [1, 2, 1, 1]

Before: [1, 1, 0, 2]
11 1 0 2
After:  [1, 1, 1, 2]

Before: [1, 1, 0, 2]
11 1 0 0
After:  [1, 1, 0, 2]

Before: [0, 1, 2, 1]
14 2 2 1
After:  [0, 4, 2, 1]

Before: [1, 1, 0, 1]
11 1 0 2
After:  [1, 1, 1, 1]

Before: [1, 0, 1, 3]
13 1 0 2
After:  [1, 0, 1, 3]

Before: [1, 0, 1, 0]
5 1 3 0
After:  [3, 0, 1, 0]

Before: [0, 2, 1, 2]
10 3 2 2
After:  [0, 2, 4, 2]

Before: [2, 2, 0, 2]
2 1 3 3
After:  [2, 2, 0, 1]

Before: [1, 0, 1, 3]
4 1 2 1
After:  [1, 1, 1, 3]

Before: [2, 3, 0, 3]
3 0 3 2
After:  [2, 3, 0, 3]

Before: [0, 1, 3, 2]
7 1 0 3
After:  [0, 1, 3, 1]

Before: [1, 1, 1, 2]
9 0 3 3
After:  [1, 1, 1, 3]

Before: [1, 2, 3, 3]
8 3 2 1
After:  [1, 6, 3, 3]

Before: [1, 2, 2, 3]
15 1 0 1
After:  [1, 1, 2, 3]

Before: [1, 1, 1, 3]
11 1 0 1
After:  [1, 1, 1, 3]

Before: [0, 1, 0, 1]
7 1 0 0
After:  [1, 1, 0, 1]

Before: [1, 1, 2, 0]
9 0 2 2
After:  [1, 1, 3, 0]

Before: [1, 2, 2, 1]
6 3 2 0
After:  [3, 2, 2, 1]

Before: [0, 2, 2, 1]
0 1 1 2
After:  [0, 2, 1, 1]

Before: [0, 2, 3, 2]
5 0 3 0
After:  [3, 2, 3, 2]

Before: [2, 2, 2, 3]
3 0 3 2
After:  [2, 2, 0, 3]

Before: [1, 0, 2, 1]
5 1 3 0
After:  [3, 0, 2, 1]

Before: [3, 3, 2, 0]
14 2 2 0
After:  [4, 3, 2, 0]

Before: [0, 2, 2, 3]
9 0 2 0
After:  [2, 2, 2, 3]

Before: [1, 1, 1, 0]
11 1 0 2
After:  [1, 1, 1, 0]

Before: [1, 2, 1, 0]
15 1 0 0
After:  [1, 2, 1, 0]

Before: [0, 1, 3, 3]
5 0 2 3
After:  [0, 1, 3, 2]

Before: [3, 0, 0, 3]
0 3 0 0
After:  [1, 0, 0, 3]

Before: [1, 0, 3, 2]
14 0 2 0
After:  [3, 0, 3, 2]

Before: [1, 3, 3, 1]
6 3 2 0
After:  [3, 3, 3, 1]

Before: [2, 1, 3, 0]
5 3 2 0
After:  [2, 1, 3, 0]

Before: [2, 2, 3, 3]
5 0 1 0
After:  [3, 2, 3, 3]

Before: [0, 0, 2, 3]
1 0 0 2
After:  [0, 0, 0, 3]

Before: [3, 3, 1, 3]
0 1 0 0
After:  [1, 3, 1, 3]

Before: [1, 2, 0, 2]
2 1 3 1
After:  [1, 1, 0, 2]

Before: [1, 2, 2, 0]
15 1 0 0
After:  [1, 2, 2, 0]

Before: [3, 2, 2, 2]
2 1 3 0
After:  [1, 2, 2, 2]

Before: [1, 0, 3, 2]
9 0 3 3
After:  [1, 0, 3, 3]

Before: [1, 1, 1, 3]
11 1 0 0
After:  [1, 1, 1, 3]

Before: [2, 1, 2, 3]
8 2 3 3
After:  [2, 1, 2, 5]

Before: [0, 1, 0, 2]
1 0 0 3
After:  [0, 1, 0, 0]

Before: [2, 1, 3, 0]
10 0 2 2
After:  [2, 1, 4, 0]

Before: [0, 1, 0, 1]
7 1 0 2
After:  [0, 1, 1, 1]

Before: [3, 0, 3, 1]
4 1 3 1
After:  [3, 1, 3, 1]

Before: [1, 1, 1, 2]
11 1 0 1
After:  [1, 1, 1, 2]

Before: [1, 1, 2, 3]
11 1 0 2
After:  [1, 1, 1, 3]

Before: [1, 1, 2, 1]
6 3 2 1
After:  [1, 3, 2, 1]

Before: [3, 0, 1, 0]
5 1 3 3
After:  [3, 0, 1, 3]

Before: [2, 1, 1, 3]
3 0 3 3
After:  [2, 1, 1, 0]

Before: [2, 1, 3, 3]
0 3 2 0
After:  [1, 1, 3, 3]

Before: [0, 1, 3, 0]
7 1 0 3
After:  [0, 1, 3, 1]

Before: [0, 0, 3, 0]
4 0 1 0
After:  [1, 0, 3, 0]

Before: [0, 1, 0, 3]
8 3 3 1
After:  [0, 6, 0, 3]

Before: [1, 2, 1, 3]
3 0 3 3
After:  [1, 2, 1, 0]

Before: [3, 1, 3, 3]
8 0 2 3
After:  [3, 1, 3, 6]

Before: [1, 2, 2, 0]
15 1 0 1
After:  [1, 1, 2, 0]

Before: [1, 0, 0, 1]
13 1 0 3
After:  [1, 0, 0, 1]

Before: [2, 1, 2, 3]
9 0 1 3
After:  [2, 1, 2, 3]

Before: [3, 2, 0, 2]
2 1 3 0
After:  [1, 2, 0, 2]

Before: [1, 2, 1, 0]
15 1 0 3
After:  [1, 2, 1, 1]

Before: [1, 2, 1, 0]
0 1 1 1
After:  [1, 1, 1, 0]

Before: [1, 2, 1, 3]
5 1 1 0
After:  [3, 2, 1, 3]

Before: [2, 0, 2, 3]
3 0 3 1
After:  [2, 0, 2, 3]

Before: [0, 0, 0, 1]
4 1 3 2
After:  [0, 0, 1, 1]

Before: [1, 2, 0, 2]
15 1 0 0
After:  [1, 2, 0, 2]

Before: [1, 2, 1, 0]
0 1 1 0
After:  [1, 2, 1, 0]

Before: [2, 3, 1, 3]
3 0 3 2
After:  [2, 3, 0, 3]

Before: [0, 3, 3, 1]
6 3 2 2
After:  [0, 3, 3, 1]

Before: [3, 2, 0, 2]
2 1 3 1
After:  [3, 1, 0, 2]

Before: [0, 1, 0, 3]
7 1 0 1
After:  [0, 1, 0, 3]

Before: [1, 0, 3, 3]
13 1 0 0
After:  [1, 0, 3, 3]

Before: [2, 1, 1, 3]
5 2 2 1
After:  [2, 3, 1, 3]

Before: [3, 1, 3, 2]
6 3 1 3
After:  [3, 1, 3, 3]

Before: [0, 2, 3, 2]
2 1 3 0
After:  [1, 2, 3, 2]

Before: [0, 1, 2, 2]
7 1 0 2
After:  [0, 1, 1, 2]

Before: [1, 0, 0, 3]
13 1 0 3
After:  [1, 0, 0, 1]

Before: [1, 2, 1, 2]
2 1 3 2
After:  [1, 2, 1, 2]

Before: [0, 3, 3, 2]
5 0 2 3
After:  [0, 3, 3, 2]

Before: [0, 2, 2, 2]
12 2 3 2
After:  [0, 2, 5, 2]

Before: [1, 2, 1, 3]
15 1 0 2
After:  [1, 2, 1, 3]

Before: [1, 1, 2, 1]
11 1 0 1
After:  [1, 1, 2, 1]

Before: [1, 2, 2, 3]
15 1 0 0
After:  [1, 2, 2, 3]

Before: [0, 1, 2, 2]
1 0 0 3
After:  [0, 1, 2, 0]

Before: [3, 0, 0, 2]
10 3 2 3
After:  [3, 0, 0, 4]

Before: [1, 1, 1, 1]
10 2 3 2
After:  [1, 1, 3, 1]

Before: [1, 2, 2, 2]
2 1 3 3
After:  [1, 2, 2, 1]

Before: [2, 2, 2, 0]
14 0 2 3
After:  [2, 2, 2, 4]

Before: [1, 0, 3, 1]
6 3 2 2
After:  [1, 0, 3, 1]

Before: [3, 3, 3, 0]
0 1 2 0
After:  [1, 3, 3, 0]

Before: [2, 0, 2, 0]
14 0 2 2
After:  [2, 0, 4, 0]

Before: [0, 0, 1, 2]
5 1 3 3
After:  [0, 0, 1, 3]

Before: [1, 3, 2, 2]
14 2 2 2
After:  [1, 3, 4, 2]

Before: [2, 0, 0, 1]
4 1 3 1
After:  [2, 1, 0, 1]

Before: [1, 1, 3, 2]
11 1 0 2
After:  [1, 1, 1, 2]

Before: [1, 1, 1, 1]
11 1 0 3
After:  [1, 1, 1, 1]

Before: [1, 0, 3, 2]
13 1 0 2
After:  [1, 0, 1, 2]

Before: [0, 1, 2, 2]
6 3 1 0
After:  [3, 1, 2, 2]

Before: [2, 1, 1, 1]
10 1 3 1
After:  [2, 3, 1, 1]

Before: [2, 1, 1, 3]
3 0 3 2
After:  [2, 1, 0, 3]

Before: [2, 0, 3, 3]
3 0 3 3
After:  [2, 0, 3, 0]

Before: [2, 2, 3, 1]
6 3 2 0
After:  [3, 2, 3, 1]

Before: [2, 0, 3, 1]
6 3 2 0
After:  [3, 0, 3, 1]

Before: [1, 2, 3, 3]
3 0 3 3
After:  [1, 2, 3, 0]

Before: [1, 1, 1, 0]
11 1 0 0
After:  [1, 1, 1, 0]

Before: [0, 0, 2, 2]
1 0 0 0
After:  [0, 0, 2, 2]

Before: [3, 1, 2, 2]
14 2 2 2
After:  [3, 1, 4, 2]

Before: [1, 3, 1, 0]
5 0 2 0
After:  [3, 3, 1, 0]

Before: [3, 1, 0, 2]
6 3 1 3
After:  [3, 1, 0, 3]

Before: [3, 2, 3, 1]
12 0 3 2
After:  [3, 2, 6, 1]

Before: [0, 2, 0, 1]
0 1 1 0
After:  [1, 2, 0, 1]

Before: [2, 1, 1, 3]
3 0 3 0
After:  [0, 1, 1, 3]

Before: [0, 2, 1, 1]
5 0 3 0
After:  [3, 2, 1, 1]

Before: [2, 0, 1, 3]
4 1 2 3
After:  [2, 0, 1, 1]

Before: [0, 1, 3, 0]
7 1 0 2
After:  [0, 1, 1, 0]

Before: [3, 2, 3, 2]
2 1 3 1
After:  [3, 1, 3, 2]

Before: [1, 0, 0, 3]
9 1 3 3
After:  [1, 0, 0, 3]

Before: [0, 1, 2, 3]
7 1 0 3
After:  [0, 1, 2, 1]

Before: [0, 1, 1, 3]
7 1 0 0
After:  [1, 1, 1, 3]

Before: [2, 2, 2, 2]
2 1 3 1
After:  [2, 1, 2, 2]

Before: [0, 1, 0, 1]
1 0 0 1
After:  [0, 0, 0, 1]

Before: [3, 0, 2, 1]
6 3 2 1
After:  [3, 3, 2, 1]

Before: [2, 1, 1, 3]
8 2 3 3
After:  [2, 1, 1, 4]

Before: [2, 1, 1, 1]
8 3 2 3
After:  [2, 1, 1, 2]

Before: [1, 0, 3, 3]
13 1 0 1
After:  [1, 1, 3, 3]

Before: [1, 2, 3, 2]
2 1 3 2
After:  [1, 2, 1, 2]

Before: [1, 0, 2, 3]
13 1 0 2
After:  [1, 0, 1, 3]

Before: [2, 2, 3, 2]
2 1 3 2
After:  [2, 2, 1, 2]

Before: [0, 0, 2, 3]
1 0 0 3
After:  [0, 0, 2, 0]

Before: [1, 0, 3, 2]
5 1 2 0
After:  [2, 0, 3, 2]

Before: [1, 2, 2, 1]
15 1 0 1
After:  [1, 1, 2, 1]

Before: [2, 1, 0, 2]
9 0 1 1
After:  [2, 3, 0, 2]

Before: [0, 1, 1, 3]
7 1 0 3
After:  [0, 1, 1, 1]

Before: [0, 0, 2, 0]
4 0 1 3
After:  [0, 0, 2, 1]

Before: [1, 0, 3, 3]
12 2 2 1
After:  [1, 5, 3, 3]

Before: [3, 3, 2, 2]
14 2 2 3
After:  [3, 3, 2, 4]

Before: [1, 3, 2, 2]
9 0 3 2
After:  [1, 3, 3, 2]

Before: [2, 1, 3, 1]
8 1 1 0
After:  [2, 1, 3, 1]

Before: [3, 0, 1, 1]
4 1 3 3
After:  [3, 0, 1, 1]

Before: [3, 2, 3, 2]
2 1 3 2
After:  [3, 2, 1, 2]

Before: [2, 2, 0, 0]
10 1 2 2
After:  [2, 2, 4, 0]

Before: [1, 2, 1, 2]
15 1 0 0
After:  [1, 2, 1, 2]

Before: [0, 0, 1, 1]
5 0 3 3
After:  [0, 0, 1, 3]

Before: [0, 1, 2, 2]
7 1 0 3
After:  [0, 1, 2, 1]

Before: [0, 1, 2, 1]
1 0 0 2
After:  [0, 1, 0, 1]

Before: [1, 0, 1, 1]
13 1 0 1
After:  [1, 1, 1, 1]

Before: [0, 3, 1, 3]
5 0 1 0
After:  [1, 3, 1, 3]

Before: [0, 1, 3, 1]
8 2 1 1
After:  [0, 4, 3, 1]

Before: [0, 1, 2, 3]
9 0 1 3
After:  [0, 1, 2, 1]

Before: [0, 1, 0, 3]
7 1 0 0
After:  [1, 1, 0, 3]

Before: [2, 3, 0, 0]
10 0 2 3
After:  [2, 3, 0, 4]

Before: [2, 1, 2, 2]
6 3 1 1
After:  [2, 3, 2, 2]

Before: [0, 1, 2, 3]
7 1 0 1
After:  [0, 1, 2, 3]

Before: [1, 0, 1, 1]
13 1 0 3
After:  [1, 0, 1, 1]

Before: [1, 0, 0, 3]
3 0 3 2
After:  [1, 0, 0, 3]

Before: [0, 2, 2, 3]
8 3 2 0
After:  [5, 2, 2, 3]

Before: [3, 2, 0, 2]
2 1 3 3
After:  [3, 2, 0, 1]

Before: [3, 2, 1, 2]
2 1 3 3
After:  [3, 2, 1, 1]

Before: [0, 0, 3, 1]
8 2 2 3
After:  [0, 0, 3, 6]

Before: [1, 3, 2, 1]
6 3 2 3
After:  [1, 3, 2, 3]

Before: [2, 2, 1, 1]
10 1 2 1
After:  [2, 4, 1, 1]

Before: [0, 2, 3, 2]
12 3 3 1
After:  [0, 5, 3, 2]

Before: [0, 0, 1, 2]
10 3 2 2
After:  [0, 0, 4, 2]

Before: [0, 0, 2, 1]
12 3 1 2
After:  [0, 0, 2, 1]

Before: [3, 2, 2, 2]
2 1 3 2
After:  [3, 2, 1, 2]

Before: [2, 0, 1, 3]
4 1 2 1
After:  [2, 1, 1, 3]

Before: [3, 3, 0, 3]
8 3 3 3
After:  [3, 3, 0, 6]

Before: [3, 2, 3, 3]
8 2 3 3
After:  [3, 2, 3, 6]

Before: [2, 1, 0, 3]
14 1 3 3
After:  [2, 1, 0, 3]

Before: [0, 1, 2, 2]
6 3 1 1
After:  [0, 3, 2, 2]

Before: [3, 1, 1, 1]
12 3 3 0
After:  [4, 1, 1, 1]

Before: [0, 3, 1, 1]
1 0 0 2
After:  [0, 3, 0, 1]

Before: [1, 2, 0, 3]
14 0 3 2
After:  [1, 2, 3, 3]

Before: [2, 1, 3, 1]
9 0 1 1
After:  [2, 3, 3, 1]

Before: [1, 2, 0, 2]
2 1 3 0
After:  [1, 2, 0, 2]

Before: [0, 1, 0, 3]
8 1 1 3
After:  [0, 1, 0, 2]

Before: [0, 0, 1, 2]
4 0 1 2
After:  [0, 0, 1, 2]

Before: [0, 1, 2, 2]
14 2 2 0
After:  [4, 1, 2, 2]

Before: [0, 2, 0, 2]
2 1 3 1
After:  [0, 1, 0, 2]

Before: [2, 0, 2, 3]
9 1 2 0
After:  [2, 0, 2, 3]

Before: [1, 2, 0, 2]
2 1 3 3
After:  [1, 2, 0, 1]

Before: [1, 0, 1, 0]
13 1 0 3
After:  [1, 0, 1, 1]

Before: [1, 2, 2, 0]
15 1 0 2
After:  [1, 2, 1, 0]

Before: [0, 0, 2, 1]
1 0 0 1
After:  [0, 0, 2, 1]

Before: [3, 2, 3, 3]
0 1 1 0
After:  [1, 2, 3, 3]

Before: [2, 2, 2, 2]
0 2 1 0
After:  [1, 2, 2, 2]

Before: [0, 1, 0, 0]
7 1 0 3
After:  [0, 1, 0, 1]

Before: [0, 3, 2, 0]
1 0 0 1
After:  [0, 0, 2, 0]

Before: [1, 1, 3, 3]
3 0 3 2
After:  [1, 1, 0, 3]

Before: [0, 1, 2, 0]
7 1 0 1
After:  [0, 1, 2, 0]

Before: [1, 0, 1, 0]
13 1 0 0
After:  [1, 0, 1, 0]

Before: [0, 1, 1, 2]
7 1 0 3
After:  [0, 1, 1, 1]

Before: [0, 1, 3, 1]
1 0 0 1
After:  [0, 0, 3, 1]

Before: [1, 0, 3, 3]
13 1 0 2
After:  [1, 0, 1, 3]

Before: [0, 1, 3, 3]
7 1 0 1
After:  [0, 1, 3, 3]

Before: [0, 2, 0, 2]
0 1 1 3
After:  [0, 2, 0, 1]

Before: [1, 3, 2, 0]
9 0 2 1
After:  [1, 3, 2, 0]

Before: [3, 3, 0, 3]
12 1 1 2
After:  [3, 3, 4, 3]

Before: [1, 1, 0, 0]
11 1 0 2
After:  [1, 1, 1, 0]

Before: [0, 0, 2, 2]
4 0 1 3
After:  [0, 0, 2, 1]

Before: [1, 1, 0, 0]
11 1 0 1
After:  [1, 1, 0, 0]

Before: [1, 0, 2, 1]
6 3 2 1
After:  [1, 3, 2, 1]

Before: [1, 1, 3, 1]
6 3 2 2
After:  [1, 1, 3, 1]

Before: [1, 0, 3, 0]
13 1 0 2
After:  [1, 0, 1, 0]

Before: [2, 1, 2, 3]
14 0 2 2
After:  [2, 1, 4, 3]

Before: [1, 2, 1, 2]
10 3 2 0
After:  [4, 2, 1, 2]

Before: [0, 1, 0, 2]
7 1 0 1
After:  [0, 1, 0, 2]

Before: [3, 2, 1, 2]
12 0 1 1
After:  [3, 4, 1, 2]

Before: [1, 2, 3, 2]
15 1 0 2
After:  [1, 2, 1, 2]

Before: [2, 2, 1, 2]
12 2 3 3
After:  [2, 2, 1, 4]

Before: [1, 1, 1, 2]
11 1 0 3
After:  [1, 1, 1, 1]

Before: [1, 0, 3, 3]
3 0 3 3
After:  [1, 0, 3, 0]

Before: [3, 0, 2, 3]
0 3 0 1
After:  [3, 1, 2, 3]

Before: [3, 1, 0, 3]
12 0 2 1
After:  [3, 5, 0, 3]

Before: [0, 1, 2, 1]
7 1 0 1
After:  [0, 1, 2, 1]

Before: [1, 0, 3, 1]
13 1 0 2
After:  [1, 0, 1, 1]

Before: [2, 2, 3, 3]
3 0 3 1
After:  [2, 0, 3, 3]

Before: [0, 1, 2, 1]
1 0 0 0
After:  [0, 1, 2, 1]

Before: [3, 3, 1, 2]
10 3 2 2
After:  [3, 3, 4, 2]

Before: [3, 3, 0, 2]
10 3 2 2
After:  [3, 3, 4, 2]

Before: [0, 3, 3, 0]
5 3 2 0
After:  [2, 3, 3, 0]

Before: [2, 3, 1, 2]
10 3 2 3
After:  [2, 3, 1, 4]

Before: [0, 2, 3, 3]
10 1 2 2
After:  [0, 2, 4, 3]

Before: [1, 0, 0, 2]
13 1 0 1
After:  [1, 1, 0, 2]

Before: [1, 2, 0, 3]
15 1 0 3
After:  [1, 2, 0, 1]

Before: [2, 1, 1, 0]
10 1 3 3
After:  [2, 1, 1, 3]

Before: [1, 1, 2, 2]
11 1 0 0
After:  [1, 1, 2, 2]

Before: [1, 0, 1, 0]
13 1 0 2
After:  [1, 0, 1, 0]

Before: [0, 1, 2, 3]
1 0 0 2
After:  [0, 1, 0, 3]

Before: [2, 3, 1, 0]
10 2 3 0
After:  [3, 3, 1, 0]

Before: [3, 1, 2, 1]
6 3 2 1
After:  [3, 3, 2, 1]

Before: [1, 2, 3, 0]
15 1 0 1
After:  [1, 1, 3, 0]

Before: [1, 1, 2, 0]
9 1 2 2
After:  [1, 1, 3, 0]

Before: [1, 0, 0, 3]
12 0 1 1
After:  [1, 2, 0, 3]

Before: [2, 3, 2, 3]
14 2 2 2
After:  [2, 3, 4, 3]

Before: [0, 0, 0, 2]
4 0 1 0
After:  [1, 0, 0, 2]

Before: [0, 0, 2, 0]
4 0 1 0
After:  [1, 0, 2, 0]

Before: [0, 1, 3, 1]
7 1 0 0
After:  [1, 1, 3, 1]

Before: [2, 0, 3, 0]
5 1 3 2
After:  [2, 0, 3, 0]

Before: [3, 1, 2, 2]
6 3 1 0
After:  [3, 1, 2, 2]

Before: [1, 2, 3, 1]
15 1 0 3
After:  [1, 2, 3, 1]

Before: [1, 2, 0, 2]
10 1 2 1
After:  [1, 4, 0, 2]

Before: [3, 0, 0, 3]
9 2 3 1
After:  [3, 3, 0, 3]

Before: [1, 3, 3, 3]
0 3 2 0
After:  [1, 3, 3, 3]

Before: [1, 2, 1, 2]
15 1 0 2
After:  [1, 2, 1, 2]

Before: [3, 1, 2, 3]
9 1 2 2
After:  [3, 1, 3, 3]

Before: [1, 1, 0, 3]
14 1 3 3
After:  [1, 1, 0, 3]

Before: [1, 0, 2, 2]
13 1 0 0
After:  [1, 0, 2, 2]

Before: [0, 2, 0, 2]
1 0 0 0
After:  [0, 2, 0, 2]

Before: [0, 1, 3, 3]
7 1 0 2
After:  [0, 1, 1, 3]

Before: [1, 3, 3, 3]
14 0 3 1
After:  [1, 3, 3, 3]

Before: [1, 1, 3, 2]
6 3 1 2
After:  [1, 1, 3, 2]

Before: [3, 1, 2, 3]
8 3 1 3
After:  [3, 1, 2, 4]

Before: [2, 1, 2, 0]
9 0 1 2
After:  [2, 1, 3, 0]

Before: [1, 0, 3, 0]
13 1 0 1
After:  [1, 1, 3, 0]

Before: [2, 1, 3, 3]
14 1 2 3
After:  [2, 1, 3, 3]

Before: [3, 2, 2, 2]
14 1 2 2
After:  [3, 2, 4, 2]

Before: [1, 0, 1, 3]
13 1 0 1
After:  [1, 1, 1, 3]

Before: [2, 3, 1, 1]
10 0 2 0
After:  [4, 3, 1, 1]

Before: [2, 0, 2, 3]
14 0 2 2
After:  [2, 0, 4, 3]

Before: [0, 2, 3, 1]
5 0 3 0
After:  [3, 2, 3, 1]

Before: [1, 1, 3, 0]
11 1 0 1
After:  [1, 1, 3, 0]

Before: [1, 1, 3, 3]
14 0 3 1
After:  [1, 3, 3, 3]

Before: [1, 3, 1, 2]
9 0 3 2
After:  [1, 3, 3, 2]

Before: [2, 1, 3, 1]
6 3 2 3
After:  [2, 1, 3, 3]

Before: [3, 1, 1, 3]
0 3 0 2
After:  [3, 1, 1, 3]

Before: [1, 0, 2, 1]
13 1 0 3
After:  [1, 0, 2, 1]

Before: [0, 1, 1, 3]
1 0 0 3
After:  [0, 1, 1, 0]

Before: [1, 1, 3, 3]
14 1 3 2
After:  [1, 1, 3, 3]

Before: [1, 0, 3, 2]
13 1 0 3
After:  [1, 0, 3, 1]

Before: [1, 1, 2, 2]
11 1 0 2
After:  [1, 1, 1, 2]

Before: [1, 0, 0, 3]
13 1 0 2
After:  [1, 0, 1, 3]

Before: [1, 1, 0, 0]
12 0 3 2
After:  [1, 1, 4, 0]

Before: [0, 3, 2, 1]
5 0 1 3
After:  [0, 3, 2, 1]

Before: [3, 0, 0, 2]
10 3 2 1
After:  [3, 4, 0, 2]

Before: [2, 2, 3, 2]
2 1 3 1
After:  [2, 1, 3, 2]

Before: [1, 2, 1, 2]
2 1 3 0
After:  [1, 2, 1, 2]

Before: [0, 1, 3, 2]
7 1 0 1
After:  [0, 1, 3, 2]

Before: [0, 1, 3, 0]
7 1 0 0
After:  [1, 1, 3, 0]

Before: [1, 2, 2, 3]
3 0 3 2
After:  [1, 2, 0, 3]

Before: [0, 0, 2, 1]
4 1 3 3
After:  [0, 0, 2, 1]

Before: [2, 3, 2, 0]
0 2 0 2
After:  [2, 3, 1, 0]

Before: [1, 1, 3, 2]
11 1 0 1
After:  [1, 1, 3, 2]

Before: [0, 3, 1, 3]
1 0 0 0
After:  [0, 3, 1, 3]

Before: [1, 2, 3, 3]
3 0 3 0
After:  [0, 2, 3, 3]

Before: [1, 1, 0, 0]
11 1 0 3
After:  [1, 1, 0, 1]

Before: [0, 1, 1, 1]
10 1 3 3
After:  [0, 1, 1, 3]

Before: [1, 0, 3, 3]
13 1 0 3
After:  [1, 0, 3, 1]

Before: [0, 1, 1, 2]
9 0 1 2
After:  [0, 1, 1, 2]

Before: [2, 2, 2, 3]
0 1 0 3
After:  [2, 2, 2, 1]

Before: [1, 1, 2, 2]
8 0 1 3
After:  [1, 1, 2, 2]

Before: [3, 2, 3, 2]
0 1 1 1
After:  [3, 1, 3, 2]

Before: [2, 3, 1, 3]
3 0 3 1
After:  [2, 0, 1, 3]

Before: [0, 0, 1, 1]
4 0 1 0
After:  [1, 0, 1, 1]

Before: [1, 0, 3, 1]
12 2 2 1
After:  [1, 5, 3, 1]

Before: [2, 3, 2, 2]
14 3 2 1
After:  [2, 4, 2, 2]

Before: [0, 2, 0, 2]
1 0 0 3
After:  [0, 2, 0, 0]

Before: [0, 2, 2, 2]
2 1 3 0
After:  [1, 2, 2, 2]

Before: [0, 1, 2, 0]
7 1 0 3
After:  [0, 1, 2, 1]

Before: [1, 0, 1, 1]
4 1 3 2
After:  [1, 0, 1, 1]

Before: [1, 2, 2, 2]
2 1 3 0
After:  [1, 2, 2, 2]

Before: [1, 2, 2, 0]
15 1 0 3
After:  [1, 2, 2, 1]

Before: [1, 0, 2, 3]
13 1 0 3
After:  [1, 0, 2, 1]

Before: [2, 1, 2, 3]
3 0 3 1
After:  [2, 0, 2, 3]

Before: [0, 3, 1, 0]
5 0 3 2
After:  [0, 3, 3, 0]

Before: [2, 0, 3, 3]
12 2 1 0
After:  [4, 0, 3, 3]

Before: [1, 1, 2, 0]
11 1 0 2
After:  [1, 1, 1, 0]

Before: [0, 1, 2, 1]
7 1 0 3
After:  [0, 1, 2, 1]

Before: [0, 3, 3, 3]
1 0 0 3
After:  [0, 3, 3, 0]

Before: [0, 0, 0, 1]
4 0 1 0
After:  [1, 0, 0, 1]

Before: [1, 1, 1, 3]
14 2 3 1
After:  [1, 3, 1, 3]

Before: [1, 1, 1, 1]
10 1 3 1
After:  [1, 3, 1, 1]

Before: [1, 1, 1, 3]
11 1 0 2
After:  [1, 1, 1, 3]

Before: [1, 1, 2, 1]
14 2 2 2
After:  [1, 1, 4, 1]

Before: [2, 2, 1, 2]
2 1 3 0
After:  [1, 2, 1, 2]

Before: [1, 1, 1, 2]
11 1 0 2
After:  [1, 1, 1, 2]

Before: [1, 2, 3, 2]
15 1 0 3
After:  [1, 2, 3, 1]

Before: [0, 1, 3, 2]
5 0 3 1
After:  [0, 3, 3, 2]

Before: [0, 1, 3, 0]
5 3 2 0
After:  [2, 1, 3, 0]

Before: [3, 2, 0, 1]
12 3 3 0
After:  [4, 2, 0, 1]

Before: [2, 2, 0, 2]
2 1 3 1
After:  [2, 1, 0, 2]

Before: [1, 2, 1, 2]
2 1 3 1
After:  [1, 1, 1, 2]

Before: [2, 0, 2, 2]
14 0 2 0
After:  [4, 0, 2, 2]

Before: [3, 1, 2, 3]
14 2 2 3
After:  [3, 1, 2, 4]

Before: [3, 0, 3, 1]
6 3 2 1
After:  [3, 3, 3, 1]

Before: [0, 1, 1, 1]
7 1 0 1
After:  [0, 1, 1, 1]

Before: [0, 2, 3, 0]
1 0 0 1
After:  [0, 0, 3, 0]

Before: [0, 1, 2, 0]
9 3 2 2
After:  [0, 1, 2, 0]

Before: [0, 1, 3, 1]
1 0 0 2
After:  [0, 1, 0, 1]

Before: [3, 0, 2, 1]
6 3 2 3
After:  [3, 0, 2, 3]

Before: [0, 2, 3, 1]
6 3 2 0
After:  [3, 2, 3, 1]

Before: [1, 2, 0, 1]
15 1 0 0
After:  [1, 2, 0, 1]

Before: [1, 0, 3, 0]
5 1 3 1
After:  [1, 3, 3, 0]

Before: [1, 3, 3, 2]
14 0 2 1
After:  [1, 3, 3, 2]

Before: [0, 0, 1, 0]
1 0 0 1
After:  [0, 0, 1, 0]

Before: [1, 1, 2, 3]
9 1 2 3
After:  [1, 1, 2, 3]

Before: [0, 1, 2, 1]
6 3 2 1
After:  [0, 3, 2, 1]

Before: [0, 1, 3, 3]
9 0 1 2
After:  [0, 1, 1, 3]

Before: [3, 0, 1, 0]
4 1 2 2
After:  [3, 0, 1, 0]

Before: [1, 1, 2, 2]
11 1 0 1
After:  [1, 1, 2, 2]

Before: [1, 0, 0, 2]
13 1 0 2
After:  [1, 0, 1, 2]

Before: [1, 2, 1, 1]
10 0 3 0
After:  [3, 2, 1, 1]

Before: [3, 0, 0, 1]
4 1 3 1
After:  [3, 1, 0, 1]

Before: [1, 2, 3, 2]
15 1 0 0
After:  [1, 2, 3, 2]

Before: [3, 1, 3, 1]
12 2 3 0
After:  [6, 1, 3, 1]

Before: [1, 1, 0, 3]
3 0 3 2
After:  [1, 1, 0, 3]

Before: [1, 0, 2, 1]
6 3 2 3
After:  [1, 0, 2, 3]

Before: [1, 1, 0, 3]
8 3 3 1
After:  [1, 6, 0, 3]

Before: [1, 2, 2, 1]
12 3 3 1
After:  [1, 4, 2, 1]

Before: [0, 3, 3, 0]
1 0 0 1
After:  [0, 0, 3, 0]

Before: [1, 2, 1, 1]
15 1 0 0
After:  [1, 2, 1, 1]

Before: [0, 3, 3, 2]
5 0 2 2
After:  [0, 3, 2, 2]

Before: [2, 2, 1, 2]
2 1 3 3
After:  [2, 2, 1, 1]

Before: [1, 0, 2, 1]
4 1 3 0
After:  [1, 0, 2, 1]

Before: [0, 3, 0, 2]
10 3 2 2
After:  [0, 3, 4, 2]

Before: [1, 1, 3, 1]
11 1 0 2
After:  [1, 1, 1, 1]

Before: [1, 2, 2, 3]
0 1 1 3
After:  [1, 2, 2, 1]

Before: [1, 1, 2, 2]
11 1 0 3
After:  [1, 1, 2, 1]

Before: [1, 2, 2, 3]
14 0 3 1
After:  [1, 3, 2, 3]

Before: [1, 1, 1, 1]
11 1 0 0
After:  [1, 1, 1, 1]

Before: [0, 0, 1, 1]
1 0 0 1
After:  [0, 0, 1, 1]

Before: [0, 1, 0, 0]
7 1 0 1
After:  [0, 1, 0, 0]

Before: [1, 0, 1, 3]
14 0 3 2
After:  [1, 0, 3, 3]

Before: [3, 0, 1, 3]
14 2 3 1
After:  [3, 3, 1, 3]

Before: [0, 3, 3, 2]
1 0 0 2
After:  [0, 3, 0, 2]

Before: [0, 2, 1, 0]
5 3 2 1
After:  [0, 2, 1, 0]

Before: [1, 2, 3, 2]
15 1 0 1
After:  [1, 1, 3, 2]

Before: [0, 0, 1, 1]
4 1 3 2
After:  [0, 0, 1, 1]

Before: [0, 2, 2, 2]
2 1 3 3
After:  [0, 2, 2, 1]

Before: [0, 1, 1, 3]
7 1 0 2
After:  [0, 1, 1, 3]

Before: [1, 0, 2, 0]
13 1 0 1
After:  [1, 1, 2, 0]

Before: [1, 0, 0, 0]
13 1 0 3
After:  [1, 0, 0, 1]

Before: [3, 1, 2, 3]
9 2 1 2
After:  [3, 1, 3, 3]

Before: [1, 3, 2, 2]
14 2 2 1
After:  [1, 4, 2, 2]

Before: [2, 2, 3, 1]
12 1 3 3
After:  [2, 2, 3, 5]

Before: [3, 3, 0, 0]
0 1 0 1
After:  [3, 1, 0, 0]

Before: [2, 0, 1, 1]
10 0 2 2
After:  [2, 0, 4, 1]

Before: [0, 0, 2, 0]
14 2 2 0
After:  [4, 0, 2, 0]

Before: [2, 1, 3, 3]
3 0 3 0
After:  [0, 1, 3, 3]

Before: [0, 2, 3, 2]
0 1 1 1
After:  [0, 1, 3, 2]

Before: [2, 0, 3, 2]
8 2 2 3
After:  [2, 0, 3, 6]

Before: [1, 2, 0, 0]
15 1 0 3
After:  [1, 2, 0, 1]

Before: [1, 2, 1, 0]
5 1 1 3
After:  [1, 2, 1, 3]

Before: [0, 1, 2, 0]
7 1 0 2
After:  [0, 1, 1, 0]

Before: [2, 0, 1, 3]
14 2 3 3
After:  [2, 0, 1, 3]

Before: [2, 1, 3, 2]
12 1 3 2
After:  [2, 1, 4, 2]

Before: [0, 1, 2, 0]
14 2 2 3
After:  [0, 1, 2, 4]

Before: [3, 0, 3, 2]
10 3 2 2
After:  [3, 0, 4, 2]

Before: [1, 0, 1, 0]
13 1 0 1
After:  [1, 1, 1, 0]

Before: [0, 2, 2, 1]
1 0 0 2
After:  [0, 2, 0, 1]

Before: [2, 0, 2, 1]
6 3 2 0
After:  [3, 0, 2, 1]

Before: [3, 2, 1, 0]
5 2 2 1
After:  [3, 3, 1, 0]

Before: [1, 0, 1, 3]
13 1 0 3
After:  [1, 0, 1, 1]

Before: [2, 1, 3, 1]
8 1 1 2
After:  [2, 1, 2, 1]

Before: [1, 1, 2, 1]
11 1 0 3
After:  [1, 1, 2, 1]

Before: [3, 2, 3, 2]
10 1 2 0
After:  [4, 2, 3, 2]

Before: [2, 2, 2, 2]
2 1 3 3
After:  [2, 2, 2, 1]

Before: [1, 1, 2, 1]
12 0 3 2
After:  [1, 1, 4, 1]

Before: [1, 2, 1, 2]
2 1 3 3
After:  [1, 2, 1, 1]

Before: [2, 2, 0, 1]
5 2 3 2
After:  [2, 2, 3, 1]

Before: [0, 2, 0, 1]
0 1 1 1
After:  [0, 1, 0, 1]

Before: [1, 1, 2, 3]
3 0 3 1
After:  [1, 0, 2, 3]

Before: [1, 0, 1, 3]
4 1 2 2
After:  [1, 0, 1, 3]

Before: [1, 2, 2, 2]
2 1 3 1
After:  [1, 1, 2, 2]

Before: [1, 1, 3, 0]
11 1 0 0
After:  [1, 1, 3, 0]

Before: [1, 3, 0, 3]
3 0 3 1
After:  [1, 0, 0, 3]

Before: [1, 0, 0, 0]
13 1 0 2
After:  [1, 0, 1, 0]

Before: [1, 1, 0, 0]
11 1 0 0
After:  [1, 1, 0, 0]

Before: [2, 1, 0, 3]
3 0 3 3
After:  [2, 1, 0, 0]

Before: [1, 2, 0, 2]
2 1 3 2
After:  [1, 2, 1, 2]

Before: [0, 2, 3, 2]
2 1 3 1
After:  [0, 1, 3, 2]

Before: [2, 2, 0, 2]
0 1 0 2
After:  [2, 2, 1, 2]

Before: [0, 0, 1, 1]
5 1 2 1
After:  [0, 2, 1, 1]

Before: [0, 1, 1, 0]
7 1 0 0
After:  [1, 1, 1, 0]

Before: [0, 2, 2, 0]
5 1 1 3
After:  [0, 2, 2, 3]

Before: [3, 2, 2, 0]
0 1 1 2
After:  [3, 2, 1, 0]

Before: [2, 2, 3, 1]
12 2 3 2
After:  [2, 2, 6, 1]

Before: [2, 3, 0, 0]
5 2 3 0
After:  [3, 3, 0, 0]

Before: [3, 2, 2, 2]
2 1 3 3
After:  [3, 2, 2, 1]

Before: [2, 0, 3, 1]
4 1 3 1
After:  [2, 1, 3, 1]

Before: [1, 0, 1, 2]
13 1 0 2
After:  [1, 0, 1, 2]

Before: [1, 0, 3, 1]
10 0 3 2
After:  [1, 0, 3, 1]

Before: [0, 2, 3, 0]
5 1 1 3
After:  [0, 2, 3, 3]

Before: [3, 0, 1, 1]
5 1 3 0
After:  [3, 0, 1, 1]

Before: [2, 2, 2, 3]
0 1 1 1
After:  [2, 1, 2, 3]

Before: [1, 2, 0, 3]
15 1 0 1
After:  [1, 1, 0, 3]

Before: [2, 1, 1, 2]
9 2 3 3
After:  [2, 1, 1, 3]

Before: [1, 1, 2, 2]
9 1 2 2
After:  [1, 1, 3, 2]

Before: [1, 1, 3, 0]
11 1 0 3
After:  [1, 1, 3, 1]

Before: [2, 2, 2, 3]
0 1 1 3
After:  [2, 2, 2, 1]

Before: [0, 1, 3, 1]
7 1 0 2
After:  [0, 1, 1, 1]

Before: [3, 3, 2, 1]
6 3 2 1
After:  [3, 3, 2, 1]

Before: [1, 1, 1, 0]
11 1 0 1
After:  [1, 1, 1, 0]

Before: [0, 2, 2, 2]
2 1 3 2
After:  [0, 2, 1, 2]

Before: [0, 3, 1, 0]
12 1 2 3
After:  [0, 3, 1, 5]

Before: [1, 1, 1, 3]
3 0 3 0
After:  [0, 1, 1, 3]

Before: [1, 1, 0, 1]
11 1 0 1
After:  [1, 1, 0, 1]

Before: [1, 0, 1, 1]
13 1 0 2
After:  [1, 0, 1, 1]

Before: [2, 2, 1, 3]
3 0 3 1
After:  [2, 0, 1, 3]

Before: [1, 2, 1, 3]
15 1 0 3
After:  [1, 2, 1, 1]

Before: [2, 2, 1, 2]
2 1 3 2
After:  [2, 2, 1, 2]

Before: [0, 3, 3, 1]
6 3 2 3
After:  [0, 3, 3, 3]

Before: [3, 1, 3, 2]
9 1 3 0
After:  [3, 1, 3, 2]

Before: [1, 2, 2, 1]
14 1 2 0
After:  [4, 2, 2, 1]

Before: [3, 0, 3, 1]
4 1 3 3
After:  [3, 0, 3, 1]

Before: [0, 0, 1, 1]
1 0 0 3
After:  [0, 0, 1, 0]

Before: [2, 0, 2, 3]
3 0 3 0
After:  [0, 0, 2, 3]

Before: [1, 2, 1, 3]
3 0 3 1
After:  [1, 0, 1, 3]

Before: [2, 2, 1, 2]
12 2 3 0
After:  [4, 2, 1, 2]

Before: [0, 0, 2, 3]
1 0 0 1
After:  [0, 0, 2, 3]

Before: [3, 2, 1, 2]
2 1 3 0
After:  [1, 2, 1, 2]

Before: [0, 1, 0, 2]
7 1 0 3
After:  [0, 1, 0, 1]

Before: [1, 0, 2, 3]
3 0 3 2
After:  [1, 0, 0, 3]

Before: [1, 0, 2, 3]
13 1 0 0
After:  [1, 0, 2, 3]

Before: [0, 1, 1, 0]
10 2 3 0
After:  [3, 1, 1, 0]

Before: [0, 1, 3, 0]
1 0 0 1
After:  [0, 0, 3, 0]

Before: [0, 2, 1, 1]
10 1 2 0
After:  [4, 2, 1, 1]

Before: [3, 2, 2, 2]
2 1 3 1
After:  [3, 1, 2, 2]

Before: [1, 2, 0, 2]
10 3 2 3
After:  [1, 2, 0, 4]

Before: [3, 2, 0, 2]
2 1 3 2
After:  [3, 2, 1, 2]

Before: [2, 3, 3, 3]
12 3 1 1
After:  [2, 4, 3, 3]

Before: [1, 3, 0, 3]
3 0 3 0
After:  [0, 3, 0, 3]

Before: [3, 3, 2, 1]
12 3 1 0
After:  [2, 3, 2, 1]

Before: [1, 0, 3, 0]
14 0 2 2
After:  [1, 0, 3, 0]

Before: [2, 3, 1, 3]
3 0 3 3
After:  [2, 3, 1, 0]

Before: [0, 3, 3, 0]
12 2 2 2
After:  [0, 3, 5, 0]

Before: [1, 2, 1, 3]
15 1 0 1
After:  [1, 1, 1, 3]

Before: [2, 0, 1, 2]
10 3 2 3
After:  [2, 0, 1, 4]

Before: [0, 1, 2, 2]
9 1 3 2
After:  [0, 1, 3, 2]

Before: [3, 3, 3, 3]
0 1 0 2
After:  [3, 3, 1, 3]

Before: [1, 2, 1, 1]
15 1 0 1
After:  [1, 1, 1, 1]

Before: [0, 1, 2, 2]
7 1 0 0
After:  [1, 1, 2, 2]

Before: [2, 0, 2, 2]
9 1 2 2
After:  [2, 0, 2, 2]

Before: [2, 0, 3, 1]
4 1 3 0
After:  [1, 0, 3, 1]

Before: [1, 0, 2, 1]
13 1 0 2
After:  [1, 0, 1, 1]

Before: [2, 2, 0, 0]
0 1 0 2
After:  [2, 2, 1, 0]

Before: [1, 3, 2, 1]
6 3 2 0
After:  [3, 3, 2, 1]

Before: [2, 3, 0, 2]
12 3 3 1
After:  [2, 5, 0, 2]

Before: [1, 0, 3, 0]
13 1 0 3
After:  [1, 0, 3, 1]

Before: [2, 1, 3, 0]
14 1 2 0
After:  [3, 1, 3, 0]

Before: [1, 1, 3, 2]
11 1 0 0
After:  [1, 1, 3, 2]

Before: [1, 2, 1, 3]
15 1 0 0
After:  [1, 2, 1, 3]

Before: [1, 2, 0, 2]
15 1 0 1
After:  [1, 1, 0, 2]

Before: [0, 1, 0, 3]
9 2 3 2
After:  [0, 1, 3, 3]

Before: [1, 3, 3, 3]
3 0 3 3
After:  [1, 3, 3, 0]

Before: [0, 0, 1, 0]
4 1 2 2
After:  [0, 0, 1, 0]

Before: [1, 2, 2, 1]
14 1 2 2
After:  [1, 2, 4, 1]

Before: [0, 2, 0, 0]
5 0 2 2
After:  [0, 2, 2, 0]

Before: [2, 2, 0, 2]
2 1 3 2
After:  [2, 2, 1, 2]

Before: [0, 1, 1, 2]
6 3 1 2
After:  [0, 1, 3, 2]

Before: [3, 3, 3, 1]
6 3 2 3
After:  [3, 3, 3, 3]

Before: [2, 0, 0, 3]
3 0 3 1
After:  [2, 0, 0, 3]
    


6 1 3 3
10 1 0 1
12 1 0 1
6 0 2 0
8 3 3 0
10 0 3 0
8 0 2 2
7 2 0 3
6 3 2 1
6 0 2 2
6 0 1 0
6 2 0 0
10 0 2 0
10 0 3 0
8 3 0 3
6 2 1 2
6 1 0 0
10 2 0 1
12 1 2 1
7 0 2 0
10 0 3 0
10 0 1 0
8 0 3 3
7 3 0 2
6 0 3 1
6 1 0 0
6 2 3 3
12 0 1 0
10 0 3 0
8 0 2 2
7 2 2 1
6 2 3 0
6 3 0 2
2 0 3 3
10 3 2 3
8 3 1 1
7 1 3 0
6 3 0 1
6 0 3 2
6 0 3 3
1 1 2 1
10 1 1 1
8 0 1 0
7 0 0 2
10 1 0 3
12 3 3 3
6 3 3 0
10 2 0 1
12 1 2 1
11 0 1 3
10 3 2 3
8 3 2 2
7 2 1 3
6 3 0 2
6 1 1 0
10 1 0 1
12 1 3 1
10 0 2 1
10 1 2 1
10 1 2 1
8 1 3 3
7 3 2 0
10 2 0 1
12 1 1 1
6 1 1 3
10 3 2 2
10 2 1 2
10 2 3 2
8 0 2 0
7 0 2 3
6 1 3 2
6 3 3 1
6 3 1 0
1 0 2 2
10 2 1 2
8 3 2 3
7 3 2 1
6 2 2 2
6 1 1 0
6 1 2 3
8 3 0 2
10 2 3 2
10 2 1 2
8 1 2 1
7 1 1 3
6 2 0 2
6 1 1 1
7 0 2 2
10 2 2 2
8 3 2 3
7 3 3 2
10 1 0 3
12 3 3 3
6 2 3 0
6 2 2 1
11 3 1 1
10 1 2 1
8 1 2 2
7 2 0 3
6 3 3 1
6 3 3 2
0 0 1 0
10 0 1 0
8 3 0 3
6 1 1 0
8 0 0 2
10 2 1 2
8 3 2 3
7 3 0 1
6 2 0 3
10 0 0 2
12 2 1 2
14 0 3 0
10 0 2 0
10 0 1 0
8 0 1 1
7 1 1 2
6 3 2 1
6 1 0 3
6 2 1 0
12 3 1 3
10 3 1 3
10 3 1 3
8 2 3 2
6 2 1 3
6 0 3 1
6 3 3 0
11 0 3 0
10 0 1 0
8 2 0 2
7 2 1 3
6 2 1 1
10 1 0 0
12 0 1 0
6 2 2 2
7 0 2 1
10 1 2 1
8 1 3 3
7 3 0 1
6 2 3 0
6 1 1 3
6 1 1 2
15 0 3 3
10 3 2 3
8 3 1 1
7 1 1 2
6 2 1 3
6 1 1 1
14 1 0 1
10 1 3 1
8 2 1 2
7 2 3 0
6 1 2 1
6 3 2 2
6 3 0 3
10 1 2 2
10 2 2 2
8 2 0 0
7 0 3 3
10 1 0 0
12 0 1 0
6 0 1 2
10 0 2 1
10 1 1 1
8 3 1 3
6 0 3 1
6 2 2 2
7 0 2 1
10 1 2 1
10 1 2 1
8 3 1 3
7 3 3 0
6 0 3 3
6 3 2 2
6 2 2 1
6 3 1 3
10 3 1 3
8 0 3 0
7 0 3 1
6 1 2 0
6 0 2 2
6 1 1 3
8 0 3 0
10 0 1 0
8 0 1 1
6 0 3 3
6 3 1 0
10 1 0 2
12 2 2 2
9 2 0 2
10 2 1 2
8 2 1 1
6 3 1 2
10 0 0 3
12 3 1 3
6 1 3 0
10 3 2 2
10 2 3 2
8 2 1 1
6 3 3 2
6 0 2 3
4 3 2 3
10 3 1 3
10 3 2 3
8 3 1 1
7 1 1 2
6 2 0 0
6 2 0 1
6 1 0 3
14 3 0 1
10 1 1 1
8 2 1 2
7 2 1 3
6 3 0 1
6 3 2 2
13 0 2 2
10 2 2 2
10 2 1 2
8 3 2 3
7 3 1 1
6 2 2 2
10 0 0 3
12 3 1 3
14 3 0 0
10 0 2 0
8 1 0 1
6 0 2 0
6 3 3 2
8 3 3 0
10 0 2 0
8 0 1 1
7 1 2 3
6 0 3 2
6 3 2 0
6 0 3 1
13 2 0 0
10 0 1 0
8 0 3 3
7 3 2 1
6 2 0 0
6 2 1 2
10 2 0 3
12 3 2 3
2 0 3 3
10 3 1 3
8 3 1 1
6 2 2 3
10 1 0 0
12 0 3 0
0 2 0 3
10 3 2 3
8 3 1 1
6 2 0 3
5 2 3 2
10 2 1 2
10 2 1 2
8 1 2 1
7 1 0 2
10 0 0 0
12 0 2 0
6 3 1 1
6 0 2 3
5 0 3 3
10 3 1 3
8 3 2 2
7 2 3 3
6 2 3 2
0 0 1 1
10 1 3 1
10 1 2 1
8 1 3 3
7 3 3 2
10 0 0 3
12 3 2 3
6 1 2 1
2 0 3 1
10 1 2 1
8 1 2 2
7 2 2 1
6 3 2 0
6 2 2 2
6 1 3 3
9 2 0 3
10 3 2 3
10 3 1 3
8 1 3 1
7 1 0 3
6 3 1 1
6 0 0 2
13 2 0 2
10 2 1 2
8 2 3 3
7 3 0 0
6 1 0 3
6 3 1 2
6 2 1 1
10 1 2 1
8 1 0 0
10 2 0 3
12 3 0 3
10 0 0 1
12 1 3 1
10 3 0 2
12 2 1 2
1 1 2 1
10 1 2 1
10 1 2 1
8 0 1 0
7 0 2 1
6 2 0 3
10 1 0 2
12 2 3 2
6 1 1 0
14 0 3 0
10 0 3 0
8 1 0 1
7 1 2 3
6 2 1 0
10 3 0 2
12 2 2 2
6 1 0 1
14 1 0 0
10 0 2 0
10 0 2 0
8 3 0 3
6 3 0 1
6 2 1 0
0 0 1 0
10 0 3 0
10 0 1 0
8 0 3 3
7 3 2 0
6 1 1 1
10 0 0 3
12 3 0 3
5 2 3 1
10 1 1 1
10 1 2 1
8 1 0 0
7 0 0 1
6 3 3 2
6 2 0 0
4 3 2 0
10 0 2 0
8 0 1 1
7 1 0 0
6 1 2 3
10 0 0 1
12 1 0 1
6 2 1 2
12 3 1 2
10 2 1 2
10 2 3 2
8 2 0 0
7 0 3 3
6 2 2 0
6 3 2 2
6 3 1 1
9 0 2 2
10 2 1 2
8 2 3 3
7 3 1 0
6 3 1 3
6 3 2 2
6 2 2 1
9 1 2 1
10 1 3 1
8 1 0 0
7 0 3 2
6 0 0 1
6 2 3 3
10 1 0 0
12 0 3 0
11 0 3 3
10 3 3 3
10 3 3 3
8 2 3 2
7 2 3 3
6 2 1 2
6 1 3 0
6 1 1 1
8 0 0 1
10 1 1 1
8 3 1 3
7 3 3 0
6 1 0 1
6 0 3 3
3 3 2 2
10 2 3 2
8 2 0 0
6 2 1 3
6 0 3 1
6 0 3 2
4 2 3 2
10 2 2 2
8 0 2 0
7 0 2 2
10 0 0 1
12 1 3 1
6 1 2 0
11 1 3 3
10 3 3 3
10 3 3 3
8 3 2 2
6 2 1 0
10 2 0 3
12 3 1 3
15 0 3 3
10 3 2 3
8 2 3 2
7 2 2 1
6 1 0 3
6 2 0 2
15 0 3 3
10 3 1 3
8 3 1 1
10 2 0 3
12 3 2 3
6 1 0 2
10 0 0 0
12 0 3 0
1 0 2 3
10 3 3 3
8 3 1 1
6 2 0 2
6 0 2 3
10 2 0 0
12 0 1 0
3 3 2 3
10 3 2 3
8 3 1 1
6 2 3 3
10 1 0 2
12 2 0 2
6 3 3 0
4 2 3 2
10 2 3 2
8 2 1 1
7 1 3 3
10 2 0 0
12 0 1 0
6 3 1 2
10 0 0 1
12 1 1 1
10 1 2 0
10 0 2 0
10 0 2 0
8 0 3 3
7 3 0 1
6 0 2 2
10 0 0 3
12 3 1 3
6 3 2 0
13 2 0 2
10 2 3 2
8 2 1 1
7 1 0 0
6 3 3 2
6 0 2 3
6 0 1 1
4 3 2 2
10 2 1 2
8 2 0 0
7 0 1 1
6 1 2 0
10 1 0 3
12 3 3 3
6 0 3 2
10 0 2 0
10 0 3 0
8 0 1 1
6 2 0 3
10 0 0 2
12 2 3 2
6 2 2 0
5 0 3 2
10 2 2 2
8 2 1 1
7 1 1 0
6 2 1 2
10 1 0 1
12 1 1 1
5 2 3 3
10 3 3 3
8 0 3 0
7 0 0 3
10 0 0 1
12 1 3 1
6 1 2 0
6 0 1 2
10 0 2 2
10 2 2 2
8 3 2 3
7 3 0 1
6 0 2 2
6 2 1 0
6 2 1 3
4 2 3 3
10 3 3 3
8 3 1 1
6 0 0 0
6 3 0 3
1 3 2 3
10 3 2 3
8 3 1 1
7 1 0 3
6 3 1 1
10 3 0 0
12 0 1 0
1 1 2 1
10 1 3 1
8 1 3 3
7 3 0 2
6 1 2 3
6 2 2 0
6 3 3 1
15 0 3 1
10 1 1 1
10 1 2 1
8 1 2 2
7 2 0 1
6 0 2 0
6 2 1 2
6 3 0 0
10 0 3 0
8 0 1 1
6 3 2 2
10 0 0 3
12 3 2 3
6 2 3 0
2 0 3 0
10 0 2 0
8 1 0 1
6 3 1 0
6 0 3 3
4 3 2 3
10 3 3 3
8 1 3 1
10 0 0 0
12 0 0 0
10 3 0 3
12 3 0 3
6 2 1 2
3 3 2 3
10 3 3 3
10 3 1 3
8 1 3 1
7 1 1 3
6 1 1 2
6 1 0 0
6 3 3 1
1 1 2 1
10 1 2 1
10 1 3 1
8 1 3 3
7 3 1 1
6 2 1 3
6 3 0 2
10 0 2 3
10 3 3 3
8 1 3 1
7 1 0 3
6 0 1 2
6 2 3 1
6 3 0 0
13 2 0 2
10 2 2 2
10 2 1 2
8 2 3 3
6 1 2 2
6 1 2 1
6 2 3 0
14 1 0 1
10 1 1 1
8 1 3 3
7 3 1 1
6 3 3 0
6 2 0 3
10 0 0 2
12 2 0 2
13 2 0 0
10 0 3 0
8 0 1 1
6 2 3 2
6 1 3 3
6 1 3 0
8 0 3 0
10 0 2 0
8 0 1 1
7 1 3 2
6 2 2 0
6 1 3 1
14 3 0 0
10 0 2 0
8 2 0 2
6 3 3 0
6 2 1 1
9 1 0 1
10 1 3 1
8 1 2 2
10 2 0 3
12 3 3 3
6 3 0 1
6 1 1 0
12 0 1 1
10 1 3 1
8 2 1 2
7 2 1 1
6 0 3 2
6 3 3 0
1 3 2 0
10 0 3 0
8 1 0 1
6 0 2 3
6 3 2 0
10 3 0 2
12 2 2 2
5 2 3 3
10 3 2 3
8 1 3 1
7 1 0 3
6 1 0 1
0 2 0 2
10 2 1 2
10 2 3 2
8 3 2 3
6 3 3 2
6 1 1 0
10 1 2 2
10 2 1 2
8 2 3 3
10 2 0 1
12 1 2 1
6 3 3 2
8 0 0 0
10 0 1 0
8 3 0 3
7 3 3 0
6 0 2 3
10 2 0 1
12 1 0 1
4 3 2 1
10 1 1 1
8 1 0 0
6 2 2 1
6 2 1 2
10 0 0 3
12 3 3 3
11 3 1 1
10 1 1 1
8 0 1 0
7 0 3 3
10 1 0 2
12 2 3 2
6 3 0 0
10 2 0 1
12 1 0 1
1 0 2 2
10 2 1 2
10 2 3 2
8 3 2 3
7 3 2 0
6 2 2 2
6 0 1 3
6 2 2 1
5 2 3 2
10 2 2 2
8 0 2 0
7 0 0 2
6 2 2 0
6 3 1 1
6 3 0 3
11 1 0 3
10 3 3 3
10 3 1 3
8 3 2 2
7 2 2 0
6 3 0 3
6 0 3 1
6 0 0 2
1 3 2 1
10 1 3 1
8 1 0 0
7 0 1 1
10 3 0 3
12 3 0 3
6 0 2 0
6 2 0 2
3 3 2 2
10 2 3 2
8 1 2 1
7 1 2 2
10 1 0 1
12 1 0 1
6 1 3 3
6 1 2 0
8 3 0 1
10 1 3 1
8 1 2 2
7 2 0 1
6 0 2 2
6 0 3 0
10 3 0 3
12 3 2 3
4 2 3 0
10 0 2 0
8 1 0 1
7 1 3 0
6 3 1 2
6 2 3 1
9 1 2 1
10 1 3 1
10 1 2 1
8 1 0 0
7 0 1 1
10 1 0 2
12 2 0 2
6 3 0 0
6 0 3 3
13 2 0 0
10 0 3 0
8 1 0 1
7 1 1 3
6 3 2 2
10 1 0 0
12 0 3 0
6 2 1 1
9 1 0 1
10 1 1 1
8 3 1 3
7 3 3 0
6 0 1 3
6 3 3 1
6 0 3 2
1 1 2 3
10 3 3 3
8 0 3 0
7 0 2 1
6 1 3 2
6 3 0 0
6 2 2 3
11 0 3 3
10 3 2 3
8 3 1 1
7 1 0 0
10 2 0 3
12 3 2 3
6 3 3 2
6 1 2 1
10 1 2 3
10 3 3 3
8 3 0 0
7 0 3 3
6 1 2 0
6 0 0 2
10 0 2 2
10 2 3 2
8 3 2 3
7 3 0 1
10 1 0 3
12 3 2 3
6 0 3 2
4 2 3 0
10 0 1 0
10 0 1 0
8 0 1 1
7 1 3 3
6 2 0 1
6 3 1 0
13 2 0 0
10 0 3 0
10 0 1 0
8 0 3 3
7 3 2 1
10 2 0 3
12 3 1 3
10 0 0 0
12 0 2 0
6 2 0 2
14 3 0 3
10 3 3 3
8 1 3 1
10 2 0 3
12 3 2 3
6 0 1 2
2 0 3 0
10 0 1 0
10 0 2 0
8 1 0 1
10 0 0 0
12 0 1 0
6 2 0 2
6 0 1 3
3 3 2 0
10 0 2 0
8 0 1 1
7 1 1 2
6 2 1 1
6 2 3 0
6 2 3 3
2 0 3 0
10 0 3 0
8 0 2 2
7 2 1 0
10 0 0 2
12 2 2 2
6 0 0 1
6 1 3 2
10 2 3 2
8 2 0 0
6 2 2 2
10 1 0 1
12 1 3 1
6 0 0 3
3 3 2 2
10 2 3 2
8 0 2 0
7 0 1 3
6 2 2 1
6 3 2 2
10 0 0 0
12 0 2 0
9 0 2 2
10 2 3 2
8 3 2 3
7 3 1 2
6 1 3 3
10 3 0 1
12 1 0 1
15 0 3 1
10 1 3 1
8 2 1 2
7 2 1 0
6 3 3 3
6 0 0 2
6 0 2 1
6 1 3 2
10 2 3 2
10 2 3 2
8 2 0 0
7 0 2 3
10 3 0 0
12 0 2 0
10 1 0 1
12 1 1 1
6 2 3 2
14 1 0 2
10 2 1 2
8 2 3 3
7 3 0 1
6 0 0 3
6 3 1 2
13 0 2 3
10 3 3 3
10 3 3 3
8 3 1 1
6 3 1 0
6 2 3 3
6 0 3 2
13 2 0 3
10 3 3 3
8 3 1 1
7 1 0 3
10 0 0 1
12 1 3 1
10 3 0 2
12 2 3 2
6 2 3 0
13 0 2 0
10 0 3 0
8 3 0 3
7 3 3 0
6 2 1 2
10 2 0 3
12 3 1 3
12 3 1 2
10 2 1 2
8 0 2 0
6 0 1 1
6 0 1 3
6 2 0 2
3 3 2 1
10 1 3 1
10 1 2 1
8 0 1 0
7 0 3 2
6 2 0 3
10 0 0 0
12 0 1 0
6 1 3 1
14 1 3 0
10 0 1 0
10 0 2 0
8 2 0 2
7 2 3 1
6 2 2 0
10 3 0 2
12 2 1 2
6 1 3 3
14 3 0 3
10 3 2 3
8 1 3 1
7 1 1 0
10 1 0 2
12 2 2 2
6 0 3 3
10 1 0 1
12 1 2 1
3 3 2 2
10 2 2 2
8 2 0 0
7 0 0 3
6 0 1 0
10 3 0 2
12 2 2 2
10 3 0 1
12 1 3 1
0 2 1 1
10 1 3 1
10 1 1 1
8 1 3 3
7 3 0 1
6 0 3 2
6 1 0 3
6 2 3 0
15 0 3 3
10 3 3 3
10 3 2 3
8 3 1 1
7 1 2 0
6 3 1 2
10 2 0 3
12 3 0 3
6 3 3 1
4 3 2 3
10 3 2 3
8 3 0 0
7 0 1 1
6 2 3 2
6 3 0 0
6 1 0 3
0 2 0 2
10 2 2 2
10 2 3 2
8 1 2 1
7 1 1 0
`.trim()

runPuzzle(testCases, actual)