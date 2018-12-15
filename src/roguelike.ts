import { _, log, Vector2, PriorityQueue } from './util'
import { runInThisContext } from 'vm';

function isAdjacent(pos1: Vector2, pos2: Vector2) {
    return (pos1.x === pos2.x && Math.abs(pos1.y-pos2.y) === 1) || (pos1.y === pos2.y && Math.abs(pos1.x-pos2.x) === 1)
}

class Cell {
    game: Roguelike
    pos: Vector2
    _ch: string = "."
    unit?: Unit = undefined

    get ch(): string {
        if (this.unit)
            return this.unit.ch
        else
            return this._ch
    }

    constructor(game: Roguelike, pos: Vector2, ch: string) {
        this.game = game
        this.pos = pos
        this._ch = ch
    }

    get pathNeighbors(): Cell[] {
        const positions = [
            new Vector2(this.x, this.y-1),
            new Vector2(this.x-1, this.y),
            new Vector2(this.x+1, this.y),
            new Vector2(this.x, this.y+1)
        ]

        return positions.map(p => this.game.get(p))
    }

    get isPathable(): boolean {
        return this.ch === "."
    }

    get x(): number {
        return this.pos.x
    }

    get y(): number {
        return this.pos.y
    }

    get neighbors(): Cell[] {
        return this.pos.neighbors.map(p => this.game.get(p))
    }
}

class Unit {
    game: Roguelike
    ch: string
    cell: Cell
    health: number = 200
    power: number

    get pos() {
        return this.cell.pos
    }


    toString(): string {
        return `${this.ch}<${this.pos.x}, ${this.pos.y}, ${this.health}>`
    }

    constructor(game: Roguelike, ch: string, cell: Cell, power: number) {
        this.game = game
        this.ch = ch
        this.cell = cell
        this.power = power
    }

    isEnemy(otherUnit: Unit) {
        return this.ch !== otherUnit.ch
    }

    moveTo(cell: Cell) {
        this.cell.unit = undefined
        cell.unit = this
        this.cell = cell
    }

    isDead: boolean = false
    die() {
        this.isDead = true
        this.cell.unit = undefined
    }

    attack(other: Unit) {
        //log(`${this.ch} attacks ${other.ch} (${other.health}-${this.power} = ${other.health-this.power})`)
        other.health -= this.power
        if (other.health <= 0)
            other.die()
    }

    getEnemies(): Unit[] {
        return this.game.getUnits().filter(u => this.isEnemy(u))
    }

    getAttackTarget(): Unit|undefined {
        let attackTargets = this.getEnemies().filter(u => isAdjacent(this.pos, u.pos))
        return _.sortBy(attackTargets, t => t.health)[0]
    }

    tryAttack() {
        let target = this.getAttackTarget()
        if (target)
            this.attack(target)
    }

    tryMove() {
        if (this.getAttackTarget())
            return

        const {game} = this
        const paths = []
        for (const enemy of this.getEnemies()) {
            for (const cell of enemy.cell.pathNeighbors) {
                if (cell.isPathable) {
                    const path = game.pathBetween(this.cell, cell)
                    if (path.length)
                        paths.push(path)
                }
            }
        }    

        paths.sort((p1, p2) => {
            if (p1.length < p2.length)
                return -1
            else if (p2.length < p1.length)
                return 1
            else {
                const a = _.last(p1) as Cell, b = _.last(p2) as Cell
                if (a.y < b.y)
                    return -1
                else if (b.y < a.y)
                    return 1
                else if (a.x < b.x)
                    return -1
                else if (b.x < a.x)
                    return 1
                else
                    return 0
            }
        })

        if (paths.length) {
            this.moveTo(paths[0][0])
        }
    }

    takeTurn() {
        if (this.isDead || this.game.finalRounds)
            return

        const {game} = this
        let paths = []
    
        const enemyUnits = game.getUnits().filter(u => this.isEnemy(u))
        if (enemyUnits.length === 0 && !game.finalRounds) {
            game.endCombat()
            return
        }

        this.tryMove()
        this.tryAttack()
    }
}

