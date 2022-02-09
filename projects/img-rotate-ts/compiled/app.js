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
function ShortMonthName(d) { return new Intl.DateTimeFormat("en-US", { month: "short" }).format(d); }
function TwoDigit(x, locale = "en-us") {
    return x.toLocaleString(locale, { minimumIntegerDigits: 2 });
}
function hhmm(d) { return d.getHours() + ":" + TwoDigit(d.getMinutes()); }
;
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
            this._dateSpan.textContent(`${d.getDate()} ${ShortMonthName(d)} ${d.getFullYear()}`);
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
    constructor(onClick) {
        super();
        this.onClick = onClick;
        this.setOnClick(onClick);
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
        if (this.target.style.display === "block") {
            this.target.style.display = "none";
            return;
        }
        this.target.style.top = e.clientY + "px";
        this.target.style.left = e.clientX + "px";
        this.target.style.display = "block";
    }
}
function contextMenu(ele, items) {
    return new ContextMenu(ele, items);
}
class MyTextInput {
    constructor(initialString) {
        this._textInput = textInput(initialString)
            .onenter(this.OnEnter.bind(this))
            .styleAttr(`
                
            `);
        this.Item = new TextInputContextMenuItem(this._textInput);
    }
    OnEnter(e) {
        alert(`You entered: ${this._textInput.value}`);
    }
}
class MouseClickAndDrag {
    constructor(ele, _onDrag) {
        this._onDrag = _onDrag;
        ele.target.addEventListener("mousedown", e => {
            e.preventDefault();
            const boundDrag = this._onDrag.bind(ele);
            window.addEventListener("mousemove", boundDrag);
            window.addEventListener("mouseup", e => window.removeEventListener("mousemove", boundDrag));
        });
    }
}
class Cube extends Flex {
    constructor(_xPos = 0, _yPos = 0) {
        super();
        this._xPos = _xPos;
        this._yPos = _yPos;
        this._xRot = 0;
        this._yRot = 0;
        this.classes(["cube"]);
        this.children([
            flex().addChild(span().textContent("back")).classes(["cube-face", "cube-back"]),
            flex().addChild(span().textContent("front is the fun place to be! Do you know any good jokes?")).classes(["cube-face", "cube-front"]),
            flex().addChild(span().textContent("left")).classes(["cube-face", "cube-left"]),
            flex().addChild(span().textContent("right " + hhmm(new Date()))).classes(["cube-face", "cube-right"]),
            flex().addChild(span().textContent("top")).classes(["cube-face", "cube-top"]),
            flex().addChild(span().textContent("bottom")).classes(["cube-face", "cube-bottom"])
            // flex().addChild(
            //     img()
            //         .src("")
            //         .setAttr("height", "200px")
            //     ).classes(["cube-face", "cube-bottom"])
        ]);
        this.setStyle();
        new MouseClickAndDrag(this, this.OnDrag);
    }
    OnDrag(e) {
        this._xPos += e.movementX / 2;
        this._yPos += e.movementY / 2;
        this._xRot += -e.movementY / 2;
        this._yRot += e.movementX / 2;
        this.setStyle();
    }
    setStyle() {
        this.target.style.transform = `
            perspective(var(--perspective)) 
            translateX(${this._xPos}px)
            translateY(${this._yPos}px)
            rotateX(${this._xRot}deg) 
            rotateY(${this._yRot}deg)
        `;
    }
}
page().children([
    flex().children([
        new Cube(),
        new Cube(400, 0),
        new Cube(-400, 0),
        new Cube(0, 400),
        new Cube(0, -400),
    ]).styleAttr(`
        flex-direction: column;
        height: 100%; 
        width: 100%;
    `),
    contextMenu(document.body, [
        new TextContextMenuItem("Theme", Theme.Toggle),
        new TextContextMenuItem("Something Else", () => alert("Hi")),
        new MyTextInput("yo yo").Item
    ])
]);
//# sourceMappingURL=app.js.map