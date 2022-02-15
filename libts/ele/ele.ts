class Ele {
    public get target(): Element { return this._target; }
    protected _target: Element;

    constructor(tagName: string | Element) {
        if (typeof(tagName) === 'string') {
            this._target = document.createElement(tagName);
        } else {
            this._target = tagName;
        }
    }

    classes(classNames: string[]): Ele {
        classNames.forEach(className => this.target.classList.add(className));
        return this;
    }

    addClass(className: string): Ele {
        this.target.classList.add(className);
        return this;
    }

    removeClass(className: string): Ele {
        this.target.classList.remove(className);
        return this;
    }

    styleAttr(value: string): Ele {
        this.target.setAttribute("style", value);
        return this;
    }

    addStyleAttr(value: string): Ele {
        const presStyle = this.target.getAttribute("style");
        if (!presStyle) {
            this.styleAttr(value);
        } else {
            this.styleAttr(presStyle + " " + value);
        }
        return this;
    }

    setAttr(name: string, value: string): Ele {
        this.target.setAttribute(name, value);
        return this;
    }
}

class HtmlEle extends Ele {
    public get target(): HTMLElement {
        return this._target as HTMLElement;
    }

    constructor(tagName: string | HTMLElement) {
        super(tagName);
    }

    setOnMouseDown(action: (e: Event) => void): HtmlEle {
        this.target.onmousedown = action;
        return this;
    }

    setOnClick(action: (e: Event) => void): HtmlEle {
        this.target.onclick = action;
        return this;
    }

    height(h: number): HtmlEle {
        this.target.style.height = h + "px";
        return this;
    }

    width(w: number): HtmlEle {
        this.target.style.width = w + "px";
        return this;
    }
}

class HtmlContainerEle extends HtmlEle {
    constructor(tagName: string | HTMLElement) {
        super(tagName);
    }

    children(kids: Ele[]): HtmlContainerEle {
        kids.forEach(kid => this.target.appendChild(kid.target));
        return this;
    }

