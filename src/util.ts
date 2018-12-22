import _ = require('lodash')
const log = console.log
export { _, log }

import moment = require('moment')
export { moment }

import fastLevenshtein = require('fast-levenshtein')
import * as fs from 'fs'
import { stringify } from 'querystring';

export function levenshtein(s1: string, s2: string) {
    return fastLevenshtein.get(s1, s2)
}

export function hamming(s1: string|any[], s2: string|any[]): number {
    let dist = 0
    for (let i = 0; i < Math.min(s1.length, s2.length); i++) {
        if (s1[i] !== s2[i])
            dist += 1
    }
    dist += Math.abs(s2.length-s1.length)
    return dist
}

export function runSamples(solver: (lines: string[]) => void, samples: string[]) { 
    for (const sample of samples) {
        // Process input in a whitespace-typo-friendly way so we can just paste it in there quickly
        const lines = sample.split("\n").filter(l => l.trim().length > 0)
        if (lines.length)
           solver(lines)
    }
}

export function linesTrim(input: string): string[] {
    return input.split("\n").map(l => l.trim()).filter(l => l)
}

export class ArrayGrid extends Array {
    width: number
    height: number

    constructor(arr: string[][]) {
        super()
        this.push(...arr)

        const lineLens = _.uniq(arr.map(l => l.length))
        if (lineLens.length > 1)
            console.warn("ArrayGrid lines are not of equal length!")

        this.height = this.length
        this.width = _.max(lineLens) as number
    }
}

export function grid(input: string): { grid: string[][], width: number, height: number } {
    const grid = input.split("\n").map(l => Array.from(l))
    return { grid, width: grid[0].length, height: grid.length }
}

export function gridToString(grid: string[][]): string {
    return grid.map(l => l.join("")).join("\n")
}


export function logGrid(grid: string[][]) {
    log(gridToString(grid))
}

export function diagonalNeighbors(cx: number, cy: number) {
    let neighbors = []
    for (let x = cx-1; x <= cx+1; x++) {
        for (let y = cy-1; y <= cy+1; y++) {
            if (x !== cx || y !== cy)
                neighbors.push({ x, y })
        }
    }
    return neighbors
}

export function straightNeighbors(cx: number, cy: number) {
    let neighbors = []
    neighbors.push({ x: cx, y: cy-1 })
    neighbors.push({ x: cx-1, y: cy })
    neighbors.push({ x: cx+1, y: cy })
    neighbors.push({ x: cx, y: cy+1 })
    return neighbors
}

export function readFile(path: string) {
    return fs.readFileSync(path, 'utf8')
}

export function scan(s: string, r: RegExp): string[] {
    const m = s.match(r)
    return m ? m : []
}

// thanks mcpower!
export function ints(s: string): number[] {
    return scan(s, /-?\d+/g).map(v => parseInt(v))
}

export function positiveInts(s: string): number[] {
    return scan(s, /\d+/g).map(v => parseInt(v))
}

export function floats(s: string): number[] {
    return scan(s, /-?\d+(?:\.\d+)?/g).map(v => parseFloat(v))
}

export function positiveFloats(s: string): number[] {
    return scan(s, /\d+(?:\.\d+)?/g).map(v => parseFloat(v))
}

export function words(s: string): string[] {
    return scan(s, /[a-zA-Z]+/g)
}

export class Vector2 {
    static left = new Vector2(-1, 0)
    static right = new Vector2(1, 0)
    static up = new Vector2(0, -1)
    static down = new Vector2(0, -1)
    static zero = new Vector2(0, 0)

    static get epsilon() {
        return 1E-05
    }

    static distanceSq(a: Vector2, b: Vector2): number {
        return (b.x - a.x) ** 2 + (b.y - a.y) ** 2
    }

    static distance(a: Vector2, b: Vector2): number {
        return Math.sqrt(Vector2.distanceSq(a, b))
    }

    static angle(a: Vector2, b: Vector2): number {
        return Math.acos(Math.max(Math.min(Vector2.dot(a.normalize(), b.normalize()), 1), -1)) * 57.29578
    }

    static dot(lhs: Vector2, rhs: Vector2) {
        return lhs.x * rhs.x + lhs.y * rhs.y
    }

