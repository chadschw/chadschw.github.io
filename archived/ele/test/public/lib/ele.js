
class Ele {
    constructor(tagName) {
        if (typeof(tagName) === 'string') {
            this.target = document.createElement(tagName);
        } else {
            this.target = tagName;
        }
        
    }

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
    }

    styleAttr(value) {
        this.target.setAttribute("style", value);
        return this;
    }

    addStyleAttr(value) {
        const presStyle = this.target.getAttribute("style");
        if (!presStyle) {
            this.styleAttr(value);
        } else {
            this.styleAttr(presStyle + " " + value);
        }
        return this;
    }

    setAttr(name, value) {
        this.target.setAttribute(name, value);
        return this;
    }

    children(kids) {
        kids.forEach(kid => this.target.appendChild(kid.target));
        return this;
    }

    addChild(kid) {
        return this.children([kid]);
    }

    setOnMouseDown(action) {
        this.target.onmousedown = action;
        return this;
    }

    setOnClick(action) {
        this.target.onclick = action;
        return this;
    }
}

class Page extends Ele {
    constructor() {
        super(document.body);
    }
}

export function page() {
    return new Page();
}

export class Div extends Ele {
    constructor() {
        super("div");
    }
}

export function div() {
    return new Div();
}

export class Flex extends Div {
    constructor() {
        super();
        this.addClass("flex");
    }
}

export function flex() {
    return new Flex();
}

export class Span extends Ele {
    constructor(text) {
        super("span");
        if (text) {
            this.textContent(text);
        }
    }

    textContent(text) {
        this.target.textContent = text;
    }
}

export function span(text) {
    return new Span(text);
}

export class Anchor extends Ele {
    constructor() {
        super("a");
    }

    href(url) {
        this.target.href = url;
        return this;
    }

    setTarget(t) {
        this.target.setAttribute("target", t);
        return this;
    }
}

export function anchor() {
    return new Anchor();
}

export class Img extends Ele {
    constructor() {
        super("img");
    }

    src(url) {
        this.target.src = url;
        return this;
    }
}

export function img() {
    return new Img();
}

export class TextInput extends Ele {
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
        this.target.setAttribute("spellcheck", value);
        return this;
    }
}

export function textInput(initialValue) {
    return new TextInput(initialValue);
}

export class Button extends Ele {
    constructor() {
        super("button");
    }

    onclick(action) {
        this.target.onclick = action;
        return this;
    }
}

export function button() {
    return new Button();
}

// Utility functions.
// return a random number where  min <= x < max.
export function randBetween(min,max) {
    const delta = max-min;
    const value = Math.random() * delta;
    return min + value;
}

/**
     * Modern browsers can download files that aren't from same origin this is a workaround to download a remote file
     * @param `url` Remote URL for the file to be downloaded
     */
export function download(url, filename) {
    fetch(url)
        .then(response => response.blob())
        .then(blob => {
            const blobURL = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = blobURL;
            a.style = "display: none";

            if (filename && filename.length) a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        })
        .catch((e) => console.error("Download error:", e));
}