const { _, log, ...aoc } = require('./dist/util')

let regs = [0, 0, 0, 0, 0, 0]

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
    regs[l.c] = regs[l.a] | regs[l.b]
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
const regNames = ['x', 'y', 'z', 'ip', 'j', 'q']


function resolveArgs(lineNumber, inst) {
    const {opcode, args} = inst
    const l = args
    let a = regNames[l.a]
    let b = regNames[l.b]
    let c = regNames[l.c]

    if (a === 'ip')
        a = lineNumber
    if (b === 'ip')
        b = lineNumber
    //if (c === 'ip')
    //    c = lineNumber 


    if (opcode === 'addi')
        return [a, l.b, c]
    else if (opcode === 'seti')
        return [l.a, '.', c]
    else if (opcode === 'mulr')
        return [a, b, c]
    else if (opcode === 'eqrr')
        return [a, b, c]
    else if (opcode === 'addr')
        return [a, b, c]
    else if (opcode === 'gtrr')
        return [a, b, c]
    else if (opcode === 'muli')
        return [a, l.b, c]
    else if (opcode === 'setr')
        return [a, '.', c]
}

function partTwo() {
    let x = 1
    let y = 0
    let z = 0
    let i = 0
    let j = 0
    let q = 0
    
    // START
    z += 2
    z *= z
    z *= 19
    z *= 11
    j += 2
    j *= 22
    j += 2
    z += j
    
    if (x > 0) {
        j = 27
        j *= 28
        j += 29
        j *= 30
        j *= 14
        j *= 32
        z += j	
        x = 0
    }
    
    /*y = 1
    while (y <= z) {
        q = 1
        while (q <= z) {
            j = y * q
    
            if (j === z) {
                x += y
            }
    
            q += 1	
        }
    
        y += 1	
    }*/

    while (y <= z) {
        if (z % y === 0)
            x += y
        y += 1
    }

    log(x)
}

/** @param {string} input */
function main(input) {
    // const { grid, width, height } = aoc.grid(input)
    const lines = aoc.linesTrim(input)
    let ipReg = aoc.ints(lines[0])[0]

    const insts = lines.slice(1).map((l, i) => {
        const ints = aoc.ints(l)
        const [a, b, c] = ints
        return {
        index: i+1,
        opcode: l.split(" ")[0],
        args: { a, b, c }
    }})

    partTwo()

    return    

    /*let j = 0
    for (const inst of insts) {
        const l = inst.args


        const args = resolveArgs(j, inst)

        const unknowns = _.uniq(args.slice(0, -1).filter(s => _.isString(s) && s !== '.'))

        log(inst.opcode, resolveArgs(j, inst), unknowns)

        j += 1
    }
    return*/

    //log(insts.map((s, i) => `${i} ${s.opcode} ` + makeReadable(i, s)).join("\n"))
    //return

    regs[0] = 1
    let i = 0
    let ip = regs[ipReg]

    // IP NEEDS TO BE >= 36
    while (ip < insts.length) {
        i += 1

        const oldReg1 = regs[1]

        regs[ipReg] = ip
        const inst = insts[ip]

        ops[inst.opcode](inst.args)

        // seti 2 2 3 - sets ip to 2
        // addi 3 1 3 - sets ip to ip + 1

        // addr 3 4 3 - sets ip to ip + 4
        // seti 1 5 3 - sets ip to 1

        if (ip !== regs[ipReg]) {
            //const l = inst.args

            //if (inst.index !== 7 && inst.index !== 12)
            //    log(i, ip, regs[ipReg], lines[inst.index], regs)
        }

        if (oldReg1 !== regs[1]) {//ip !== regs[ipReg]) {
            const l = inst.args
        //    log(i, ip, regs[ipReg], lines[inst.index], regs)
        }
        

        ip = regs[ipReg]
        ip += 1

        if (inst.index === 25)
            log(lines[inst.index], regs)

        //if (i > 100000000)
        //    log(inst.index, lines[inst.index], regs)

//        log(i, regs.map(r => `${r}, ${r / i}`).join(" - "))
    }

    log(regs[0])
}

function runPuzzle(testCases, actual) {
    // testCases.map(main)
    main(actual)
}

const testCases = [
`
#ip 0
seti 5 0 1
seti 6 0 2
addi 0 1 0
addr 1 2 3
setr 1 0 0
seti 8 0 4
seti 9 0 5
`,
`
`,
`    
`
].map(t => t.trim()).filter(t => t.length)

const actual = `
#ip 3
addi 3 16 3
seti 1 7 1
seti 1 7 5
mulr 1 5 4
eqrr 4 2 4

addr 4 3 3
addi 3 1 3
addr 1 0 0
addi 5 1 5
gtrr 5 2 4
addr 3 4 3
seti 2 2 3
addi 1 1 1
gtrr 1 2 4
addr 4 3 3
seti 1 5 3
mulr 3 3 3

addi 2 2 2
mulr 2 2 2
mulr 3 2 2
muli 2 11 2
addi 4 2 4
mulr 4 3 4
addi 4 2 4
addr 2 4 2
addr 3 0 3
seti 0 8 3
setr 3 8 4
mulr 4 3 4
addr 3 4 4
mulr 3 4 4
muli 4 14 4
mulr 4 3 4
addr 2 4 2
seti 0 7 0
seti 0 9 3`.trim()

runPuzzle(testCases, actual)


function makeReadable(lineNumber, inst) {
    const {opcode, args} = inst
    const l = args
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
    else 
        throw new Error(opcode)

    if (c === 'ip')
        s = s + ' + 1'
    return s
}