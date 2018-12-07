const { _, log, runSamples, Vector2, Bounds, ...aoc } = require('./dist/util')

/** @param {string[]} lines */
function main(lines) {
    let steps = {}
    function ensureStep(step) {
        if (!steps[step])
            steps[step] = { id: step, prereqs: [] }
    }
    for (const line of lines) {
        step1 = (line.match(/Step (.) /)||[])[1]
        step2 = (line.match(/step (.) /)||[])[1]
        ensureStep(step1)
        ensureStep(step2)

        steps[step2].prereqs.push(step1)
    }

    const alp = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
    function timeTaken(step) {
        return 60+alp.indexOf(step)+1
    }


    let time = 0
    const numWorkers = 5

    let workers = []
    for (let i = 0; i < numWorkers; i++) {
        workers.push({ activeTask: null, timeRemaining: null })
    }

    const done = []

    while (done.length < _.values(steps).length) {
        let availableTasks = _.sortBy(_.values(steps).filter(s => s.prereqs.length === 0 && done.indexOf(s.id) === -1 && !_.some(workers, worker => worker.activeTask === s.id)).map(s => s.id))

        if (availableTasks.length) {
            for (let worker of workers) {
                if (!worker.activeTask) {
                    const x = availableTasks.shift()
                    worker.activeTask = x
                    worker.timeRemaining = timeTaken(x)
    
                    if (availableTasks.length === 0)
                        break
                }
            }    
        }
        
        const minTime = _(workers).map(w => w.timeRemaining).filter(w => w).min()
        time += minTime
        for (let worker of workers) {
            if (worker.activeTask) {
                worker.timeRemaining -= minTime
                if (worker.timeRemaining <= 0) {
                    done.push(worker.activeTask)
    
                    for (const step of _.values(steps)) {
                        step.prereqs = step.prereqs.filter(s => s !== worker.activeTask)
                    }
    
                    worker.activeTask = null
                    worker.timeRemaining = null
                }    
            }
        }
    }

    log(time)
}

runSamples(main, [
/*`
Step C must be finished before step A can begin.
Step C must be finished before step F can begin.
Step A must be finished before step B can begin.
Step A must be finished before step D can begin.
Step B must be finished before step E can begin.
Step D must be finished before step E can begin.
Step F must be finished before step E can begin.
`,*/
`
Step A must be finished before step I can begin.
Step M must be finished before step Q can begin.
Step B must be finished before step S can begin.
Step G must be finished before step N can begin.
Step Y must be finished before step R can begin.
Step E must be finished before step H can begin.
Step K must be finished before step L can begin.
Step H must be finished before step Z can begin.
Step C must be finished before step P can begin.
Step W must be finished before step U can begin.
Step V must be finished before step L can begin.
Step O must be finished before step N can begin.
Step U must be finished before step I can begin.
Step D must be finished before step P can begin.
Step Q must be finished before step L can begin.
Step F must be finished before step Z can begin.
Step L must be finished before step N can begin.
Step P must be finished before step S can begin.
Step I must be finished before step S can begin.
Step S must be finished before step R can begin.
Step T must be finished before step N can begin.
Step N must be finished before step X can begin.
Step Z must be finished before step J can begin.
Step R must be finished before step J can begin.
Step J must be finished before step X can begin.
Step E must be finished before step I can begin.
Step T must be finished before step R can begin.
Step I must be finished before step N can begin.
Step K must be finished before step C can begin.
Step B must be finished before step D can begin.
Step K must be finished before step T can begin.
Step E must be finished before step P can begin.
Step F must be finished before step I can begin.
Step O must be finished before step U can begin.
Step I must be finished before step J can begin.
Step S must be finished before step Z can begin.
Step L must be finished before step J can begin.
Step F must be finished before step T can begin.
Step F must be finished before step P can begin.
Step I must be finished before step T can begin.
Step G must be finished before step S can begin.
Step V must be finished before step U can begin.
Step F must be finished before step R can begin.
Step L must be finished before step R can begin.
Step Y must be finished before step D can begin.
Step M must be finished before step E can begin.
Step U must be finished before step L can begin.
Step C must be finished before step D can begin.
Step W must be finished before step N can begin.
Step S must be finished before step N can begin.
Step O must be finished before step S can begin.
Step B must be finished before step T can begin.
Step V must be finished before step T can begin.
Step S must be finished before step X can begin.
Step V must be finished before step P can begin.
Step F must be finished before step L can begin.
Step P must be finished before step R can begin.
Step D must be finished before step N can begin.
Step C must be finished before step L can begin.
Step O must be finished before step Q can begin.
Step N must be finished before step Z can begin.
Step Y must be finished before step L can begin.
Step B must be finished before step K can begin.
Step P must be finished before step Z can begin.
Step V must be finished before step Z can begin.
Step U must be finished before step J can begin.
Step Q must be finished before step S can begin.
Step H must be finished before step F can begin.
Step E must be finished before step O can begin.
Step D must be finished before step F can begin.
Step D must be finished before step X can begin.
Step L must be finished before step S can begin.
Step Z must be finished before step R can begin.
Step K must be finished before step X can begin.
Step M must be finished before step V can begin.
Step A must be finished before step M can begin.
Step B must be finished before step W can begin.
Step A must be finished before step P can begin.
Step W must be finished before step Q can begin.
Step R must be finished before step X can begin.
Step M must be finished before step H can begin.
Step F must be finished before step S can begin.
Step K must be finished before step Q can begin.
Step Y must be finished before step Q can begin.
Step W must be finished before step S can begin.
Step Q must be finished before step T can begin.
Step K must be finished before step H can begin.
Step K must be finished before step D can begin.
Step E must be finished before step T can begin.
Step Y must be finished before step E can begin.
Step A must be finished before step O can begin.
Step G must be finished before step E can begin.
Step C must be finished before step O can begin.
Step G must be finished before step H can begin.
Step Y must be finished before step I can begin.
Step V must be finished before step S can begin.
Step B must be finished before step R can begin.
Step B must be finished before step X can begin.
Step V must be finished before step I can begin.
Step N must be finished before step J can begin.
Step H must be finished before step I can begin.
`,
`

`,
`

`
])