class Vector {
    static FromMagAng(mag, ang) {
        const v = new Vector()
        v.mag = mag
        v.ang = ang
        return v
    }

    static FromXY(x, y) {
        const v = new Vector()
        v.x = x
        v.y = y
        return v
    }

    set mag(m) {
        this._mag = m
        this._UpdateXY()
    }
    get mag() {
        return this._mag
    }

    set ang(a) {
        this._ang = a
        this._UpdateXY()
    }
    get ang() {
        return this._ang
    }

    set x(newX) {
        this._x = newX;
        this._UpdateMagAng()
    }
    get x() {
        return this._x
    }

    set y(newY) {
        this._y = newY;
        this._UpdateMagAng()
    }
    get y() {
        return this._y
    }

    constructor() {
        this.mag = 1
        this.ang = 0
    }

    SetMagAng(mag, ang) {
        this._mag = mag
        this._ang = ang
        this._UpdateXY()
    }

    SetXY(x, y) {
        this._x = x
        this._y = y
        this._UpdateMagAng()
    }

    Copy() {
        return Vector.FromXY(this.x, this.y)
    }

    Add(other) {
        const x = this.x + other.x
        const y = this.y + other.y
        this.SetXY(x, y)
    }

    DistanceTo(other) {
        const x = Math.abs(this.x - other.x)
        const y = Math.abs(this.y - other.y)
        return Vector.FromXY(x, y).mag
    }

    _UpdateXY() {
        this._x = this.mag * Math.cos(this.ang)
        this._y = this.mag * Math.sin(this.ang)
    }

    _UpdateMagAng() {
        const x2 = this._x * this._x
        const y2 = this._y * this._y

        this._mag = Math.sqrt(x2 + y2)
        this.ang = Math.atan2(this._y, this._x)
    }

    ToString() {
        return `Mag: ${this.mag.toFixed(2)} Ang: ${this.ang.toFixed(2)} X: ${this.x.toFixed(2)} Y: ${this.y.toFixed(2)}`
    }
}

function VectorTests() {
    let v = Vector.FromMagAng(1, 0)
    console.log(v.ToString())

    v = Vector.FromMagAng(2, Math.PI / 2)
    console.log(v.ToString())

    v = Vector.FromMagAng(3, Math.PI)
    console.log(v.ToString())

    v = Vector.FromMagAng(4, -Math.PI / 2)
    console.log(v.ToString())

    v = Vector.FromXY(10, 0)
    console.log(v.ToString())

    v = Vector.FromXY(0, 10)
    console.log(v.ToString())

    let a = Vector.FromXY(0, 0)
    let b = Vector.FromXY(1, 1)
    console.log(a.DistanceTo(b))
    console.log(b.DistanceTo(a))
}

class Const {
    static HelpString = "Move ship 1: wasd. Move ship 2: arrow keys. Change time scale: mouse wheel. Play/Pause: space bar. Reset: escape."

    static GroundFriction = 0.93

    static AngleUp = -Math.PI / 2
    static AngleDown = Math.PI / 2
    static AngleLeft = Math.PI
    static AngleRight = 0

    static AccelerationUp = Vector.FromMagAng(0.6, this.AngleUp)
    static AccelerationDown = Vector.FromMagAng(0.6, this.AngleDown)
    static AccelerationLeft = Vector.FromMagAng(0.2, this.AngleLeft)
    static AccelerationRight = Vector.FromMagAng(0.2, this.AngleRight)

    static GravityEnabled = true
    static AccelerationGravity = Vector.FromMagAng(0.1, this.AngleDown)    // 0.1 is nice and floaty

    static RadToDeg(rad) {
        return rad * 180 / Math.PI
    }

    static DegToRad(deg) {
        return deg * Math.PI / 180
    }

    static TimeScale = 1
    static MaxTimeScale = 2
    static MinTimeScale = 0.1
    static TimeScaleStep = 0.1

    static Pause = false
    static GameOver = false
    static frameCount = 0
}

class Ship {
    constructor(shipEle, position, initialVelocity, GetBoundingRect) {
        // todo: would be better to create a bounding rect around the ship.
        this.yOffsetToTop = 10
        this.yOffsetToBottom = 10
        this.xOffsetToTip = 20

        this.shipEle = shipEle
        this.position = position

        // Velocity is the speed of something in a given direction.
        // Magnitude of this vector is speed.
        // Angle of this vector is direction.
        this.velocity = initialVelocity

        this.GetBoundingRect = GetBoundingRect
    }

