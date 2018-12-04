import * as _ from 'lodash'

let input = ""
let lines = ["test"]

function partOne() {
    console.log(lines)
}

function partTwo() {

}

function main() {
    partOne()
    //partTwo()
}

input = `
waffles
etc
`.trim()

lines = input.split(/\s+/).filter(line => line.trim().length > 0)

main()