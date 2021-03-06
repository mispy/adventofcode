const { _, log, ...aoc } = require('./dist/util')

/** @param {string} input */
function main(input) {
    let grid = aoc.grid(input)


    let newGrid = []
    for (let line of grid) {
        newGrid.push(_.clone(line))
    }
    grid = newGrid

    function toString() {
        return grid.map(l => l.join("")).join("\n")
    }

    function sum() {
        let lum = 0
        let tree = 0
        grid.map(l => l.map(x => {
            if (x === '#')
                lum += 1
            if (x === '|')
                tree += 1
        }))        

        return lum*tree
    }
    
    const prevStates = {}
    let ticks = 0
    let repeatFrom = 0
    let repeatSum = 0
    let interval = 0
    let ticksNeeded = null

    function tick() {
        let newGrid = []
        for (let line of grid) {
            newGrid.push(_.clone(line))
        }

        for (let y of _.range(grid.length)) {
            for (let x of _.range(grid[0].length)) {
                const neighbors = []
                for (let i = y-1; i <= y+1; i++) {
                    for (let j = x-1; j <= x+1; j++) {
                        if (i === y && j === x) continue
                        if (grid[i] && grid[i][j])
                            neighbors.push(grid[i][j])
                    }
                }

                const ch = grid[y][x]
    
                const trees = neighbors.filter(n => n === "|")
                const open = neighbors.filter(n => n === ".")
                const lumber = neighbors.filter(n => n === "#")
    
                if (ch === '.' && trees.length >= 3)
                    newGrid[y][x] = '|'
                else if (ch === '|' && lumber.length >= 3)
                    newGrid[y][x] = '#'
                else if (ch === '#') {
                    if (trees.length >= 1 && lumber.length >= 1) {
    
                    } else {
                        newGrid[y][x] = '.'
                    }
                }
                //           newGrid[y][x] = 
            }
        }

        grid = newGrid

        const g = toString()
        const s = sum()
        if (ticks >= 600 && !ticksNeeded)
            log(ticks, s)
        if (!ticksNeeded && prevStates[g] && prevStates[g] % 100 === 0) {
            repeatFrom = prevStates[g]
            repeatSum = s
            interval = ticks-prevStates[g]
            // if (ticks >= 600)
                // log(repeatFrom, ticks, interval, repeatSum)
            return false
        }
        prevStates[g] = ticks
        return true
    }

//    log(grid.map(l => l.join("")).join("\n"))

    while (tick()) {
        ticks += 1
        if (ticks % 1000 === 0)
            log(`TICK ${ticks}`)
        if(ticks === 10)
            log(sum)
    }

    // 5618 174782
    // 5619 174420
    

    log(repeatFrom, repeatSum, interval)
    const target = 1000000000

    // guessed 179800

    ticksNeeded = (target-repeatFrom) % 28
    log(`EXTRAPOLATE from ${repeatFrom} - ${ticksNeeded} ticks`)
    for (const i of _.range(ticksNeeded)) {
        tick()
        log(toString())
        log((target-ticksNeeded)+i+1, sum())
    }

}

function runPuzzle(testCases, actual) {
    // testCases.map(main)
    main(actual)
}

const testCases = [
`
.#.#...|#.
.....#|##|
.|..|...#.
..|#.....#
#.#|||#|#|
...#.||...
.|....|...
||...#|.#|
|.||||..|.
...#.|..|.
`,
`
`,
`    
`
].map(t => t.trim()).filter(t => t.length)

const actual = `
..|#..#......#|.#..#|#.|##|.|.##.||..|.||....###|.
||.|....|#.#|.#...#.|...|#.#.#.#....#......#....#.
...#...|.....#.#..|#...||..#.|.|#....#|#|..##...|.
.....#....|#.|..|.....#|##...#.#.#||....||||....#.
..###...#.||.|||.##.#.|....|.##.#....|.#.|..|.....
....|..#.#.|...|..|.....#....#.#.......|.||...|...
#..|.....##|..#..#...#..|.##.....#......||##|.|#..
##........#...|#|.##.#|#..#|...#...#.##|||.#||..||
......#..|..|.#...|#||.#....#.#.|#.||......|.....|
.|...|.##....#.||...|..|..|.|........#.#..|||..|##
..|....|...#####..|#|..|...#...#.|...|..|.|..|.#|#
....|...#.#.#.......#......#.#|......#|.##..##.#|.
.....|.#..|#...||..#......|..#.|#.#|...#|.|..#||..
#....#.......|#.|..|...#...|..|.##|#.|#.#|.....|..
....#.||#.....#..#...|....##.#.......#.|.|||.|....
|.|..||##....|#..#..|..|.|.|..|||.##..#.|......##|
###..|.#|##|#.|||.#|.#..|#|..#..|.#|....#.#.#..||.
.|.....|#.#.|#||..#.....#.|.||.#.|.....|#..|...#..
...##.........|...#.#|....##..#.|.|.......#..|...|
..#.#.|.|.....||#..||...##||.#|..|.....#|...|...#|
....#...#||..|...|.|..|#.#.........|#...#.|||...#.
.#..|.##.|.|.#...#.....#.#.......|#.|.#||#.#.....#
|...#|..#....#...|.##.####....|#.##|#.#.|.....||..
....|.#.|#||..|#.|.|.#|...|.#....||.#...#|.#...|.#
.|..#.#..|#|..##..|.##..||...#...||....#||..#.|...
##......#.|...|.||.#.||....|.......#......##|#..|.
|#....#||....##...........#.|....|....|#|#.|..#...
..#...#|....|.|..|...#.......#.##.#.....#.||......
...|....#|#..#|...|...#|....#.#|.......|.......|#.
.#||..##||.|..|.|#..|.|....|.#|.|.|.....#.#.|..#.#
.....|..|...|...|......||...##.....##.......|.#..|
.....#..#|.#...#..#...||.|##..|#..##.|#.....##....
|...|.#||.........#..#..#||||....|...|..|..#...##.
#.#..|.|.......||..|#|..|....|.|#|#|.|..|.|...#.#.
#.|..||#.||||..###.|......|.#|||.##........||...||
.....#|..#.#.....|..|#.....|....|.#|||#.|.....#...
...||#..#...#...||#.||......|#..#..#.|#.|#|...|..#
.||.....||..|#.|#||...##..###|.#....|.|..|#...#|.|
...#.|#||..#.|||......#...||.#..|||..|#.|.##..#.|#
.#||..#.|||.......|.|#.....|.|#.#..##..|.|....|#..
..#.###..|.........|.....#..###|.|#..........#|.#|
#.||.|.#.|..||#|||#..##.|#....#.#.|.#.....|.|.#.|#
|..|..#.#..|.#.......#...#.|..|..|#..|..###|.||..|
|..|...||...|.#.#..##|.#..#...#|#..|.#..|.#..|.||.
..#.##..#.|..#.#..|..|#.|||.#..#..|#####.|..#.....
.|.|#.|#...||..##...#|#.........#...#|..##.#.#..#.
##|.|..#.#|....#..|..#....#......#||.|....||##..||
.##|#....#..#..#.....#|.#...#..#.|#||||.##.#....|.
..|.......#|....|#|..||..##..#.|#|..#.#|....|..#|#
....|||.|||#..||...|||.##..#.#|##....|..|..||..#|#
`.trim()

runPuzzle(testCases, actual)