    addChild(kid: Ele): HtmlContainerEle {
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
function div(): Div { return new Div(); }

class Span extends HtmlContainerEle {
    constructor() { 
        super("span"); 
    }
    
    textContent(text: string): Span { 
        this.target.textContent = text; return this; 
    } 
}
function span(): Span { return new Span(); }

class Flex extends Div {
    constructor() {
        super();
        this.addClass("flex");
    }
}
function flex(): Flex { return new Flex(); }

class Anchor extends HtmlContainerEle {
    public get target(): HTMLAnchorElement { return this._target as HTMLAnchorElement; }

    constructor() {
        super("a");
    }

    href(url: string): Anchor {
        this.target.href = url;
        return this;
    }

    setTarget(t: string = "_blank"): Anchor {
        this.target.setAttribute("target", t);
        return this;
    }

    download(fileName: string): Anchor {
        this.setAttr("download", fileName);
        return this;
    }
}
function anchor() { return new Anchor(); }

class Img extends HtmlEle {
    public get target() { return this._target as HTMLImageElement; }

    constructor() {
        super("img");
    }

    src(url: string): Img {
        this.target.src = url;
        return this;
    }
}
function img() { return new Img(); }

class TextInput extends HtmlEle {
    public get target(): HTMLInputElement { return this._target as HTMLInputElement; }
    get value(): string { return this.target.value; }
    set value(v: string) { this.target.value = v; }

    constructor(initialValue: string) {
        super("input");
        this.classes(["text-input"])
        this.target.type = "input";
        if (initialValue) {
            this.value = initialValue;
        }
    }

    onenter(action: (e: Event) => void): TextInput {
        this.target.onkeydown = (e) => {
            if (e.key === "Enter") {
                action(e);
            }
        };
        return this;
    }

    setSpellcheck(value: boolean) {
        this.target.setAttribute("spellcheck", value ? "true" : "false");
        return this;
    }
}

function textInput(initialValue: string) { return new TextInput(initialValue); }

class TextArea extends HtmlEle {
    public get target(): HTMLTextAreaElement { return this._target as HTMLTextAreaElement; }
    get value(): string { return this.target.value; }
    set value(v: string) { this.target.value = v; }

    constructor(initialValue: string) {
        super("textarea");
        this.classes(["text-input"]);
        if (initialValue) {
            this.value = initialValue;
        }
    }

    ColsRows(cols: number, rows: number): TextArea {
        this.setAttr("cols", cols.toString())
        this.setAttr("rows", rows.toString())
        return this;
    }
}

class Button extends HtmlContainerEle {
    constructor() {
        super("button");
    }

    onclick(action: (e: Event) => void): Button {
        this.target.onclick = action;
        return this;
    }
}
function button() { return new Button(); }

class Video extends HtmlEle {
    public get target(): HTMLVideoElement { return this.target as HTMLVideoElement; }

    constructor() {
        super("video");
    }

    src(s: string): Video {
        this.target.src = s;
        return this;
    }

    controls(): Video {
        this.setAttr("controls", "true");
        return this;
    }
}
function video() { return new Video(); }

// Utility functions.
// return a random number where  min <= x < max.
function randBetween(min: number, max: number) {
    const delta = max-min;
    const value = Math.random() * delta;
    return min + value;
}

function randomColor(alpha: number = 1) {
    return `rgba(${randBetween(0, 256)}, ${randBetween(0, 256)}, ${randBetween(0, 256)}, ${alpha})`;
}

/**
     * Modern browsers can download files that aren't from same origin this is a workaround to download a remote file
     * @param `url` Remote URL for the file to be downloaded
     */
function download(url: string, filename: string) {
    fetch(url)
        .then(response => response.blob())
        .then(blob => {
            const blobURL = URL.createObjectURL(blob);

            const a = anchor().href(blobURL);
            a.styleAttr("display: none");

            if (filename && filename.length) a.download(filename);
            document.body.appendChild(a.target);
            a.target.click();
            document.body.removeChild(a.target);
        })
        .catch((e) => console.error("Download error:", e));
}

class Point {
    constructor(public x: number, public y: number) {

    }

    Add(other: Point) {
        this.x += other.x;
        this.y += other.y;
    }

    Subtract(other: Point) {
        this.x -= other.x;
        this.y -= other.y;
    }
}

class MouseClickAndDrag {
    private _boundDrag: (e: MouseEvent) => void = e => {};
    private _boundUp: (e: MouseEvent) => void = e => {};

    constructor(ele: Ele, private _onDrag: (e: MouseEvent) => void) {
        ele.target.addEventListener("mousedown", e => {
            e.preventDefault();
            e.stopPropagation();
            this._boundDrag = this._onDrag.bind(ele);
            this._boundUp = this.OnMouseUp.bind(this);
            window.addEventListener("mousemove", this._boundDrag);
            window.addEventListener("mouseup", this._boundUp);
        })
    }

    OnMouseUp(e: Event) {
        window.removeEventListener("mousemove", this._boundDrag)
        window.removeEventListener("mouseup", this._boundUp)
    }
}

class MouseDownUp {
    private _boundUp: (e: MouseEvent) => void = e => {};

    constructor(ele: Ele, private _onDown: (e: MouseEvent) => void, private _onUp: (e: MouseEvent) => void) {
        ele.target.addEventListener("mousedown", e => {
            e.preventDefault();
            e.stopPropagation();
            this._onDown(e as MouseEvent);
            this._boundUp = this.OnMouseUp.bind(this);
            window.addEventListener("mouseup", this._boundUp);
        })
    }

    OnMouseUp(e: MouseEvent) {
        this._onUp(e);
        window.removeEventListener("mouseup", this._boundUp);
    }
}

function ShortMonthName(d: Date): string { return new Intl.DateTimeFormat("en-US", { month: "short" }).format(d); }

function TwoDigit(x: number, locale: string = "en-us"): string {
    return x.toLocaleString(locale, { minimumIntegerDigits: 2});
}

function hhmm(d: Date): string { return d.getHours() + ":" + TwoDigit(d.getMinutes()) };

function dayMonthYear(d: Date): string { return `${d.getDate()} ${ShortMonthName(d)} ${d.getFullYear()}`; }

class Clock extends Flex {
    private _timeSpan: Span;
    private _dateSpan: Span;

    constructor() {
        super();
        this.classes(["clock"]);
        
        this._timeSpan = span().styleAttr("font-size: 2.2rem") as Span;
        this._dateSpan = span();

        this.children([
            div().addChild(this._timeSpan),
            div().addChild(this._dateSpan)
        ])

        setInterval(() => {
            const d = new Date();
            this._timeSpan.textContent(hhmm(d))
            this._dateSpan.textContent(dayMonthYear(d))
        }, 1000)
    }
}

class StatesButton extends Button {
    private _buttonSpan: Span;

    constructor(
        private _states: string[], 
        initialState: string, 
        private _onClickCallback: (e: Event, str: string) => void) {

        super();
        this._buttonSpan = span().textContent(initialState);
        this.addChild(this._buttonSpan);
        this.onclick(this.OnClick.bind(this));
    }

    OnClick(e: Event): Button {
        let newIdx = this._states.indexOf(this._buttonSpan.target.innerHTML) + 1;
        if (newIdx < 0 || newIdx >= this._states.length) {
            newIdx = 0;
        };
        this._buttonSpan.textContent(this._states[newIdx]);
        this._onClickCallback(e, this._states[newIdx]);
        return this;
    }
}

class Theme {
    private static _dark = "dark";
    
    static IsDark(): boolean {
        return document.body.classList.contains(Theme._dark);
    }

    static Toggle(): void {
        if (Theme.IsDark()) {
            Theme.SetLight();
        } else {
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

class ThemeToggleButton extends Div {
    constructor() {
        super();
        this.classes(["toggle-theme-button"]);

        this.target.style.backgroundColor = Theme.IsDark() ? "transparent" : "var(--foreground-color)";
        this.setOnClick(this.OnClick.bind(this));
    }

    OnClick(e: Event) {
        if (Theme.IsDark()) {
            Theme.SetLight();
        } else {
            Theme.SetDark();
        }
    }
}

function themeToggleButton() {
    return new ThemeToggleButton();
}

abstract class ContextMenuItem extends Div {
    constructor(public onClick: () => void, closeAfterClick = true) {
        super();
        if (closeAfterClick) {
            this.setOnClick((e: Event) => {
                onClick(); 
                if (this.target.parentElement) {
                    this.target.parentElement.style.display = "none";
                }
            });
        } else {
            this.setOnClick(onClick);
        }
        
        this.classes(["context-menu-item"]);
    }
}

class TextContextMenuItem extends ContextMenuItem {
    constructor(text: string, onclick: () => void) {
        super(onclick);
        this.addChild(span().textContent(text));
    }
}

class TextInputContextMenuItem extends ContextMenuItem {
    constructor(textInput: TextInput) {
        super(() => {});
        this.addChild(textInput);
        textInput.setOnClick(e => textInput.target.select());
        this.setOnClick(e => e.stopPropagation());
    }
}

class ContextMenu extends Div {
    constructor(element: HTMLElement, items: ContextMenuItem[]) {
        super();
        this.children(items);
        this.classes(["context-menu"]);
        element.oncontextmenu = this.OnContextMenu.bind(this);
    }

    OnContextMenu(e: MouseEvent) {
        e.preventDefault();
        e.stopPropagation();

        if (this.target.style.display === "block") {
            this.target.style.display = "none";
            return;
        }

        this.target.style.top = e.clientY + "px";
        this.target.style.left = e.clientX + "px";
        this.target.style.display = "block";
    }
}

function contextMenu(ele: HTMLElement, items: ContextMenuItem[]) {
    return new ContextMenu(ele, items);
}