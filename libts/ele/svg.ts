
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

class Svg extends SvgEle {
    public get target(): SVGElement {
        return this._target as SVGElement
    }

    constructor() {
        super("svg");
    }

    children(kids: Ele[]): Svg {
        kids.forEach(kid => this.target.appendChild(kid.target));
        return this;
    }

    addChild(kid: Ele): Svg {
        return this.children([kid]);
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