export class Roguelike {
    grid: Cell[][] = []
    lines: string[]
    constructor(lines: string[]) {
        this.lines = lines
    }

    get(pos: Vector2) {
        return this.grid[pos.y][pos.x]
    }

    print() {
        const lines = []
        for (const cells of this.grid) {
            lines.push(cells.map(c => c.ch).join(""))
        }
        log(lines.join("\n"))
    }

    pathBetween(start: Cell, goal: Cell): Cell[] {
        const frontier = new PriorityQueue<Cell>()
        frontier.push(start, 0)
        const cameFrom: Map<Cell, Cell|undefined> = new Map()
        const costSoFar: Map<Cell, number> = new Map()
        cameFrom.set(start, undefined)
        costSoFar.set(start, 0)

        while (frontier.length > 0) {
            const current = frontier.pop()

            if (current === goal)
                break;

            for (const nextCell of current.pathNeighbors) {
                if (nextCell !== start && nextCell !== goal && !nextCell.isPathable) continue

                let cc = 0
                if (current === start) {
                    cc += nextCell.y / 100
                    cc += nextCell.x / 100000    
                }
                const newCost = (costSoFar.get(current)||0) + 1 + cc

                const prevCost = costSoFar.get(nextCell)
                if (prevCost === undefined || newCost < prevCost) {
                    costSoFar.set(nextCell, newCost)
                    frontier.push(nextCell, newCost)
                    cameFrom.set(nextCell, current)
                }
            }
        }

        if (!cameFrom.has(goal))
            return []
        else {
            const path = []
            let current = goal
            while (current != start) {
                path.push(current)
                current = cameFrom.get(current) as Cell
            }
            path.reverse()
            return path
        }
    }

    getUnits(): Unit[] {
        const {grid} = this
        let units = []
        for (const y of _.range(grid.length)) {
            for (const x of _.range(grid[y].length)) {
                const cell = grid[y][x]
                if (cell.unit)
                    units.push(cell.unit)
                /*if (cell.ch === "G" || cell.ch === "E") {
                    units.push(new Unit(this, cell.ch, cell))
                }*/
            }        
        }
        return units
    }

    round() {
        for (const unit of this.getUnits()) {
            unit.takeTurn()
//            if (unit.ch === "E")
//                break
        }    
    }

    endCombat() {
        this.finalRounds = this.roundsPassed
    }

    roundsPassed: number = 0
    finalRounds: number = 0
    elfPower: number = 3
    startingElves: number = 0
    runWith(power: number) {
        this.elfPower = power
        this.roundsPassed = 0
        this.finalRounds = 0
        this.startingElves = 0

        for (const y of _.range(this.lines.length)) {
            this.grid.push([])
            for (const x of _.range(this.lines[y].length)) {
                const ch = this.lines[y][x]
                const cell = new Cell(this, new Vector2(x, y), ch)
                this.grid[y][x] = cell
                if (ch === "G" || ch === "E") {
                    cell._ch = "."
                    cell.unit = new Unit(this, ch, cell, ch === "E" ? this.elfPower : 3)
                }
                
                if (ch === "E")
                    this.startingElves += 1
            }        
        }

        let rounds = 0
        //this.print()
        while (true) {
            //log(`START ROUND ${rounds+1}`)
            this.round()
            //this.print()
            rounds += 1
            this.roundsPassed = rounds

            if (this.finalRounds) {
                log("COMBAT COMPLETE")
                log(`TOTAL ROUNDS ${this.finalRounds}`)
                const units = this.getUnits()
                const hp = _.sum(units.map(u => u.health))
                log(hp, hp*this.finalRounds)
                return units.filter(u => u.ch === "E").length === this.startingElves
            }
//            if (rounds >= 47)
//                break
        }            

        /*for (const unit of this.units) {
            console.log(unit.ch, unit.health)
        }*/
    }

    run() {
        let power = 20
        let totalVictory = false
        while (!totalVictory) {
            power += 1
            totalVictory = this.runWith(power)
            log("POWER", power)
        }
    }
}