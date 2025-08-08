
const pointerPosition = document.getElementById("pointer-position")

let points = []

window.onpointermove = e => {
    const x = e.clientX
    const y = e.clientY

    pointerPosition.textContent = `${x.toFixed(0)},${y.toFixed(0)}`

    if (start === 0 && stop === 0) return

    points.push([x, y, new Date().getTime()])
}

const target1 = document.getElementById("target1")
let start

function OnPointerEnter1() {
    target1.style.backgroundColor = "black"
    start = new Date().getTime()
}

const target2 = document.getElementById("target2")
let stop
const result = document.getElementById("result")

function OnPointerEnter2(e) {
    
    if (start !== 0 && stop === 0) {
        target2.style.backgroundColor = "black"
        stop = new Date().getTime()
        points.push([e.clientX, e.clientY, stop])
        result.textContent = `time: ${stop - start}ms`
        
        RenderPath()
    }
}

function Reset() {
    target1.style.backgroundColor = "transparent"
    target2.style.backgroundColor = "transparent"
    result.textContent = "time: ??"
    points = []
    start = 0
    stop = 0
    pointsContainer.innerHTML = ""
}

window.onpointerdown = e => Reset()

const pointsContainer = document.createElement("div")
pointsContainer.style.position = "absolute"
pointsContainer.style.top = "0"
pointsContainer.style.left = "0"
document.body.appendChild(pointsContainer)

function RenderPath() {
    for (let [x, y, ms] of points) {
        const point = MakePoint(x, y, ms - start)
        pointsContainer.appendChild(point)
    }
}

function MakePoint(x, y, deltaMs) {
    const point = document.createElement("div")
    point.style.position = "absolute"
    point.style.left = x + "px"
    point.style.top = y + "px"
    point.style.width = "2px"
    point.style.height = "2px"
    point.style.backgroundColor = "red"
    //point.textContent = deltaMs

    return point
}