    // From: http://stackoverflow.com/a/1501725/1983739
    static distanceFromPointToLineSq(p: Vector2, v: Vector2, w: Vector2): number {
        const l2 = Vector2.distanceSq(v, w)
        if (l2 === 0)
            return Vector2.distanceSq(p, v)

        let t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2
        t = Math.max(0, Math.min(1, t))
        return Vector2.distanceSq(p, new Vector2(v.x + t * (w.x - v.x), v.y + t * (w.y - v.y)))
    }

    static distanceFromPointToLine(p: Vector2, v: Vector2, w: Vector2): number {
        return Math.sqrt(Vector2.distanceFromPointToLineSq(p, v, w))
    }

    static fromArray(a: [number, number]): Vector2 {
        return new Vector2(a[0], a[1])
    }

    static fromObject(o: { x: number, y: number }): Vector2 {
        return new Vector2(o.x, o.y)
    }

    x: number
    y: number

    constructor(x: number, y: number) {
        this.x = x
        this.y = y
    }

    subtract(v: Vector2): Vector2 {
        return new Vector2(this.x - v.x, this.y - v.y)
    }

    add(v: Vector2): Vector2 {
        return new Vector2(this.x + v.x, this.y + v.y)
    }

    times(n: number): Vector2 {
        return new Vector2(this.x * n, this.y * n)
    }

    clone(): Vector2 {
        return new Vector2(this.x, this.y)
    }

    get magnitude(): number {
        return Math.sqrt(this.x ** 2 + this.y ** 2)
    }

    normalize(): Vector2 {
        const magnitude = this.magnitude
        if (magnitude > 1E-05) {
            return new Vector2(this.x / magnitude, this.y / magnitude)
        } else {
            return new Vector2(0, 0)
        }
    }

    normals(): Vector2[] {
        return [new Vector2(-this.y, this.x), new Vector2(this.y, -this.x)]
    }

    invert(): Vector2 {
        return this.times(-1)
    }

    toString(): string {
        return `Vector2<${this.x}, ${this.y}>`
    }

    get neighbors(): Vector2[] {
        const surround = []
        for (let x = this.x-1; x <= this.x+1; x++) {
            for (let y = this.y-1; y <= this.y+1; y++) {
                if (x !== this.x && y !== this.y)
                    surround.push(new Vector2(x, y))
            }
        }
        return surround
    }
}

export class Bounds {
    static fromProps(props: { x: number, y: number, width: number, height: number }): Bounds {
        const { x, y, width, height } = props
        return new Bounds(x, y, width, height)
    }

    static fromBBox(bbox: { x: number, y: number, width: number, height: number }): Bounds {
        return this.fromProps(bbox)
    }

    static fromCorners(p1: Vector2, p2: Vector2) {
        const x1 = Math.min(p1.x, p2.x)
        const x2 = Math.max(p1.x, p2.x)
        const y1 = Math.min(p1.y, p2.y)
        const y2 = Math.max(p1.y, p2.y)

        return new Bounds(x1, y1, x2 - x1, y2 - y1)
    }

    // Merge a collection of bounding boxes into a single encompassing Bounds
    static merge(boundsList: Bounds[]): Bounds {
        let x1 = Infinity, y1 = Infinity, x2 = -Infinity, y2 = -Infinity
        for (const b of boundsList) {
            x1 = Math.min(x1, b.x)
            y1 = Math.min(y1, b.y)
            x2 = Math.max(x2, b.x+b.width)
            y2 = Math.max(y2, b.y+b.height)
        }
        return Bounds.fromCorners(new Vector2(x1, y1), new Vector2(x2, y2))
    }

    static empty(): Bounds {
        return new Bounds(0, 0, 0, 0)
    }

    readonly x: number
    readonly y: number
    readonly width: number
    readonly height: number

