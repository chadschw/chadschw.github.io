class Circle extends Div {
    public ttl: number;
    private staticStyle: string;
    private _xVel: number; 
    private _yVel: number;
    private _opacity = 1;
    private _opacityStep: number;
    
    constructor(
        private _x: number, 
        private _y: number, 
        radius: number, 
        ttl: number = 100,
        maxVel = 3,
        private _xAcc = 0.0,
        private _yAcc = 0.01
        ) {
        super();
        this.ttl = Math.floor(ttl);
        this._opacityStep = 1/this.ttl;
        const diameter = radius * 2;
        this._xVel = randBetween(-maxVel, maxVel);
        this._yVel = randBetween(-maxVel, maxVel);

        this.staticStyle = `
            width: ${diameter}px;
            height: ${diameter}px;
            border-radius: ${radius}px;
            background-color: ${randomColor()};
            position: absolute;
        `;

        this.SetStyle();
    }

    SetStyle() {
        this.styleAttr(this.staticStyle + `left: ${this._x}px; top: ${this._y}px; opacity: ${this._opacity};`);
    }

    Move() {
        this._x += this._xVel;
        this._xVel += this._xAcc;
        this._y += this._yVel;
        this._yVel += this._yAcc;
        this._opacity -= this._opacityStep;
        this.SetStyle();
    }
}

let mouseX = 0;
let mouseY = 0;

let circles: Circle[] = [];

window.onmousemove = e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
}

let mouseDown = false;
window.onmousedown = e => mouseDown = true;
window.onmouseup = e => mouseDown = false;
window.ontouchstart = e => mouseDown = true;
window.ontouchend = e => mouseDown = false;

function AddCircles(num: number) {
    for (let i = 0; i < num; i++) {
        const radius = randBetween(2, 5);
        const ttl = randBetween(50, 100)
        const circle = new Circle(mouseX - radius, mouseY - radius, radius, ttl);
        circles.push(circle);
        document.body.appendChild(circle.target);
    }
}

function Render() {
    let toRemove: Circle[] = [];

    for (let circle of circles) {
        if (--circle.ttl === 0) {
            toRemove.push(circle);
            continue;
        }

        circle.Move();
    }

    toRemove.forEach(circle => {
        document.body.removeChild(circle.target);
        circles.splice(circles.indexOf(circle), 1);
    });

    if (mouseDown) {
        //if (circles.length < 200) {
            AddCircles(randBetween(1, 5));
        //}
    }
    
    requestAnimationFrame(Render);
}

Render();