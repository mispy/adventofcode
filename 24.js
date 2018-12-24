const { _, log, ...aoc } = require('./dist/util')

function damageTo(att, def) {
    if (def.immune.includes(att.damageType))
        return 0
    else if (def.weak.includes(att.damageType))
        return att.effPower*2
    else
        return att.effPower
}

/** @param {string} input */
function runCombat(input, boost) {
    const lines = aoc.linesTrim(input)

    let immunity = []
    let infection = []
    let side = undefined
    for (let l of lines) {
        if (l === "Immune System:") {
            side = immunity
        } else if (l === "Infection:") {
            side = infection
        } else if (l.length) {
            let [units, hp, damage, initiative] = aoc.ints(l)

            let weak = []
            let immune = []
            const types = l.match(/\((.+?)\)/)
            if (types) {
                for (let s of types[1].split("; ")) {
                    if (s.split(" ")[0] === 'immune')
                        immune.push(...s.split(" ").slice(2).join(" ").split(", "))
                    else 
                        weak.push(...s.split(" ").slice(2).join(" ").split(", "))
                }    
            }

            let damageType = l.match(/does \d+ (.+?) damage/)[1]
            damage = damage + (side === immunity ? boost : 0)

            let g = { units, hp, damage, damageType, initiative, weak, immune, effPower: units*damage, index: side.length+1, side: side === immunity ? 'immunity' : 'infection' }
            // log(l, g)
            side.push(g)
        }
    }

    let armies = [immunity, infection]
    let allGroups = immunity.concat(infection)

    while (true) {
        allGroups = allGroups.filter(g => g.units > 0)
        if (_.uniq(allGroups.map(g => g.side)).length <= 1) {
            break
        }

        allGroups.sort((a, b) => {
            if (a.effPower > b.effPower)
                return -1
            else if (b.effPower > a.effPower)
                return 1
            else if (a.initiative > b.initiative)
                return -1
            else if (b.initiative > a.initiative)
                return 1
            else
                return 0
        })
        const order = allGroups

        /*for (let att of order) {
            for (let def of order) {
                if (att.side !== def.side)
                    log(`${att.side} group ${att.index} would deal defending group ${def.index} ${damageTo(att, def)} damage`)
            }
        }*/
        
        let remainingTargets = _.clone(allGroups)
        let attacks = []
        for (let att of order) {
            let pot = remainingTargets.filter(g => g.side !== att.side)

            let damages = pot.map(p => ({ damageTaken: damageTo(att, p), effPower: p.effPower, initiative: p.effPower, target: p }))
            let choice = _.maxBy(damages, ['damageTaken', 'effPower', 'initiative'])

            if (choice && damageTo(att, choice.target) > 0) {
                attacks.push([att, choice.target])
                remainingTargets = remainingTargets.filter(x => x !== choice.target)    
            }
        }
        attacks = _.sortBy(attacks, att => -att[0].initiative)

        let numActual = attacks.filter(a => damageTo(a[0], a[1]) >= a[1].hp).length
        if (numActual === 0) {
            // Stall
            break
        }

        function combat(att, def) {
            
            let unitsLost = Math.min(def.units, Math.floor(damageTo(att, def) / def.hp))
            // log(att.damageType, att.effPower, def.weak, def.immune, def.hp, def.units, unitsLost)
            // log(`${att.side} group ${att.index} attacks defending group ${def.index}, killing ${unitsLost} units`)
            def.units -= unitsLost
            def.effPower = def.units*def.damage
        }

        for (let [att, def] of attacks) {
            if (att.units > 0)
                combat(att, def)
        }

        // break
    }

    let immSum = _.sum(immunity.map(g => g.units))
    let infSum = _.sum(infection.map(g => g.units))

    log("IMMUNITY", immSum)
    log("INFECTION", infSum)

    if (immSum > infSum)
        return 'immunity'
    else
        return 'infection'
}

function main(input) {
    let boost = 100
    while (true) {
        log(boost)
        let winner = runCombat(input, boost)
        if (winner === 'immunity') {
            log(boost)
            break
        }
        boost += 1
    }
}

function runPuzzle(testCases, actual) {
    // return testCases.map(main)
    main(actual)
}

const testCases = [
`
Immune System:
17 units each with 5390 hit points (weak to radiation, bludgeoning) with an attack that does 4507 fire damage at initiative 2
989 units each with 1274 hit points (immune to fire; weak to bludgeoning, slashing) with an attack that does 25 slashing damage at initiative 3

Infection:
801 units each with 4706 hit points (weak to radiation) with an attack that does 116 bludgeoning damage at initiative 1
4485 units each with 2961 hit points (immune to radiation; weak to fire, cold) with an attack that does 12 slashing damage at initiative 4
`,
`
`,
`    
`
].map(t => t.trim()).filter(t => t.length)

const actual = `
Immune System:
337 units each with 6482 hit points (weak to radiation, fire; immune to cold, bludgeoning) with an attack that does 189 slashing damage at initiative 15
571 units each with 3178 hit points (weak to fire) with an attack that does 47 slashing damage at initiative 12
116 units each with 7940 hit points with an attack that does 638 fire damage at initiative 18
6017 units each with 9349 hit points (weak to cold) with an attack that does 14 cold damage at initiative 6
2246 units each with 4002 hit points (weak to radiation, slashing) with an attack that does 16 cold damage at initiative 3
3950 units each with 4493 hit points (weak to bludgeoning; immune to radiation, fire) with an attack that does 10 radiation damage at initiative 8
7494 units each with 1141 hit points (immune to bludgeoning) with an attack that does 1 cold damage at initiative 17
2501 units each with 9007 hit points with an attack that does 35 cold damage at initiative 7
844 units each with 3222 hit points (immune to bludgeoning, slashing) with an attack that does 37 radiation damage at initiative 9
1371 units each with 3695 hit points (immune to cold) with an attack that does 25 cold damage at initiative 10

Infection:
2295 units each with 16577 hit points (immune to radiation) with an attack that does 12 fire damage at initiative 13
837 units each with 6736 hit points (weak to fire) with an attack that does 14 radiation damage at initiative 19
2841 units each with 9360 hit points (immune to bludgeoning; weak to radiation, cold) with an attack that does 6 fire damage at initiative 14
7374 units each with 51597 hit points (weak to cold; immune to bludgeoning, fire) with an attack that does 12 radiation damage at initiative 1
1544 units each with 29226 hit points (weak to fire, bludgeoning) with an attack that does 35 bludgeoning damage at initiative 5
293 units each with 13961 hit points (immune to slashing; weak to radiation) with an attack that does 79 radiation damage at initiative 2
1219 units each with 38142 hit points (immune to cold, fire) with an attack that does 53 bludgeoning damage at initiative 4
5233 units each with 30595 hit points (weak to bludgeoning, cold; immune to fire) with an attack that does 11 radiation damage at initiative 11
397 units each with 43710 hit points (weak to slashing, radiation; immune to cold, bludgeoning) with an attack that does 171 slashing damage at initiative 16
1316 units each with 36203 hit points (weak to slashing, bludgeoning) with an attack that does 50 cold damage at initiative 20`.trim()

runPuzzle(testCases, actual)