    constructor(x: number, y: number, width: number, height: number) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
    }

    get left(): number { return this.x }
    get top(): number { return this.y }
    get right(): number { return this.x + this.width }
    get bottom(): number { return this.y + this.height }
    get centerX(): number { return this.x + this.width / 2 }
    get centerY(): number { return this.y + this.height / 2 }
    get centerPos(): Vector2 { return new Vector2(this.centerX, this.centerY) }
    get area(): number { return this.width*this.height }

    get topLeft(): Vector2 { return new Vector2(this.left, this.top) }
    get topRight(): Vector2 { return new Vector2(this.right, this.top) }
    get bottomLeft(): Vector2 { return new Vector2(this.left, this.bottom) }
    get bottomRight(): Vector2 { return new Vector2(this.right, this.bottom) }

    padLeft(amount: number): Bounds {
        return new Bounds(this.x + amount, this.y, this.width - amount, this.height)
    }

    padRight(amount: number): Bounds {
        return new Bounds(this.x, this.y, this.width - amount, this.height)
    }

    padBottom(amount: number): Bounds {
        return new Bounds(this.x, this.y, this.width, this.height - amount)
    }

    padTop(amount: number): Bounds {
        return new Bounds(this.x, this.y + amount, this.width, this.height - amount)
    }

    padWidth(amount: number): Bounds {
        return new Bounds(this.x + amount, this.y, this.width - amount * 2, this.height)
    }

    padHeight(amount: number): Bounds {
        return new Bounds(this.x, this.y + amount, this.width, this.height - amount * 2)
    }

    fromLeft(amount: number): Bounds {
        return this.padRight(this.width - amount)
    }

    fromBottom(amount: number): Bounds {
        return this.padTop(this.height - amount)
    }

    pad(amount: number): Bounds {
        return new Bounds(this.x + amount, this.y + amount, this.width - amount * 2, this.height - amount * 2)
    }

    extend(props: { x?: number, y?: number, width?: number, height?: number }): Bounds {
        return Bounds.fromProps(Object.assign({}, this, props))
    }

    scale(scale: number): Bounds {
        return new Bounds(this.x * scale, this.y * scale, this.width * scale, this.height * scale)
    }

    intersects(otherBounds: Bounds): boolean {
        const r1 = this
        const r2 = otherBounds

        return !(r2.left > r1.right || r2.right < r1.left ||
            r2.top > r1.bottom || r2.bottom < r1.top)
    }

    lines(): Vector2[][] {
        return [
            [this.topLeft, this.topRight],
            [this.topRight, this.bottomRight],
            [this.bottomRight, this.bottomLeft],
            [this.bottomLeft, this.topLeft]
        ]
    }

    boundedPoint(p: Vector2): Vector2 {
        return new Vector2(
            Math.max(Math.min(p.x, this.right), this.left),
            Math.max(Math.min(p.y, this.bottom), this.top)
        )
    }

    containsPoint(x: number, y: number): boolean {
        return x >= this.left && x <= this.right && y >= this.top && y <= this.bottom
    }

    contains(p: Vector2) {
        return this.containsPoint(p.x, p.y)
    }

    encloses(bounds: Bounds) {
        return this.containsPoint(bounds.left, bounds.top) && this.containsPoint(bounds.left, bounds.bottom) && this.containsPoint(bounds.right, bounds.top) && this.containsPoint(bounds.right, bounds.bottom)
    }

    toCSS(): { left: string, top: string, width: string, height: string } {
        return { left: `${this.left}px`, top: `${this.top}px`, width: `${this.width}px`, height: `${this.height}px` }
    }

    toProps(): { x: number, y: number, width: number, height: number } {
        return { x: this.x, y: this.y, width: this.width, height: this.height }
    }

    toArray(): [[number, number], [number, number]] {
        return [[this.left, this.top], [this.right, this.bottom]]
    }

    xRange(): [number, number] {
        return [this.left, this.right]
    }

    yRange(): [number, number] {
        return [this.bottom, this.top]
    }

    equals(bounds: Bounds) {
        return this.x === bounds.x && this.y === bounds.y && this.width === bounds.width && this.height === bounds.height
    }

    // Calculate squared distance between a given point and the closest border of the bounds
    // If the point is within the bounds, returns 0
    distanceToPointSq(p: Vector2) {
        if (this.contains(p))
            return 0

        const cx = Math.max(Math.min(p.x, this.x+this.width), this.x)
        const cy = Math.max(Math.min(p.y, this.y+this.height), this.y)
        return (p.x-cx)*(p.x-cx) + (p.y-cy)*(p.y-cy)
    }

    distanceToPoint(p: Vector2) {
        return Math.sqrt(this.distanceToPointSq(p))
    }
}

export class Grid<T> {
    readonly width: number
    readonly height: number

    private arrType: (new (size: number) => Array<T>)
    private arr: Array<T>

    constructor(arrayType: (new (size: number) => Array<T>), width: number, height: number) {
        this.width = width
        this.height = height
        this.arrType = arrayType
        this.arr = new arrayType(width*height)
    }

