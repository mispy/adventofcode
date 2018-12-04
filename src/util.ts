import _ = require('lodash')
const log = console.log
export { _, log }

import fastLevenshtein = require('fast-levenshtein')
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

export function scan(s: string, r: RegExp): string[] {
    const m = s.match(r)
    return m ? m : []
}

// thanks mcpower!
export function ints(s: string): number[] {
    return scan(s, /-?\d+/g).map(v => parseInt(v))
}

export function floats(s: string): number[] {
    return scan(s, /\d+(?:\.\d+)?/g).map(v => parseFloat(v))
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
