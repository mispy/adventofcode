const { _, log, runSamples, Vector2, Bounds, ...aoc } = require('./dist/util')

function manhattanDist(v1, v2) {
    return Math.abs(v1.x-v2.x) + Math.abs(v1.y-v2.y)
}

/** @param {string[]} lines */
function main(lines) {
    const coords = lines.map(l => ({ vec: Vector2.fromArray(aoc.ints(l)), total: 0, infinite: false }))

    let minX = _.min(coords.map(c => c.vec.x))
    let maxX = _.max(coords.map(c => c.vec.x))
    let minY = _.min(coords.map(c => c.vec.y))
    let maxY = _.max(coords.map(c => c.vec.y))

    for (let i = minX-5; i < maxX+5; i++) {
        for (let j = minY-5; j < maxY+5; j++) {
            const p = new Vector2(i, j)
            const dists = coords.map(c => ({ coord: c, dist: manhattanDist(p, c.vec) }))
            const sDists = _.sortBy(dists, d => d.dist)
            if (sDists[0].dist !== sDists[1].dist) {
                sDists[0].coord.total += 1
                if (i < minX || i > maxX || j < minY || j > maxY) {
                    sDists[0].coord.infinite = true
                }
            }
        }
    }

    let sorted = _.sortBy(coords.filter(c => !c.infinite), c => -c.total)
    log(sorted)

    /*let area = 0
    for (let i = minX-5; i < maxX+5; i++) {
        for (let j = minY-5; j < maxY+5; j++) {
            const p = new Vector2(i, j)
            let totalDist = 0
            for (let c of coords) {
                totalDist += manhattanDist(p, c.vec)
            }

            if (totalDist < 10000) {
                area += 1
            }
        }
    }

    log(area)*/

}

runSamples(main, [
`
1, 1
1, 6
8, 3
3, 4
5, 5
8, 9
`,
`
162, 168
86, 253
288, 359
290, 219
145, 343
41, 301
91, 214
166, 260
349, 353
178, 50
56, 79
273, 104
173, 118
165, 47
284, 235
153, 69
116, 153
276, 325
170, 58
211, 328
238, 346
333, 299
119, 328
173, 289
44, 223
241, 161
225, 159
266, 209
293, 95
89, 86
281, 289
50, 253
75, 347
298, 241
88, 158
40, 338
291, 156
330, 88
349, 289
165, 102
232, 131
338, 191
178, 335
318, 107
335, 339
153, 156
88, 119
163, 268
159, 183
162, 134
`,
`

`
])