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
        this.classes(["text-input"]);
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
class TextArea extends HtmlEle {
    get target() { return this._target; }
    get value() { return this.target.value; }
    set value(v) { this.target.value = v; }
    constructor(initialValue) {
        super("textarea");
        this.classes(["text-input"]);
        if (initialValue) {
            this.value = initialValue;
        }
    }
    ColsRows(cols, rows) {
        this.setAttr("cols", cols.toString());
        this.setAttr("rows", rows.toString());
        return this;
    }
}
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
class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    Add(other) {
        this.x += other.x;
        this.y += other.y;
    }
    Subtract(other) {
        this.x -= other.x;
        this.y -= other.y;
    }
}
class MouseClickAndDrag {
    constructor(ele, _onDrag) {
        this._onDrag = _onDrag;
        this._boundDrag = e => { };
        this._boundUp = e => { };
        ele.target.addEventListener("mousedown", e => {
            e.preventDefault();
            e.stopPropagation();
            this._boundDrag = this._onDrag.bind(ele);
            this._boundUp = this.OnMouseUp.bind(this);
            window.addEventListener("mousemove", this._boundDrag);
            window.addEventListener("mouseup", this._boundUp);
        });
    }
    OnMouseUp(e) {
        window.removeEventListener("mousemove", this._boundDrag);
        window.removeEventListener("mouseup", this._boundUp);
    }
}
class MouseDownUp {
    constructor(ele, _onDown, _onUp) {
        this._onDown = _onDown;
        this._onUp = _onUp;
        this._boundUp = e => { };
        ele.target.addEventListener("mousedown", e => {
            e.preventDefault();
            e.stopPropagation();
            this._onDown(e);
            this._boundUp = this.OnMouseUp.bind(this);
            window.addEventListener("mouseup", this._boundUp);
        });
    }
    OnMouseUp(e) {
        this._onUp(e);
        window.removeEventListener("mouseup", this._boundUp);
    }
}
function ShortMonthName(d) { return new Intl.DateTimeFormat("en-US", { month: "short" }).format(d); }
function TwoDigit(x, locale = "en-us") {
    return x.toLocaleString(locale, { minimumIntegerDigits: 2 });
}
function hhmm(d) { return d.getHours() + ":" + TwoDigit(d.getMinutes()); }
;
function dayMonthYear(d) { return `${d.getDate()} ${ShortMonthName(d)} ${d.getFullYear()}`; }
class Clock extends Flex {
    constructor() {
        super();
        this.classes(["clock"]);
        this._timeSpan = span().styleAttr("font-size: 2.2rem");
        this._dateSpan = span();
        this.children([
            div().addChild(this._timeSpan),
            div().addChild(this._dateSpan)
        ]);
        setInterval(() => {
            const d = new Date();
            this._timeSpan.textContent(hhmm(d));
            this._dateSpan.textContent(dayMonthYear(d));
        }, 1000);
    }
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
class Theme {
    static IsDark() {
        return document.body.classList.contains(Theme._dark);
    }
    static Toggle() {
        if (Theme.IsDark()) {
            Theme.SetLight();
        }
        else {
            Theme.SetDark();
        }
    }
    static SetLight() {
        if (Theme.IsDark()) {
            document.body.classList.remove(Theme._dark);
        }
    }
    static SetDark() {
        if (!Theme.IsDark()) {
            document.body.classList.add(Theme._dark);
        }
    }
}
Theme._dark = "dark";
class ThemeToggleButton extends Div {
    constructor() {
        super();
        this.classes(["toggle-theme-button"]);
        this.target.style.backgroundColor = Theme.IsDark() ? "transparent" : "var(--foreground-color)";
        this.setOnClick(this.OnClick.bind(this));
    }
    OnClick(e) {
        if (Theme.IsDark()) {
            Theme.SetLight();
        }
        else {
            Theme.SetDark();
        }
    }
}
function themeToggleButton() {
    return new ThemeToggleButton();
}
class ContextMenuItem extends Div {
    constructor(onClick, closeAfterClick = true) {
        super();
        this.onClick = onClick;
        if (closeAfterClick) {
            this.setOnClick((e) => {
                e.stopPropagation();
                onClick();
                if (this.target.parentElement) {
                    this.target.parentElement.style.display = "none";
                }
            });
        }
        else {
            this.setOnClick(e => {
                e.stopPropagation();
                onClick();
            });
        }
        this.target.addEventListener("mousedown", e => e.stopPropagation());
        this.target.addEventListener("mouseup", e => e.stopPropagation());
        this.classes(["context-menu-item"]);
    }
}
class TextContextMenuItem extends ContextMenuItem {
    constructor(text, onclick) {
        super(onclick);
        this.addChild(span().textContent(text));
    }
}
class TextInputContextMenuItem extends ContextMenuItem {
    constructor(textInput) {
        super(() => { });
        this.addChild(textInput);
        textInput.setOnClick(e => textInput.target.select());
        this.setOnClick(e => e.stopPropagation());
    }
}
class ContextMenu extends Div {
    constructor(element, items) {
        super();
        this.children(items);
        this.classes(["context-menu"]);
        element.oncontextmenu = this.OnContextMenu.bind(this);
    }
    OnContextMenu(e) {
        e.preventDefault();
        e.stopPropagation();
        if (this.target.style.display === "block") {
            this.target.style.display = "none";
            return;
        }
        this.target.style.top = e.offsetY + "px";
        this.target.style.left = e.offsetX + "px";
        this.target.style.display = "block";
    }
}
function contextMenu(ele, items) {
    return new ContextMenu(ele, items);
}
class SvgEle extends Ele {
    constructor(tagName) {
        super(document.createElementNS(SvgEle.xmlns, tagName));
    }
    setAttrNS(name, value) {
        this.target.setAttributeNS(null, name, value);
        return this;
    }
}
SvgEle.xmlns = "http://www.w3.org/2000/svg";
class SvgContainerEle extends SvgEle {
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
class ViewBox {
    constructor(_svg) {
        this._svg = _svg;
        this._pos = new Point(0, 0);
        this._size = new Point(0, 0);
        this._scale = 1.0;
        this._mouseDown = false;
        this._mousePos = new Point(0, 0);
        this._mousePosLast = new Point(0, 0);
        this._onWheel = this.OnWheel.bind(this);
        this._onMouseDown = this.OnMouseDown.bind(this);
        this._onMouseMove = this.OnMouseMove.bind(this);
        this._onMouseUp = this.OnMouseUp.bind(this);
        this._render = this.Render.bind(this);
        this._svg.target.addEventListener("wheel", this._onWheel);
        this._svg.target.addEventListener("mousedown", this._onMouseDown);
    }
    set Size(s) {
        this._size = s;
        this.Set();
    }
    get viewBox() { return `${this._pos.x} ${this._pos.y} ${this._size.x} ${this._size.y}`; }
    get Scale() { return this._scale; }
    Set() {
        this._svg.setAttrNS("viewBox", `${this._pos.x} ${this._pos.y} ${this._size.x} ${this._size.y}`);
    }
    OnResize(clientSize) {
        this.Size = new Point(clientSize.x / this._scale, clientSize.y / this._scale);
    }
    Unload() {
        this._svg.target.removeEventListener("wheel", this._onWheel);
    }
    OnWheel(e) {
        e.preventDefault();
        const we = e;
        this.Zoom(we.deltaY < 0, we);
        console.log(`Scale: ${this._scale}`);
    }
    ClientPointToSvgPoint(clientPoint) {
        // TODO: make this a member variable and update it in an onResize
        const clientRect = this._svg.target.getBoundingClientRect();
        const mouseX = this.ConvertRange(clientPoint.x - clientRect.left, 0, this._svg.target.clientWidth, this._pos.x, this._pos.x + this._size.x);
        const mouseY = this.ConvertRange(clientPoint.y - clientRect.top, 0, this._svg.target.clientHeight, this._pos.y, this._pos.y + this._size.y);
        return new Point(mouseX, mouseY);
    }
    Zoom(zoomIn, e) {
        const svgPoint = this.ClientPointToSvgPoint(new Point(e.clientX, e.clientY));
        const adjust = e.ctrlKey ? 1.05 : 1.5;
        this.AdjustScale(zoomIn, adjust);
        let newWidth = this._svg.target.clientWidth / this._scale;
        let newHeight = this._svg.target.clientHeight / this._scale;
        this._pos = new Point(this.Zoom1D(svgPoint.x, this._pos.x, this._pos.x + this._size.x, newWidth), this.Zoom1D(svgPoint.y, this._pos.y, this._pos.y + this._size.y, newHeight));
        this.Size = new Point(newWidth, newHeight);
        this.Set();
    }
    ConvertRange(x, x1, x2, y1, y2) {
        if (x2 === x1) {
            return 0;
        }
        const m = (y2 - y1) / (x2 - x1);
        const b = y1 - (m * x1);
        return m * x + b;
    }
    AdjustScale(zoomIn, adjust) {
        let newScale = zoomIn ? this._scale * adjust : this._scale / adjust;
        if (newScale > 100) {
            newScale = 100;
        }
        else if (newScale < 0.01) {
            newScale = 0.01;
        }
        this._scale = newScale;
    }
    Zoom1D(x, start, end, newWidth) {
        let width = end - start;
        if (width === 0) {
            return 0;
        }
        let devicePixelRatio = (x - start) / width;
        let newStart = x - (newWidth * devicePixelRatio);
        return newStart;
    }
    OnMouseDown(e) {
        this._mousePosLast.x = this._mousePos.x = e.clientX;
        this._mousePosLast.y = this._mousePos.y = e.clientY;
        this._mouseDown = true;
        window.addEventListener("mousemove", this._onMouseMove);
        window.addEventListener("mouseup", this._onMouseUp);
        this._render();
    }
    OnMouseMove(e) {
        if (!this._mouseDown) {
            return;
        }
        this._mousePos.x = e.clientX;
        this._mousePos.y = e.clientY;
    }
    Render() {
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
    OnMouseUp(e) {
        this._mouseDown = false;
        window.removeEventListener("mousemove", this._onMouseMove);
        window.removeEventListener("mouseup", this._onMouseUp);
    }
}
class Svg extends SvgContainerEle {
    constructor() {
        super("svg");
        this.ViewBox = new ViewBox(this);
    }
    get target() {
        return this._target;
    }
    widthHeight(w, h) {
        this.setAttrNS("width", w.toString());
        this.setAttrNS("height", h.toString());
        return this;
    }
    viewBox(x, y, w, h) {
        this.setAttrNS("viewBox", `${x},${y},${w},${h}`);
        return this;
    }
}
class SvgG extends SvgContainerEle {
    get target() {
        return this._target;
    }
    constructor() {
        super("g");
    }
}
class Circle extends SvgEle {
    constructor() {
        super("circle");
    }
    Radius(r) {
        this.setAttrNS("r", r.toString());
        return this;
    }
    Center(x, y) {
        this.setAttrNS("cx", x.toString());
        this.setAttrNS("cy", y.toString());
        return this;
    }
}
class Rect extends SvgEle {
    get target() {
        return this._target;
    }
    constructor(x, y, w, h) {
        super("rect");
        this.pos(new Point(x, y));
        this.widthHeight(w, h);
    }
    pos(p) {
        this.setAttrNS("x", p.x.toString());
        this.setAttrNS("y", p.y.toString());
        return this;
    }
    widthHeight(w, h) {
        this.setAttrNS("width", w.toString());
        this.setAttrNS("height", h.toString());
        return this;
    }
}
class Path extends SvgEle {
    constructor() {
        super("path");
    }
    d(str) {
        this.setAttrNS("d", str);
        return this;
    }
    static randomPath(min, max, steps) {
        const start = (max - min) / 2;
        let s = `M${start},${start} `;
        for (let i = 0; i < steps; i++) {
            s += `L${randBetween(min, max)},${randBetween(min, max)} `;
        }
        return s;
    }
}
class SvgText extends SvgContainerEle {
    get target() {
        return this._target;
    }
    constructor(text = "") {
        super("text");
        if (text.length > 0) {
            this.target.textContent = text;
        }
    }
    pos(x, y) {
        this.x(x);
        this.y(y);
        return this;
    }
    x(i) {
        this.setAttrNS("x", i.toString());
        return this;
    }
    y(i) {
        this.setAttrNS("y", i.toString());
        return this;
    }
}
class SvgTSpan extends SvgEle {
    get target() {
        return this._target;
    }
    constructor(text) {
        super("tspan");
        this.target.textContent = text;
    }
    pos(x, y) {
        this.x(x);
        this.y(y);
        return this;
    }
    x(i) {
        this.setAttrNS("x", i.toString());
        return this;
    }
    y(i) {
        this.setAttrNS("y", i.toString());
        return this;
    }
    dx(x) {
        this.setAttrNS("dx", x);
        return this;
    }
    dy(y) {
        this.setAttrNS("dy", y);
        return this;
    }
}
// class Quote {
//     constructor(public quote: string, public author = "Unknown") {}
// }
// const quotes: Quote[] = [
//     new Quote(
//         "I'm selfish, impatient and a little insecure. I make mistakes, I am out of control and at times hard to handle. But if you can't handle me at my worst, then you sure as hell don't deserve me at my best.",
//         "Marilyn Monroe"
//     ),
//     new Quote(
//         "Two things are infinite: the universe and human stupidity; and I'm not sure about the universe.",
//         "Albert Einstien"
//     ),
//     new Quote(
//         "For instance, on the planet Earth, man had always assumed that he was more intelligent than dolphins because he had achieved so much—the wheel, New York, wars and so on—whilst all the dolphins had ever done was muck about in the water having a good time. But conversely, the dolphins had always believed that they were far more intelligent than man—for precisely the same reasons.",
//         "Douglas Adams"
//     )
// ];
// const quoteSpan = span();
// const authorSpan = span();
// function loadQuote() {
//     const quote = quotes[Math.floor(randBetween(0, quotes.length))];
//     quoteSpan.textContent(quote.quote);
//     authorSpan.textContent("- " + quote.author);
// }
// class MyTextInput  {
//     public Item: TextInputContextMenuItem;
//     private _textInput: TextInput;
//     constructor(initialString: string) {
//         this._textInput = textInput(initialString)
//             .onenter(this.OnEnter.bind(this))
//             .styleAttr(`
//             `) as TextInput;
//         this.Item = new TextInputContextMenuItem(this._textInput);
//     }
//     private OnEnter(e: Event) {
//         alert(`You entered: ${this._textInput.value}`);
//     }
// }
class ArrayIdx {
    constructor(arr, startingIdx = 0) {
        this.arr = arr;
        this.startingIdx = startingIdx;
        this.index = startingIdx;
    }
    next() {
        this.index++;
        if (this.index >= this.arr.length) {
            this.index = 0;
        }
        return this.index;
    }
    prev() {
        this.index--;
        if (this.index < 0) {
            this.index = this.arr.length - 1;
        }
        return this.index;
    }
}
let urls = [
    "https://w.wallhaven.cc/full/j3/wallhaven-j3m8y5.png",
    "https://w.wallhaven.cc/full/l8/wallhaven-l83o92.jpg",
    "https://w.wallhaven.cc/full/l3/wallhaven-l3xk6q.jpg",
    "https://w.wallhaven.cc/full/lm/wallhaven-lmk652.jpg",
    "https://w.wallhaven.cc/full/o5/wallhaven-o55z5l.jpg",
    "https://w.wallhaven.cc/full/p9/wallhaven-p99qv3.jpg",
    "https://w.wallhaven.cc/full/3l/wallhaven-3llyq6.jpg",
    "https://i.redd.it/uhghw2a4yzea1.jpg",
    "https://external-preview.redd.it/xof464Z61S5bWkeydrni-NWm9pLaRmXf8LdngyxTJl0.png?auto=webp&v=enabled&s=6618cbdb36544db8e9f7f199c27834e4d743d768",
    "https://i.redd.it/ksw1nb3t3faa1.png",
    "https://i.redd.it/hkfyvjyav1ea1.jpg",
    "https://i.redd.it/xu6nr0c0jhda1.jpg",
    "https://preview.redd.it/wkp1biib47da1.png?width=3640&format=png&auto=webp&v=enabled&s=4231334731df1be468bc4252cd5092b0c6558387",
    "https://preview.redd.it/j2yf7bna47da1.png?width=3060&format=png&auto=webp&v=enabled&s=ef6f4242dc04ab768fe790a1cab9fe744ab4b308",
    "https://preview.redd.it/4ob0sfya47da1.png?width=1998&format=png&auto=webp&v=enabled&s=5885a578ded71138fdc68159d9c753ce69cbb482",
    "https://preview.redd.it/wj5ccona47da1.jpg?width=5000&format=pjpg&auto=webp&v=enabled&s=91a3f322b543b30d8515208f04594bece0206484",
    "https://i.redd.it/g4crddfnmt9a1.jpg"
];
let arrIdx = new ArrayIdx(urls);
let theDiv = div()
    .styleAttr(`
        background-color: #0f0f0f;
        background-size: cover;
        background-position: center;
        height: 100%;
        width: 100%;
    `);
page().children([
    theDiv
    // flex().addChild(
    //     div()
    //         .children([
    //             div().addChild(quoteSpan).styleAttr(`font-size: 2rem; width: 100%;`),
    //             div().addChild(authorSpan).styleAttr(`text-align:right; width: 100%; font-weight: bold;`)
    //         ])
    //         .setOnClick(loadQuote)
    //         .styleAttr(`
    //             background-color: var(--background-color);
    //             border-radius: var(--border-radius);
    //             box-shadow: 0px 0px 3px 3px var(--shadow-color);
    //             color: var(--foreground-color);
    //             cursor: pointer;
    //             padding: 16px;
    //             width: 400px;
    //         `)
    //     ).styleAttr(`
    //         flex-direction: column;
    //         height: 100%; 
    //         width: 100%;
    //     `),
    // themeToggleButton()
    //     .styleAttr(`
    //         position: absolute;
    //         top: 0;
    //         right: 0;
    //     `),
    // contextMenu(document.body, [
    //     new TextContextMenuItem("Theme", Theme.Toggle),
    //     new TextContextMenuItem("Something Else", () => alert("Hi")),
    //     new MyTextInput("yo yo").Item
    // ])
]);
theDiv.target.style.backgroundImage = `url(${urls[0]})`;
window.addEventListener("wheel", e => {
    let idx = e.deltaY > 0 ? arrIdx.next() : arrIdx.prev();
    theDiv.target.style.backgroundImage = `url(${urls[idx]})`;
});
window.addEventListener("keypress", e => {
    let key = e.key;
    if (key !== 'j' && key !== 'k') {
        return;
    }
    let idx = e.key === 'j' ? arrIdx.next() : arrIdx.prev();
    theDiv.target.style.backgroundImage = `url(${urls[idx]})`;
});
window.addEventListener("mousedown", e => {
    theDiv.target.style.backgroundImage = `url(${urls[arrIdx.next()]})`;
});
//# sourceMappingURL=app.js.map