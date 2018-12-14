const { _, log, runSamples, ...aoc } = require('./dist/util')

class Node {
    constructor(value) {
        this.value = value
    }

    insertBetween(node1, node2) {
        this._prev = node1
        this._next = node2
        node1._next = this
        node2._prev = this
    }

    append(node2) {
        this._next = node2
        node2._prev = this
    }

    prepend(node2) {
        this._prev = node2
        node2._next = this
    }

    remove() {
        this._prev._next = this._next
        this._next._prev = this._prev
        this._prev = null
        this._next = null
    }

    get next() {
        return this._next
    }

    get prev() {
        return this._prev
    }
}

/** @param {string[]} lines */
/*function main(lines) {
    const input = lines[0]
    const numDigits = Array.from(input).length

    let firstElf = new Node(3)
    let secondElf = new Node(7)
    firstElf.prepend(firstElf)
    firstElf.append(secondElf)
    secondElf.append(firstElf)

    let start = firstElf
    let end = secondElf
    let count = 2

    while (true) {
        const firstValue = firstElf.value
        const secondValue = secondElf.value
        const digits = firstValue + secondValue
        const newRecipes = Array.from(digits.toString()).map(s => parseInt(s))

        for (const recipe of newRecipes) {
            count += 1
            end.append(new Node(recipe))
            end = end.next
        }
        end.append(start)

        for (const i in _.range(firstValue+1)) {
            firstElf = firstElf.next
        }

        for (const i in _.range(secondValue+1)) {
            secondElf = secondElf.next
        }

        if (recipes.length > input+10) {
            console.log(recipes.slice(input, input+10).join(""))
            break
        }

        //if (count > 10) break

        let w = start
        chs = []
        while (true) {
            chs.push(w.value)
            if (w === end)
                break
            w = w.next
        }
        console.log(chs)
        if (count > 10)
            break

        let walk = end
        let chars = []
        for (let i = 0; i < numDigits; i++) {
            chars.push(walk.value)
            walk = walk.prev
        }
        chars.reverse()

        if (chars.join("") === input) {
            console.log(count-numDigits)
            break
        }
    }
}*/

function getDigits(n) {
    return Array.from(n.toString()).map(s => parseInt(s))

    if (n < 10)
        return [n]

    let output = []
    let b = n
    while (b) {
        output.unshift(b % 10)
        b = Math.floor(b/10)
    }
    return output
}

/** @param {string[]} lines */
function main(lines) {
    const input = parseInt(lines[0])
    const targetDigits = Array.from(lines[0]).map(s => parseInt(s))

    const recipes = [3, 7]

    let firstElf = 0
    let secondElf = 1

    let matchIndex = 0

    while (true) {
        const firstValue = recipes[firstElf]
        const secondValue = recipes[secondElf]
        const sum = firstValue+secondValue
        const newRecipes = getDigits(sum)
        for (const recipe of newRecipes) {
            if (recipe === targetDigits[matchIndex]) {
                matchIndex += 1
            } else if (recipe === targetDigits[0]) {
                matchIndex = 1
            } else {
                matchIndex = 0
            }
    
            recipes.push(recipe)

            if (matchIndex >= targetDigits.length) {
                console.log(recipes.length-targetDigits.length)
                break
            }
        }

        if (matchIndex >= targetDigits.length) {
            break
        }

        firstElf += 1 + firstValue
        secondElf += 1 + secondValue
        while (firstElf >= recipes.length) firstElf -= recipes.length
        while (secondElf >= recipes.length) secondElf -= recipes.length

        /*if (recipes.length > input+10) {
            console.log(recipes.slice(input, input+10).join(""))
            break
        }*/
    }
}

runSamples(main, [
`
51589
`,
`
01245
`,
`
92510
`,
`
59414
`,
`
190221
`
])