class Circle extends Div {
    public ttl: number;
    private staticStyle: string;
    private _xVel: number; 
    private _yVel: number;
    private _opacity = 1;
    private _opacityStep: number;
    private _radius: number;
    private _radiusStep: number;
    
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
        this._radius = radius;
        this._radiusStep = radius/this.ttl;
        const diameter = radius * 2;
        this._xVel = randBetween(-maxVel, maxVel);
        this._yVel = randBetween(-maxVel, maxVel);

        this.staticStyle = `
            background-color: ${randomColor()};
            position: absolute;
        `;

        this.SetStyle();
    }

    SetStyle() {
        const diameter = this._radius * 2;
        const changedStyle = `
            width: ${diameter}px;
            height: ${diameter}px;
            border-radius: ${this._radius}px;
            left: ${this._x}px; 
            top: ${this._y}px; 
            opacity: ${this._opacity};
        `;
        
        this.styleAttr(this.staticStyle + changedStyle);
    }

    Move() {
        this._x += this._xVel;
        this._xVel += this._xAcc;
        this._y += this._yVel;
        this._yVel += this._yAcc;
        
        this._opacity -= this._opacityStep;

        this._radius -= this._radiusStep;

        this.SetStyle();
    }
}