    render() {
        if (Const.GravityEnabled) {
            this.velocity.Add(Const.AccelerationGravity)
        }

        const pos = this.position

        if (Const.TimeScale !== 1) {
            const scaledVelocity = Vector.FromMagAng(this.velocity.mag * Const.TimeScale, this.velocity.ang)
            pos.Add(scaledVelocity)
        }
        else {
            pos.Add(this.velocity)
        }


        const boundingRect = this.GetBoundingRect()
        if (pos.y + this.yOffsetToBottom > boundingRect.bottom) {
            pos.y = boundingRect.bottom - this.yOffsetToBottom
            this.velocity.y = 0
            this.velocity.ang = Const.AngleUp
        } else if (pos.y - this.yOffsetToTop < 0) {
            // uncomment to enforce ceiling.
            // pos.y = this.yOffsetToTop
            // this.velocity.y = 0
        }

        if (pos.x > boundingRect.width + this.xOffsetToTip) {
            pos.x = -this.xOffsetToTip
        } else if (pos.x < -this.xOffsetToTip) {
            pos.x = boundingRect.width + this.xOffsetToTip
        }

        if (pos.y == boundingRect.bottom - this.yOffsetToBottom) {
            this.velocity.mag *= Const.GroundFriction
        }

        const xy = `${pos.x} ${pos.y}`
        this.shipEle.setAttribute("transform", `rotate(${Const.RadToDeg(this.velocity.ang) + 90} ${xy}) translate(${xy})`)
        this.position = pos
    }
}

class Tail {
    constructor(tailEle, initialPosition, length) {
        this.tailEle = tailEle
        this.length = length
        this.points = []
        for (let i = 0; i < this.length; i++) {
            this.points.push(initialPosition.Copy())
        }
    }

    addPoint(p) {
        this.points.unshift(p)
        this.points.pop(p)
    }

    render() {
        let d = `M${this.points[0].x},${this.points[0].y} `

        for (let i = 1; i < this.points.length; i++) {
            d += `L${this.points[i].x},${this.points[i].y} `
        }

        this.tailEle.setAttribute("d", d)
    }

    Reset = position => {
        this.points = []
        for (let i = 0; i < this.length; i++) {
            this.points.push(position.Copy())
        }
    }
}

class Block {
    constructor(blockEle, position, size, getBoundingClientRect) {
        this.blockEle = blockEle
        this.position = position
        this.size = size
        this.getBoundingClientRect = getBoundingClientRect

        const rect = this.getBoundingClientRect()
        this.position.y = rect.height / 2
    }

    render() {
        const halfWidth = this.size.x / 2
        const halfHeight = this.size.y / 2
        this.blockEle.setAttribute("transform", `translate(${this.position.x - halfWidth} ${this.position.y - halfHeight})`)
        this.blockEle.setAttribute("width", `${this.size.x}`)
        this.blockEle.setAttribute("height", `${this.size.y}`)
    }
}


function init() {
    //VectorTests()
    new App()
}

class App {
    constructor() {
        this.svgEle = document.getElementById("canvas")
        window.addEventListener("resize", this.onresize)
        this.onresize(null)

        this.textEle = document.getElementById("text")

        this.pressedKeys = []
        window.addEventListener("keydown", this.onkeydown)
        window.addEventListener("keyup", this.onkeyup)

        window.addEventListener("wheel", this.onwheel)
        window.addEventListener("pointerdown", this.onpointerdown)

        const blockEle = document.getElementById("block")
        this.block = new Block(blockEle, Vector.FromXY(300, 0), Vector.FromXY(10, 10), this.GetBoundingRect)
        this.block.render()

        const shipEle = document.getElementById("ship")
        this.ship = new Ship(shipEle, Vector.FromXY(100, 100), Vector.FromMagAng(1, Const.AngleUp), this.GetBoundingRect)

        const shipTailEle = document.getElementById("ship-tail")
        this.shipTail = new Tail(shipTailEle, this.ship.position, 75)

        const ship2Ele = document.getElementById("ship2")
        this.ship2 = new Ship(ship2Ele, Vector.FromXY(200, 100), Vector.FromMagAng(1, Const.AngleUp), this.GetBoundingRect)

        this.lastTimestamp = 0
        this.render()
    }

    onresize = e => {
        this.svgRect = this.svgEle.getBoundingClientRect()
        console.log(this.svgRect)
    }

