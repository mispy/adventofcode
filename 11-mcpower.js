const { _, log, runSamples, Grid, ...aoc } = require('./dist/util')

/** @param {string[]} lines */
function main(lines) {
    const serial = parseInt(lines[0])
    const gridSize = 300
    const grid = new Grid(Int32Array, gridSize, gridSize)

    function getPower(x, y) {
        const rack = x + 10
        let power = rack * y
        power += serial
        power *= rack
        power /= 100
        power %= 10
        power -= 5
        return Math.floor(power)
    }

    // Precalculate 1x1 power value for all cells
    grid.populate((x, y) => getPower(x, y))

    // Summed area table https://en.wikipedia.org/wiki/Summed-area_table
    const csum = new Grid(Int32Array, gridSize, gridSize)

    // Precalculate summed area table
    csum.populate((x, y) => grid.get(x, y) + csum.getMaybe(x, y-1, 0) + csum.getMaybe(x-1, y, 0) - csum.getMaybe(x-1, y-1, 0))

    function squarePower(x, y, size) {
        // Summed-area table calculation uses x0 < x <= x1
        const x0 = x-1, x1 = x0+size, y0 = y-1, y1 = y0+size
        return csum.getMaybe(x1, y1, 0) + csum.getMaybe(x0, y0, 0) - csum.getMaybe(x1, y0, 0) - csum.getMaybe(x0, y1, 0)
    }

    let out = [0, 0, 0, 0]
    grid.every((x, y) => {
        for (const size of _.range(1, gridSize - Math.max(x, y))) {
            const pow = squarePower(x, y, size)
            if (pow > out[3]) {
                out = [x, y, size, pow]
            }
        }
    })

    log(out)
}

runSamples(main, [
`
9995
`,
`

`,
`

`
])