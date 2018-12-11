const { _, log, runSamples, ...aoc } = require('./dist/util')

/** @param {string[]} lines */
function main(lines) {
    const serial = parseInt(lines[0])
    const grid = [...Array(300)].map(x=>Array(300).fill(0))

    function singlePower(x, y) {
        let rackId = x+10
        let power = rackId*y
        power += serial
        power *= rackId
        power = Math.floor(Math.abs(power/100%10))
        power -= 5
        return power
    }

    let width = 300

    let cache = new Map()

    function groupPower(lx, ly, size) {
        if (size === 1)
            return singlePower(lx, ly)
        
        /*let summ = 0
        for (let x = lx; x < lx+size; x++) {
            for (let y = ly; y < ly+size; y++) {
                summ += singlePower(x, y)
            }
        }
        return summ*/

        const key = `${lx},${ly},${size}`
        let existing = cache.get(key)
        if (existing !== undefined)
            return existing

        if (size % 2 === 0) {
            const half = size/2

            result = groupPower(lx, ly, half) + groupPower(lx+half, ly, half) + groupPower(lx, ly+half, half) + groupPower(lx+half, ly+half, half)
        } else {
            let sum = groupPower(lx+1, ly+1, size-1)
            for (let x = lx; x < lx+size; x++) {
                sum += singlePower(x, ly)
            }
            for (let y = ly+1; y < ly+size; y++) {
                sum += singlePower(lx, y)
            }
            result = sum
        }

        cache.set(key, result)
        return result
    }

    let bestX = 0
    let bestY = 0
    let bestSize = 0
    let bestPower = 0
    for (let i = 1; i <= width; i++) {
        log(i)
        for (let j = 1; j <= width; j++) {
            for (let size = 1; size <= width-Math.max(i,j); size++) {
                let power = groupPower(i, j, size)
                if (power > bestPower) {
                    bestX = i
                    bestY = j
                    bestSize = size
                    bestPower = power
                }
            }
        }
    }

    log(bestX, bestY, bestPower, bestSize)
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