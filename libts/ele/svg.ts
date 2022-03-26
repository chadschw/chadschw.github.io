
class SvgEle extends Ele {
    private static xmlns = "http://www.w3.org/2000/svg";

    constructor(tagName: string) {
        super(document.createElementNS(SvgEle.xmlns, tagName));
        
    }

    setAttrNS(name: string, value: string): SvgEle {
        this.target.setAttributeNS(null, name, value);
        return this;
    }
}

class SvgContainerEle extends SvgEle {
    constructor(tagName: string) {
        super(tagName);
    }

    children(kids: Ele[]): SvgContainerEle {
        kids.forEach(kid => this.target.appendChild(kid.target));
        return this;
    }

    addChild(kid: Ele): SvgContainerEle {
        return this.children([kid]);
    }
}

class ViewBox {
    public _pos: Point = new Point(0, 0,);
    public set Size(s: Point) { 
        this._size = s;
        this.Set();
    }
    private _size: Point = new Point(0, 0);

    public get viewBox() { return `${this._pos.x} ${this._pos.y} ${this._size.x} ${this._size.y}`; }

    public get Scale(): number { return this._scale; }
    private _scale: number = 1.0;

    public Set() {
        this._svg.setAttrNS("viewBox", `${this._pos.x} ${this._pos.y} ${this._size.x} ${this._size.y}`);
    }

    public OnResize(clientSize: Point) {
        this.Size = new Point(clientSize.x / this._scale, clientSize.y / this._scale);
    }

    private _onWheel;
    private _onMouseDown;
    private _onMouseMove;
    private _onMouseUp;
    private _render;

    constructor(private _svg: Svg) { 
        this._onWheel = this.OnWheel.bind(this);
        this._onMouseDown = this.OnMouseDown.bind(this);
        this._onMouseMove = this.OnMouseMove.bind(this);
        this._onMouseUp = this.OnMouseUp.bind(this);
        this._render = this.Render.bind(this);

        this._svg.target.addEventListener("wheel", this._onWheel);
        this._svg.target.addEventListener("mousedown", this._onMouseDown);
    }

    public Unload() {
        this._svg.target.removeEventListener("wheel", this._onWheel);
    }

    private OnWheel(e: Event) {
        e.preventDefault();
        const we = e as WheelEvent;
        this.Zoom(we.deltaY < 0, we);
        console.log(`Scale: ${this._scale}`);
    }

    public ClientPointToSvgPoint(clientPoint: Point): Point {
        // TODO: make this a member variable and update it in an onResize
        const clientRect = this._svg.target.getBoundingClientRect();

        const mouseX = this.ConvertRange(
            clientPoint.x - clientRect.left, 
            0, 
            this._svg.target.clientWidth,
            this._pos.x,
            this._pos.x + this._size.x);
        
            const mouseY = this.ConvertRange(
            clientPoint.y - clientRect.top,
            0,
            this._svg.target.clientHeight,
            this._pos.y,
            this._pos.y + this._size.y);

        return new Point(mouseX, mouseY);
    }

    private Zoom(zoomIn: boolean, e: WheelEvent) {
        
        const svgPoint = this.ClientPointToSvgPoint(new Point(e.clientX, e.clientY));
        
        const adjust = e.ctrlKey ? 1.05 : 1.5;

        this.AdjustScale(zoomIn, adjust);

        let newWidth = this._svg.target.clientWidth / this._scale;
        let newHeight = this._svg.target.clientHeight / this._scale;

        this._pos = new Point(
            this.Zoom1D(svgPoint.x, this._pos.x, this._pos.x + this._size.x, newWidth),
            this.Zoom1D(svgPoint.y, this._pos.y, this._pos.y + this._size.y, newHeight));
        this.Size = new Point(newWidth, newHeight);
        this.Set();
    }

    private ConvertRange(x: number, x1: number, x2: number, y1: number, y2: number) {
        if (x2 === x1) {
            return 0;
        }

        const m = (y2 - y1) / (x2 - x1);
        const b = y1 - (m * x1);
        return m * x + b;
    }

    private AdjustScale(zoomIn: boolean, adjust: number) {
        let newScale = zoomIn ? this._scale * adjust : this._scale / adjust;

        if (newScale > 100) {
            newScale = 100;
        } else if (newScale < 0.01) {
            newScale = 0.01;
        }

        this._scale = newScale;
    }

    private Zoom1D(x: number, start: number, end: number, newWidth: number): number {
        let width = end - start;

        if (width === 0) {
            return 0;
        }

        let devicePixelRatio = (x - start) / width;
        let newStart = x - (newWidth * devicePixelRatio);
        return newStart;
    }

    private _mouseDown = false;
    private _mousePos = new Point(0, 0);
    private _mousePosLast = new Point(0, 0);

