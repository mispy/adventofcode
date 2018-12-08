const { _, log, runSamples, ...aoc } = require('../dist/util')

/** @param {string[]} lines */
function main(lines) {
    const value = parseInt(lines[0])
    const grid = [...Array(50)].map(x=>Array(50).fill(0))       

    let x = Math.ceil(50/2)
    let y = Math.ceil(50/2)

    let swap = false
    let magnitude = 1
    let total = 1
    let dir = "right"
    grid[x][y] = total

    while (true) {
        let isClose = total+magnitude >= value
        let change = isClose ? value-total : magnitude
        //log(x, y, total, magnitude, isClose, change)

        if (dir === "right") {
            for (let i = 1; i <= change; i++) {
                grid[y][x+i] = total+i
            }
            x += change
            dir = "up"
        } else if (dir === "up") {
            for (let i = 1; i <= change; i++) {
                grid[y-i][x] = total+i
            }
            y -= change
            dir = "left"
            magnitude += 1
        } else if (dir === "left") {
            for (let i = 1; i <= change; i++) {
                grid[y][x-i] = total+i
            }
            x -= change
            dir = "down"
        } else if (dir === "down") {
            for (let i = 1; i <= change; i++) {
                grid[y+i][x] = total+i
            }
            y += change
            dir = "right"
            magnitude += 1
        }

        if (isClose) {
            break
        }

        total += change
    }

    const manhattanDistFromCenter = Math.abs(x)+Math.abs(y)
    for (const line of grid) {
        log(line.join(" "))
    }
}

/** @param {string[]} lines */
function partTwo(lines) {
    const value = parseInt(lines[0])
    const grid = [...Array(5000)].map(x=>Array(5000).fill(0))       

    let x = Math.ceil(5000/2)
    let y = Math.ceil(5000/2)

    let swap = false
    let magnitude = 1
    let total = 1
    let dir = "right"
    grid[x][y] = total
    let found = false

    function fill(cx, cy) {
        let sum = 0
        for (let x=cx-1; x <= cx+1; x++) {
            for (let y=cy-1; y <= cy+1; y++) {
                sum += grid[y][x]
            }
        }
        grid[cy][cx] = sum
        if (sum > value && !found) {
            log(sum)
            found = true 
        }
        return sum
    }

    while (true) {
        let isClose = total+magnitude >= value
        let change = isClose ? value-total : magnitude
        //log(x, y, total, magnitude, isClose, change)

        if (dir === "right") {
            for (let i = 1; i <= change; i++) {
                fill(x+i, y)
            }
            x += change
            dir = "up"
        } else if (dir === "up") {
            for (let i = 1; i <= change; i++) {
                fill(x, y-i)
            }
            y -= change
            dir = "left"
            magnitude += 1
        } else if (dir === "left") {
            for (let i = 1; i <= change; i++) {
                fill(x-i, y)
            }
            x -= change
            dir = "down"
        } else if (dir === "down") {
            for (let i = 1; i <= change; i++) {
                fill(x, y+i)
            }
            y += change
            dir = "right"
            magnitude += 1
        }

        if (isClose) {
            break
        }

        total += change
    }
}

runSamples(partTwo, [
`
1024
`,
`
312051
`,
`

`
])