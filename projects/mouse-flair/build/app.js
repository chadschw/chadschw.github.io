"use strict";
class Ele {
    constructor(tagName) {
        if (typeof (tagName) === 'string') {
            this._target = document.createElement(tagName);
        }
        else {
            this._target = tagName;
        }
    }
    get target() { return this._target; }
    classes(classNames) {
        classNames.forEach(className => this.target.classList.add(className));
        return this;
    }
    addClass(className) {
        this.target.classList.add(className);
        return this;
    }
    removeClass(className) {
        this.target.classList.remove(className);
        return this;
    }
    styleAttr(value) {
        this.target.setAttribute("style", value);
        return this;
    }
    addStyleAttr(value) {
        const presStyle = this.target.getAttribute("style");
        if (!presStyle) {
            this.styleAttr(value);
        }
        else {
            this.styleAttr(presStyle + " " + value);
        }
        return this;
    }
    setAttr(name, value) {
        this.target.setAttribute(name, value);
        return this;
    }
}
class HtmlEle extends Ele {
    get target() {
        return this._target;
    }
    constructor(tagName) {
        super(tagName);
    }
    setOnMouseDown(action) {
        this.target.onmousedown = action;
        return this;
    }
    setOnClick(action) {
        this.target.onclick = action;
        return this;
    }
    height(h) {
        this.target.style.height = h + "px";
        return this;
    }
    width(w) {
        this.target.style.width = w + "px";
        return this;
    }
}
class HtmlContainerEle extends HtmlEle {
    constructor(tagName) {
        super(tagName);
    }
    children(kids) {
        kids.forEach(kid => this.target.appendChild(kid.target));
        return this;
    }
    addChild(kid) {
        return this.children([kid]);
    }
}
class Page extends HtmlContainerEle {
    constructor() {
        super(document.body);
    }
}
function page() { return new Page(); }
class Div extends HtmlContainerEle {
    constructor() {
        super("div");
    }
}
function div() { return new Div(); }
class Span extends HtmlContainerEle {
    constructor() {
        super("span");
    }
    textContent(text) {
        this.target.textContent = text;
        return this;
    }
}
function span() { return new Span(); }
class Flex extends Div {
    constructor() {
        super();
        this.addClass("flex");
    }
}
function flex() { return new Flex(); }
class Anchor extends HtmlContainerEle {
    get target() { return this._target; }
    constructor() {
        super("a");
    }
    href(url) {
        this.target.href = url;
        return this;
    }
    setTarget(t = "_blank") {
        this.target.setAttribute("target", t);
        return this;
    }
    download(fileName) {
        this.setAttr("download", fileName);
        return this;
    }
}
function anchor() { return new Anchor(); }
class Img extends HtmlEle {
    get target() { return this._target; }
    constructor() {
        super("img");
    }
    src(url) {
        this.target.src = url;
        return this;
    }
}
function img() { return new Img(); }
class TextInput extends HtmlEle {
    get target() { return this._target; }
    get value() { return this.target.value; }
    set value(v) { this.target.value = v; }
    constructor(initialValue) {
        super("input");
        this.target.type = "input";
        if (initialValue) {
            this.value = initialValue;
        }
    }
    onenter(action) {
        this.target.onkeydown = (e) => {
            if (e.key === "Enter") {
                action(e);
            }
        };
        return this;
    }
    setSpellcheck(value) {
        this.target.setAttribute("spellcheck", value ? "true" : "false");
        return this;
    }
}
function textInput(initialValue) { return new TextInput(initialValue); }
class Button extends HtmlContainerEle {
    constructor() {
        super("button");
    }
    onclick(action) {
        this.target.onclick = action;
        return this;
    }
}
function button() { return new Button(); }
class Video extends HtmlEle {
    get target() { return this.target; }
    constructor() {
        super("video");
    }
    src(s) {
        this.target.src = s;
        return this;
    }
    controls() {
        this.setAttr("controls", "true");
        return this;
    }
}
function video() { return new Video(); }
// Utility functions.
// return a random number where  min <= x < max.
function randBetween(min, max) {
    const delta = max - min;
    const value = Math.random() * delta;
    return min + value;
}
function randomColor(alpha = 1) {
    return `rgba(${randBetween(0, 256)}, ${randBetween(0, 256)}, ${randBetween(0, 256)}, ${alpha})`;
}
/**
     * Modern browsers can download files that aren't from same origin this is a workaround to download a remote file
     * @param `url` Remote URL for the file to be downloaded
     */
function download(url, filename) {
    fetch(url)
        .then(response => response.blob())
        .then(blob => {
        const blobURL = URL.createObjectURL(blob);
        const a = anchor().href(blobURL);
        a.styleAttr("display: none");
        if (filename && filename.length)
            a.download(filename);
        document.body.appendChild(a.target);
        a.target.click();
        document.body.removeChild(a.target);
    })
        .catch((e) => console.error("Download error:", e));
}
class StatesButton extends Button {
    constructor(_states, initialState, _onClickCallback) {
        super();
        this._states = _states;
        this._onClickCallback = _onClickCallback;
        this._buttonSpan = span().textContent(initialState);
        this.addChild(this._buttonSpan);
        this.onclick(this.OnClick.bind(this));
    }
    OnClick(e) {
        let newIdx = this._states.indexOf(this._buttonSpan.target.innerHTML) + 1;
        if (newIdx < 0 || newIdx >= this._states.length) {
            newIdx = 0;
        }
        ;
        this._buttonSpan.textContent(this._states[newIdx]);
        this._onClickCallback(e, this._states[newIdx]);
        return this;
    }
}
class Circle extends Div {
    constructor(_x, _y, radius, ttl = 100, maxVel = 3, _xAcc = 0.0, _yAcc = 0.01) {
        super();
        this._x = _x;
        this._y = _y;
        this._xAcc = _xAcc;
        this._yAcc = _yAcc;
        this._opacity = 1;
        this.ttl = Math.floor(ttl);
        this._opacityStep = 1 / this.ttl;
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
let circles = [];
window.onmousemove = e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
};
let mouseDown = false;
window.onmousedown = e => mouseDown = true;
window.onmouseup = e => mouseDown = false;
window.ontouchstart = e => mouseDown = true;
window.ontouchend = e => mouseDown = false;
function AddCircles(num) {
    for (let i = 0; i < num; i++) {
        const radius = randBetween(2, 5);
        const ttl = randBetween(50, 100);
        const circle = new Circle(mouseX - radius, mouseY - radius, radius, ttl);
        circles.push(circle);
        document.body.appendChild(circle.target);
    }
}
function Render() {
    let toRemove = [];
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
//# sourceMappingURL=app.js.map