    private OnMouseDown(e: MouseEvent) {
        this._mousePosLast.x = this._mousePos.x = e.clientX;
        this._mousePosLast.y = this._mousePos.y = e.clientY;
        this._mouseDown = true;

        window.addEventListener("mousemove", this._onMouseMove);
        window.addEventListener("mouseup", this._onMouseUp);

        this._render();
    }

    private OnMouseMove(e: MouseEvent) {
        if (!this._mouseDown) {
            return;
        }

        this._mousePos.x = e.clientX;
        this._mousePos.y = e.clientY;
    }

    private Render() {
        let delta = new Point(this._mousePos.x, this._mousePos.y);
        delta.Subtract(this._mousePosLast);
        this._mousePosLast.x = this._mousePos.x;
        this._mousePosLast.y = this._mousePos.y;

        delta.x = delta.x / this._scale;
        delta.y = delta.y / this._scale;

        this._pos.Subtract(delta);
        this.Set();
        
        if (this._mouseDown) {
            requestAnimationFrame(this._render);
        }
    }

    private OnMouseUp(e: Event) {
        this._mouseDown = false;
        window.removeEventListener("mousemove", this._onMouseMove);
        window.removeEventListener("mouseup", this._onMouseUp);
    }
}

class Svg extends SvgContainerEle {
    public ViewBox: ViewBox = new ViewBox(this);

    public get target(): SVGElement {
        return this._target as SVGElement
    }

    constructor() {
        super("svg");
    }

    widthHeight(w: number, h: number): Svg {
        this.setAttrNS("width", w.toString());
        this.setAttrNS("height", h.toString());
        return this;
    }

    viewBox(x: number, y: number, w: number, h: number): Svg {
        this.setAttrNS("viewBox", `${x},${y},${w},${h}`);
        return this;
    }
}

class SvgG extends SvgContainerEle {
    public get target(): SVGGElement {
        return this._target as SVGGElement;
    }

    constructor() {
        super("g");
    }
}

class Circle extends SvgEle {
    constructor() {
        super("circle");
    }

    Radius(r: number): Circle {
        this.setAttrNS("r", r.toString());
        return this;
    }

    Center(x: number, y: number): Circle {
        this.setAttrNS("cx", x.toString());
        this.setAttrNS("cy", y.toString());
        return this;
    }
}

class Rect extends SvgEle {
    public get target(): SVGRectElement {
        return this._target as SVGRectElement;
    }

    constructor(x: number, y: number, w: number, h: number) {
        super("rect");
        this.pos(new Point(x, y));
        this.widthHeight(w, h);
    }

    pos(p: Point): Rect {
        this.setAttrNS("x", p.x.toString());
        this.setAttrNS("y", p.y.toString());
        return this;
    }

    widthHeight(w: number, h: number): Rect {
        this.setAttrNS("width", w.toString());
        this.setAttrNS("height", h.toString());
        return this;
    }
}

class Path extends SvgEle {
    constructor() {
        super("path");
    }

    d(str: string): Path {
        this.setAttrNS("d", str);
        return this;
    }

    static randomPath(min: number, max: number, steps: number): string {
        const start = (max - min) / 2
        let s = `M${start},${start} `;
    
        for (let i = 0; i < steps; i++) {
            s += `L${randBetween(min, max)},${randBetween(min, max)} `
        }
    
        return s;
    }
}

class SvgText extends SvgContainerEle {
    public get target(): SVGTextElement {
        return this._target as SVGTextElement
    }
    constructor(text: string = "") {
        super("text");
        if (text.length > 0) {
            this.target.textContent = text;
        }
    }

    pos(x: number, y: number): SvgText {
        this.x(x);
        this.y(y);
        return this;
    }

    x(i: number): SvgText {
        this.setAttrNS("x", i.toString());
        return this;
    }

    y(i: number): SvgText {
        this.setAttrNS("y", i.toString());
        return this;
    }
}

class SvgTSpan extends SvgEle {
    public get target(): SVGTSpanElement {
        return this._target as SVGTSpanElement;
    } 

    constructor(text: string) {
        super("tspan");
        this.target.textContent = text;
    }

    pos(x: number, y: number): SvgTSpan {
        this.x(x);
        this.y(y);
        return this;
    }

    x(i: number): SvgTSpan {
        this.setAttrNS("x", i.toString());
        return this;
    }

    y(i: number): SvgTSpan {
        this.setAttrNS("y", i.toString());
        return this;
    }

    dx(x: string): SvgTSpan {
        this.setAttrNS("dx", x);
        return this;
    }

    dy(y: string): SvgTSpan {
        this.setAttrNS("dy", y);
        return this;
    }
}