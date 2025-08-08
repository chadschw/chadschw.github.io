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

    Add(other) {
        const x = this.x + other.x
        const y = this.y + other.y
        this.SetXY(x, y)
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
}

class Const {
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
        pos.Add(this.velocity)

        const boundingRect = this.GetBoundingRect()
        if (pos.y + this.yOffsetToBottom > boundingRect.bottom) {
            pos.y = boundingRect.bottom - this.yOffsetToBottom
            this.velocity.y = 0
            this.velocity.ang = Const.AngleUp
        } else if (pos.y - this.yOffsetToTop < 0) {
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

        const shipEle = document.getElementById("ship")
        this.ship = new Ship(shipEle, Vector.FromXY(100, 100), Vector.FromMagAng(1, Const.AngleUp), this.GetBoundingRect)

        const ship2Ele = document.getElementById("ship2")
        this.ship2 = new Ship(ship2Ele, Vector.FromXY(200, 100), Vector.FromMagAng(1, Const.AngleUp), this.GetBoundingRect)

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
        if (this.pressedKeys.indexOf(e.key) >= 0) return
        this.pressedKeys.push(e.key)
    }

    onkeyup = e => {
        const idx = this.pressedKeys.indexOf(e.key)
        this.pressedKeys.splice(idx, 1)
    }

    render = () => {
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
        requestAnimationFrame(this.render)
    }

    isKeyDown(key) {
        return this.pressedKeys.indexOf(key) >= 0
    }
}