    contains(x: number, y: number) {
        return x >= 0 && y >= 0 && x < this.width && y < this.width
    }

    get(x: number, y: number) {
        if (!this.contains(x, y))
            throw new Error(`Out of bounds coordinate ${x},${y}`)

        return this.arr[y + x * this.height]
    }

    getMaybe(x: number, y: number, defaultValue: T) {
        if (!this.contains(x, y))
            return defaultValue

        return this.arr[y + x * this.height]
    }

    set(x: number, y: number, value: T) {
        this.arr[y + x * this.height] = value
    }

    fill(value: T) {
        this.arr.fill(value)
    }

    populate(callback: (x: number, y: number) => T) {
        this.every((x, y) => this.set(x, y, callback(x,y)))
    }

    every(callback: (x: number, y: number) => void) {
        for (let i = 0; i < this.width; i++) {
            for (let j = 0; j < this.height; j++) {
                callback(i, j)
            }
        }
    }

    subgrid(x: number, y: number, width: number, height: number): Grid<T> {
        const grid = new Grid(this.arrType, width, height)
        for (let i = x; i < x+width; i++) {
            for (let j = y; j < y+height; j++) {
                grid.set(i-x, j-y, this.get(i, j))
            }
        }
        return grid
    }

    regionToString(x: number, y: number, width: number, height: number) {
        return this.subgrid(x, y, width, height).toString()
    }

    toString(): string {
        const lines: string[][] = []
        for (let y = 0; y < this.height; y++) {
            const line = []
            for (let x = 0; x < this.width; x++) {
                line.push(_.toString(this.get(x, y)))
            }
            lines.push(line)
        }
        
        // Align the lines for printing
        const maxLen = _.max(lines.map(l => _.max(l.map(v => v.length)))) as number
        for (const line of lines) {
            for (const i of _.range(line.length)) {
                const s = line[i]
                if (s.length < maxLen) {
                    line[i] = s + _.repeat(" ", maxLen-s.length)
                }
            }
        }

        return lines.map(l => l.join(" ")).join("\n")
    }

    printRegion(x: number, y: number, width: number, height: number) {
        log(this.regionToString(x, y, width, height))
    }

    print() {
        log(this.toString())
    }
}

const TinyQueue = require('tinyqueue')
export class PriorityQueue<T> {
    queue: any
    constructor() {
        this.queue = new TinyQueue([], (a: any, b: any) => a.priority - b.priority)
    }

    push(value: T, priority: number) {
        this.queue.push({ value, priority })
    }

    pop(): T {
        return this.queue.pop().value
    }

    get length(): number {
        return this.queue.length
    }
}

/*

class BoundedGrid {
    constructor(width, height) {
        this.arr = new Array(height).fill().map(l => new Array(width).fill(' '))
        this.width = width
        this.height = height
        this.minX = 0
        this.minY = 0
        this.maxX = width-1
        this.maxY = height-1
    }

    get(x, y) {
        return this.arr[y][x]
    }

    set(x, y, value) {
        this.arr[y][x] = value
    }

    toString() {
        const lines = []
        for (let y = this.minY; y <= this.maxY; y++) {
            const line = []
            for (let x = this.minX; x <= this.maxX; x++) {
                line.push(this.get(x, y))
            }
            lines.push(line.join(""))
        }
        return lines.join("\n")
    }

    log() {
        console.log(this.toString())
    }
}

class UnboundedGrid {
    constructor() {
        this.map = new Map()
        this.minX = Infinity
        this.maxX = -Infinity
        this.minY = Infinity
        this.maxY = -Infinity
    }

    get(x, y) {
        return this.map.get(`${x},${y}`)
    }

    set(x, y, value) {
        this.map.set(`${x},${y}`, value)
        if (x < this.minX)
            this.minX = x
        if (x > this.maxX)
            this.maxX = x
        if (y < this.minY)
            this.minY = y
        if (y > this.maxY)
            this.maxY = y
    }

    toString() {
        const lines = []
        for (let y = this.minY; y <= this.maxY; y++) {
            const line = []
            for (let x = this.minX; x <= this.maxX; x++) {
                line.push(this.get(x, y) || " ")
            }
            lines.push(line.join(""))
        }
        return lines.join("\n")
    }

    log() {
        console.log(this.toString())
    }
}
*/