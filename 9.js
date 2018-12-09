const { _, log, runSamples, ...aoc } = require('./dist/util')
const doublyLinkedListFn = require('@datastructures-js/doubly-linked-list');
const dll = doublyLinkedListFn();


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
function main(lines) {
    const [numPlayers, lastMarble] = aoc.ints(lines[0])

    let node = new Node(0)
    node.insertBetween(node, node) // Circular
    const scores = Array(numPlayers).fill(0)

    let marble = 1
    let player = 0
    while (marble <= lastMarble) {
        if (marble % 23 === 0) {
            scores[player] += marble

            _.times(7, () => node = node.prev)
            scores[player] += node.value

            // Remove node
            let newNode = node.next
            node.remove()
            node = newNode
        } else {
            const newNode = new Node(marble)
            newNode.insertBetween(node.next, node.next.next)
            node = newNode
        }

        marble += 1
        player += 1
        if (player >= numPlayers)
            player = 0
    }

    log(_.max(scores))
}

runSamples(main, [
`
405 players; last marble is worth 7170000 points
`,
`

`,
`

`
])