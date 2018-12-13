const { _, log, runSamples, ...aoc } = require('./dist/util')
const fs = require('fs')

function turnLeft(dir) {
    if (dir === "^")
        return "<"
    else if (dir === "<")
        return "v"
    else if (dir === "v")
        return ">"
    else if (dir === ">")
        return "^"    
}

function turnRight(dir) {
    if (dir === "^")
        return ">"
    else if (dir === ">")
        return "v"
    else if (dir === "v")
        return "<"
    else if (dir === "<")
        return "^"    
}


/** @param {string[]} lines */
function main() {
    const lines = fs.readFileSync("./input-13.txt", "utf8").split("\n")
    const maxX = _.max(lines.map(l => l.length))
    const maxY = lines.length

    /*for (let i = 0; i < lines.length; i++) {
        if (lines[i].length < maxX)
            lines[i] = lines[i] + _.repeat(" ", maxX-lines[i].length)
    }*/

    const cartChars = ['^', 'v', '<', '>']
    const carts = []

    for (let y = 0; y < maxY; y++) {
        for (let x = 0; x < maxX; x++) {
            const ch = lines[y][x]

            if (cartChars.includes(ch)) {
                carts.push({ dir: ch, history: [], turnCount: 0, x: x, y: y })
                const a = Array.from(lines[y])
                a[x] = '.'
                lines[y] = a.join("")
            }
        }
    }

    function print() {
        const lines2 = _.clone(lines.map(s => _.clone(s)))
        for (const cart of carts) {
            lines2[cart.y][cart.x] = cart.dir
        }
        log(lines2.join("\n"))
    }

    let collision = null
    while (true) {
        carts.sort((a, b) => {
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
        })

        for (const cart of carts) {
            if (cart.destroyed)
                continue
            
            if (cart.dir === "^")
                cart.y -= 1
            else if (cart.dir === "v")
                cart.y += 1
            else if (cart.dir === "<")
                cart.x -= 1
            else if (cart.dir === ">")
                cart.x += 1

            const ch = lines[cart.y][cart.x]
            if (ch === "/") {
                if (cart.dir === "<" || cart.dir === ">")
                    cart.dir = turnLeft(cart.dir)
                else
                    cart.dir = turnRight(cart.dir)
            } else if (ch === "\\") {
                if (cart.dir === ">" || cart.dir === "<")
                    cart.dir = turnRight(cart.dir)
                else
                    cart.dir = turnLeft(cart.dir)
            } else if (ch === "+") {
                if (cart.turnCount === 0)
                    cart.dir = turnLeft(cart.dir)
                else if (cart.turnCount === 2)
                    cart.dir = turnRight(cart.dir)
                
                if (cart.turnCount < 2)
                    cart.turnCount += 1
                else
                    cart.turnCount = 0
            } else if (!['-', '|', '.'].includes(ch)) {
                console.log(ch)
            }

            // Detect collisions
            for (const b of carts) {
                if (cart !== b && !b.destroyed && cart.x === b.x && cart.y === b.y) {                    
                    collision = [cart, cart.x, cart.y]
                    cart.destroyed = true
                    b.destroyed = true
                    break
                }
            }

            cart.history.push([cart.dir, ch])
        }

        if (carts.filter(c => !c.destroyed).length === 1)
            break
    }

    const cart = carts.find(c => !c.destroyed)
    log(cart.x, cart.y)
}

runSamples(main, [
/*String.raw`
/->-\        
|   |  /----\
| /-+--+-\  |
| | |  | v  |
\-+-/  \-+--/
  \------/ 
`,*/
String.raw`
waffles
`,
`

`
])