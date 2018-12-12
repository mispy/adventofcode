const { _, log, runSamples, ...aoc } = require('./dist/util')

function toString(state) {
    const keys = _.sortBy(Array.from(state.keys()))
    const length = _.last(keys)-keys[0]

    const arr = new Array(length)
    for (let i = 0; i <= length; i++) {
        arr[i] = state.get(keys[0]+i) ? "#" : "."
    }
    return arr.join("")
}

function print(state) {
    log(toString(state))
} 

/** @param {string[]} lines */
function main(lines) {
    let state = new Map()

    const inputState = Array.from(_.last(lines[0].split(" ")))
    for (const i of _.range(inputState.length)) {
        if (inputState[i] === "#")
            state.set(i, true)
    }

    const rules = {}
    lines.slice(1).map(l => {
        const spl = l.split(" => ")
        rules[spl[0]] = spl[1]
    })

    const iterations = 50000000000

    function growAround(index, newState) {
        let surround = []
        for (let j = index-2; j <= index+2; j++) {
            surround.push(state.get(j) ? "#" : ".")
        }
        const key = surround.join("")
        if (rules[key] === "#")
            newState.set(index, true)
        else
            newState.delete(index)
    }

    //print(state)
    let prevSum = 0
    let sum = 0
    let i = 0
    let prevState = toString(state)
    for (i = 0; i < iterations; i++) {

        if (i % 100000 === 0) {
            log(i)
        }
        const newState = new Map(state)
        for (const i of state.keys()) {
            for (let j = i-2; j <= i+2; j++) {
                growAround(j, newState)
            }
        }

        state = newState

        prevSum = sum
        sum = 0
        for (const [i, value] of state.entries()) {
            if (value)
                sum += i
        }

        const v = toString(state)
        if (v === prevState) {
            log("CYCLE FOUND")
            break
        }
        prevState = v
    }

    const amount = sum-prevSum
    log(sum + amount*(iterations-(i+1)))

}

runSamples(main, [
`
initial state: #.#####.#.#.####.####.#.#...#.......##..##.#.#.#.###..#.....#.####..#.#######.#....####.#....##....#

##.## => .
#.#.. => .
..... => .
##..# => #
###.. => #
.##.# => .
..#.. => #
##.#. => #
.##.. => .
#..#. => .
###.# => #
.#### => #
.#.## => .
#.##. => #
.###. => #
##### => .
..##. => .
#.#.# => .
...#. => #
..### => .
.#.#. => #
.#... => #
##... => #
.#..# => #
#.### => #
#..## => #
....# => .
####. => .
#...# => #
#.... => .
...## => .
..#.# => #
`,
`
`,
`

`
])  