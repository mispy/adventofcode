const { _, log, ...aoc } = require('./dist/util')

let regs = [1, 0, 0, 0, 0, 0]

function addr(l) {
    regs[l.c] = regs[l.a] + regs[l.b]
}

function addi(l) {
    regs[l.c] = regs[l.a] + l.b
}

function mulr(l) {
    regs[l.c] = regs[l.a] * regs[l.b]
}

function muli(l) {
    regs[l.c] = regs[l.a] * l.b
}

function banr(l) {
    regs[l.c] = regs[l.a] & regs[l.b]
}

function borr(l) {
    regs[l.c] = regs[l.a] | l.b
}

function bori(l) {
    regs[l.c] = regs[l.a] | l.b
}

function bani(l) {
    regs[l.c] = regs[l.a] & l.b
}

function setr(l) {
    regs[l.c] = regs[l.a]
}

function seti(l) {
    regs[l.c] = l.a
}

function gtir(l) {
    if (l.a > regs[l.b])
        regs[l.c] = 1 
    else
        regs[l.c] = 0
}

function gtri(l) {
    if (regs[l.a] > l.b)
        regs[l.c] = 1 
    else
        regs[l.c] = 0
}

function gtrr(l) {
    if (regs[l.a] > regs[l.b])
        regs[l.c] = 1 
    else
        regs[l.c] = 0
}

function eqir(l) {
    if (l.a === regs[l.b])
        regs[l.c] = 1 
    else
        regs[l.c] = 0
}

function eqri(l) {
    if (regs[l.a] === l.b)
        regs[l.c] = 1 
    else
        regs[l.c] = 0
}

function eqrr(l) {
    if (regs[l.a] === regs[l.b])
        regs[l.c] = 1 
    else
        regs[l.c] = 0
}


const ops = {addr, addi, mulr, muli, banr, bani, borr, bori, setr, seti, gtir, gtri, gtrr, eqir, eqri, eqrr}


/** @param {string} input */
function main(input) {

    let lines = aoc.linesTrim(input)

    const insts = lines.slice(1).map((l, i) => {
        const ints = aoc.ints(l)
        const [a, b, c] = ints
        return {
        index: i+1,
        opcode: l.split(" ")[0],
        a, b, c
    }})
    const regNames = ['x', 'y', 'z', 'ip', 'j', 'q']
//    log(insts.map((s, i) => `${i} ${s.opcode} ` + makeReadable(i, s)).join("\n"))
    let ipReg = 3

    function makeReadable(lineNumber, l) {
        const {opcode} = l
        let a = regNames[l.a]
        let b = regNames[l.b]
        let c = regNames[l.c]
    
        if (a === 'ip')
            a = lineNumber
        if (b === 'ip')
            b = lineNumber
        //if (c === 'ip')
        //    c = lineNumber 
    
    
        let s
        if (opcode === 'addi')
            s = `${c} = ${a} + ${l.b}`
        else if (opcode === 'seti')
            s = `${c} = ${l.a}`
        else if (opcode === 'mulr')
            s = `${c} = ${a} * ${b}`
        else if (opcode === 'eqrr')
            s = `${c} = ${a} === ${b} ? 1 : 0`
        else if (opcode === 'addr')
            s = `${c} = ${a} + ${b}`
        else if (opcode === 'gtrr')
            s = `${c} = ${a} > ${b} ? 1 : 0`
        else if (opcode === 'muli')
            s = `${c} = ${a} * ${l.b}`
        else if (opcode === 'setr')
            s = `${c} = ${a}`
        else if (opcode === 'bani')
            s = `${c} = ${a} & ${l.b}`
        else if (opcode === 'eqri')
            s = `${c} = ${a} === ${l.b} ? 1 : 0`
        else if (opcode === 'bori')
            s = `${c} = ${a} | ${l.b}`
        else if (opcode === 'gtir')
            s = `${c} = ${l.a} > ${b} ? 1 : 0`
        else 
            throw new Error(opcode)

        if (c === 'ip')
            s = s + ' + 1'
        return s
    }


    // IP NEEDS TO BE >= 36
    let instsPassed
    let poss = new Set()
    function nextInstruction() {
        instsPassed += 1

        const l = insts[regs[ipReg]]

        if (l.index-1 === 28 && !poss.has(regs[1])) {
            //log(regs[1], instsPassed)
            poss.add(regs[1])
            log(regs[1])
        }

        ops[l.opcode](l)

        regs[ipReg] += 1
    }


    function runOriginal() {  
        instsPassed = 0      
        while (regs[ipReg] < insts.length) {
            nextInstruction()

            if (poss.size >= 10)
                break
        }    
        let pos = Array.from(poss)
        pos = _.sortBy(pos, p => -p[1])
        // log(pos)
    }

    // let i = 0
    // while (true) {
    //     instsPassed = 0
    //     regs[0] = i
    //     while (ip < insts.length) {
    //         log(insts[ip])
    //         nextInstruction()
    //         if (instsPassed > 10)
    //             break
    //     }    
    //     break

    //     log(i, instsPassed)
    //     if (instsPassed < 10000000)
    //         break
    //     i += 1000
    // }


    let ii = 0
    function runProgram() {
        let [x, y, z, i, j, q] = regs
        let pos = new Set()

        // START
        /*y = 123
        while (true) {
            if ((y & 456) === 72)
                break
        }*/
        
        y = 0
        while (true) {
            j = y | 65536
            y = 3798839
        
            while (true) {
                q = j & 255
                y += q
        
                y = y & 16777215
                y = y * 65899
                y = y & 16777215
        
                if (256 > j)
                    break
        
                q = 0
        
                while (true) {
                    z = q+1
                    z *= 256

                    if (z > j)
                        break

                    q += 1
                }
        
                j = q
            }
            
            if (!pos.has(y)) {
                pos.add(y)
                log(y)
            }
            if (y === x)
                break
        }        
    }

    log("ORIGINAL")
    runOriginal()
    log("PROGRAM")
    runProgram()
}

function runPuzzle(testCases, actual) {
    // testCases.map(main)
    main(actual)
}

const testCases = [
`
`,
`
`,
`    
`
].map(t => t.trim()).filter(t => t.length)

const actual = `
#ip 3
seti 123 0 1
bani 1 456 1
eqri 1 72 1
addr 1 3 3
seti 0 0 3
seti 0 7 1
bori 1 65536 4
seti 3798839 3 1
bani 4 255 5
addr 1 5 1
bani 1 16777215 1
muli 1 65899 1
bani 1 16777215 1
gtir 256 4 5
addr 5 3 3
addi 3 1 3
seti 27 6 3
seti 0 2 5
addi 5 1 2
muli 2 256 2
gtrr 2 4 2
addr 2 3 3
addi 3 1 3
seti 25 3 3
addi 5 1 5
seti 17 1 3
setr 5 6 4
seti 7 8 3
eqrr 1 0 5
addr 5 3 3
seti 5 6 3
`.trim()

runPuzzle(testCases, actual)