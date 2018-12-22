const { _, log, PriorityQueue, ...aoc } = require('./dist/util')

/** @param {string} input */
function main(input) {
    const lines = aoc.linesTrim(input)

    const depth = aoc.ints(lines[0])[0]
    const [tx, ty] = aoc.ints(lines[1])
    const width = tx+1+50
    const height = ty+1+50


    const cave = new Array(height).fill().map(l => new Array(width).fill(' '))
    const erosion = new Array(height).fill().map(l => new Array(width).fill(' '))

    function geoIndex(x, y) {
        // The region at 0,0 (the mouth of the cave) has a geologic index of 0.
        // The region at the coordinates of the target has a geologic index of 0.
        // If the region's Y coordinate is 0, the geologic index is its X coordinate times 16807.
        // If the region's X coordinate is 0, the geologic index is its Y coordinate times 48271.
        // Otherwise, the region's geologic index is the result of multiplying the erosion levels of the regions at X-1,Y and X,Y-1.        

        if (x === 0 && y === 0)
            return 0
        else if (x === tx && y === ty)
            return 0
        else if (y === 0)
            return x*16807
        else if (x === 0)
            return y*48271
        else
            return erosion[y][x-1] * erosion[y-1][x]
    }


    // A region's erosion level is its geologic index plus the cave system's depth, all modulo 20183. Then:

    // If the erosion level modulo 3 is 0, the region's type is rocky.
    // If the erosion level modulo 3 is 1, the region's type is wet.
    // If the erosion level modulo 3 is 2, the region's type is narrow.
   
    const ROCKY = '.'
    const WET = '='
    const NARROW = '|'

    function erosionLevel(x, y) {
       return (geoIndex(x, y) + depth) % 20183
    }

    function regionType(x, y) {
        const mod = erosionLevel(x, y) % 3
        if (mod === 0)
            return ROCKY
        else if (mod === 1)
            return WET
        else if (mod === 2)
            return NARROW
    }

    for (let y of _.range(height)) {
        for (let x of _.range(width)) {
            erosion[y][x] = erosionLevel(x, y)    
        }
    }

    for (let y of _.range(height)) {
        for (let x of _.range(width)) {
            cave[y][x] = regionType(x, y)    
        }
    }

    function riskLevel() {
        let sum = 0
        for (let y of _.range(height)) {
            for (let x of _.range(width)) {
                const ch = cave[y][x]
                if (ch === '.')
                    sum += 0
                else if (ch === '=')
                    sum += 1
                else if (ch === '|')
                    sum += 2  
            }
        }
        log(sum)
    }


    let caveP = _.cloneDeep(cave)
    caveP[0][0] = 'M'
    caveP[ty][tx] = 'T'
    aoc.logGrid(caveP)
//    riskLevel()

    function allowedEquipment(p) {
        const ch = cave[p.y][p.x]
        if (ch === ROCKY)
            return 
    }

    function moveCost(p1, p2, equip) {

    }


    function keyof(opt) {
        return `${opt.pos.x},${opt.pos.y},${opt.tool}`
    }

    let TORCH = 'torch'
    let CLIMB = 'climb'
    let NEITHER = 'neither'

    function pathfind() {
        const start = { pos: { x: 0, y: 0 }, tool: TORCH }
        const goalPos = { x: tx, y: ty }

        const frontier = new PriorityQueue()
        frontier.push(start, 0)
        const cameFrom = new Map()
        const costSoFar = new Map()
        cameFrom.set(keyof(start), undefined)
        costSoFar.set(keyof(start), 0)

        let goalMaybe = null
    
        while (frontier.length > 0) {
            const current = frontier.pop()

            if (_.isEqual(current.pos, goalPos)) {
                goalMaybe = current
                break;
            }

            let neighbors = aoc.straightNeighbors(current.pos.x, current.pos.y).filter(p => p.x >= 0 && p.y >= 0 && p.x < width && p.y < height)
            let opts = []
            for (const n of neighbors) {
                let cur = cave[current.pos.y][current.pos.x]
                let ch = cave[n.y][n.x]
                let tool = current.tool

                if (_.isEqual(n, goalPos)) {
                    opts.push({ pos: n, tool: TORCH, cost: tool !== TORCH ? 8 : 1 })
                } else {
                    if (ch === ROCKY) {
                        if (cur !== NARROW) opts.push({ pos: n, tool: CLIMB, cost: tool !== CLIMB ? 8 : 1 })
                        if (cur !== WET) opts.push({ pos: n, tool: TORCH, cost: tool !== TORCH ? 8 : 1 })
                    } else if (ch === WET) {
                        if (cur !== NARROW) opts.push({ pos: n, tool: CLIMB, cost: tool !== CLIMB ? 8 : 1 })
                        if (cur !== ROCKY) opts.push({ pos: n, tool: NEITHER, cost: tool !== NEITHER ? 8 : 1 })
                    } else if (ch === NARROW) {
                        if (cur !== WET) opts.push({ pos: n, tool: TORCH, cost: tool !== TORCH ? 8 : 1 })
                        if (cur !== ROCKY) opts.push({ pos: n, tool: NEITHER, cost: tool !== NEITHER ? 8 : 1 })
                    }
                }
            }

            for (const opt of opts) {    
                const newCost = (costSoFar.get(keyof(current))||0) + opt.cost
                const prevCost = costSoFar.get(keyof(opt))

                if (prevCost === undefined || newCost < prevCost) {
                    costSoFar.set(keyof(opt), newCost)
                    frontier.push(_.omit(opt, 'cost'), newCost)
                    cameFrom.set(keyof(opt), current)
                }
            }
        }

        // if (!cameFrom.has(keyof(goal)))
        //     return []
        // else {
            const path = []
            let current = goalMaybe
            while (!_.isEqual(current, start)) {
                path.push(current)
                
                current = cameFrom.get(keyof(current))
            }
            path.reverse()

            log(path[0])
            log(path[1])
            let sum = 0
            for (let i = 1; i < path.length; i++) {
                const prev = path[i-1]
                const cell = path[i]
//                log(cell, cave[cell.pos.y][cell.pos.x], prev.tool === cell.tool ? 1 : 8)
                sum += prev.tool === cell.tool ? 1 : 8
            }
            log(sum)

//            aoc.logGrid(caveP)
//            log(path.slice(0, 10))

            for (const cell of path) {
                caveP[cell.pos.y][cell.pos.x] = '*'
            }
            aoc.logGrid(caveP)

            log(costSoFar.get(keyof(goalMaybe)))

            return path
        // }
    }

    pathfind()
}

function runPuzzle(testCases, actual) {
    // testCases.map(main)
    main(actual)
}

const testCases = [
`depth: 510
target: 10,10
`,
`
`,
`    
`
].map(t => t.trim()).filter(t => t.length)

const actual = `
depth: 3558
target: 15,740
`.trim()

runPuzzle(testCases, actual)