    GetBoundingRect = () => {
        return this.svgRect
    }

    WriteText = (text) => {
        this.textEle.textContent = text
    }

    onkeydown = e => {
        // The we've already registered the pressed key, return.
        if (this.pressedKeys.indexOf(e.key) >= 0) return
        this.pressedKeys.push(e.key)

        console.log(e.key)

        if (this.isKeyDown(' ')) {
            if (Const.GameOver) {
                this.reset()
            } else {
                Const.Pause = !Const.Pause
            }
        }

        if (this.isKeyDown('Escape')) {
            this.reset()
        }
    }

    reset = () => {
        Const.Pause = false

        this.ship.velocity = Vector.FromXY(0, 0)
        this.ship.position = Vector.FromXY(100, this.GetBoundingRect().bottom)
        this.shipTail.Reset(this.ship.position)

        this.ship2.velocity = Vector.FromXY(0, 0)
        this.ship2.position = Vector.FromXY(150, this.GetBoundingRect().bottom)

        if (Const.GameOver) {
            Const.frameCount = 0
            Const.GameOver = false
            this.render()
        }
    }

    onkeyup = e => {
        const idx = this.pressedKeys.indexOf(e.key)
        this.pressedKeys.splice(idx, 1)
    }

    onwheel = e => {
        if (e.deltaY < 0) {
            Const.TimeScale = Math.min(Const.MaxTimeScale, Const.TimeScale + Const.TimeScaleStep)
        } else {
            Const.TimeScale = Math.max(Const.MinTimeScale, Const.TimeScale - Const.TimeScaleStep)
        }
    }

    render = timestamp => {
        if (Const.Pause) {
            this.WriteText("Paused. Press space bar to play. " + Const.HelpString)
            requestAnimationFrame(this.render)
            return
        }

        Const.frameCount++

        if (this.isKeyDown('w')) {
            this.ship.velocity.mag += .2
        }
        if (this.isKeyDown('s')) {
            this.ship.velocity.mag -= .2
        }
        if (this.isKeyDown('a')) {
            this.ship.velocity.ang -= Const.DegToRad(5)
        }
        if (this.isKeyDown('d')) {
            this.ship.velocity.ang += Const.DegToRad(5)
        }
        this.ship.render()
        this.shipTail.addPoint(this.ship.position.Copy())
        this.shipTail.render()

        if (this.isKeyDown('ArrowUp')) {
            this.ship2.velocity.mag += .2
        }
        if (this.isKeyDown('ArrowDown')) {
            this.ship2.velocity.mag -= .2
        }
        if (this.isKeyDown('ArrowLeft')) {
            this.ship2.velocity.ang -= Const.DegToRad(5)
        }
        if (this.isKeyDown('ArrowRight')) {
            this.ship2.velocity.ang += Const.DegToRad(5)
        }
        this.ship2.render()

        //this.WriteText(`(${this.ship.position.x.toFixed(0)},${this.ship.position.y.toFixed(0)}) (${this.ship.velocity.mag.toFixed(1)},${this.ship.velocity.ang.toFixed(2)})`)

        // const deltaT = timestamp - this.lastTimestamp
        // this.lastTimestamp = timestamp
        // this.WriteText(`delta t: ${deltaT.toFixed(1)}ms`)

        const d1 = this.ship.position.DistanceTo(this.block.position)
        const d2 = this.ship2.position.DistanceTo(this.block.position)
        if (d1 < this.block.size.x / 2) {
            this.setWinner(1)
        }
        else if (d2 < this.block.size.x / 2) {
            this.setWinner(2)
        }
        else {
            this.WriteText(`TimeScale: ${Const.TimeScale.toFixed(1)}. Distance: ${d1.toFixed(1)}. FrameCount: ${Const.frameCount}`)
        }

        if (!Const.GameOver) {
            requestAnimationFrame(this.render)
        }
    }

    setWinner = shipNumber => {
        Const.GameOver = true
        this.WriteText(`Ship ${shipNumber} wins! Press 'Esc' or 'space bar' to reset. frameCount: ${Const.frameCount}`)
    }

    isKeyDown(key) {
        return this.pressedKeys.indexOf(key) >= 0
    }

    onpointerdown = e => {
        const mousepos = Vector.FromXY(e.clientX, e.clientY)
        console.log(mousepos)

        this.block.position = mousepos
        this.block.render()
    }
}
