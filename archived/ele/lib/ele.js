
class Page {
    children(kids) {
        kids.forEach(kid => document.body.append(kid.target);
    }
}

export function page() {
    return new Page();
}

class Ele {
    constructor(tagName) {
        this.target = document.createElement(tagName);
    }

    classes(classNames) {
        classNames.forEach(className => this.target.classList.add(className));
        return this;
    }

    addClass(className) {
        this.target.classList.remove(className);
    }

    styleAttr(value) {
        this.target.setAttribute("style", value);
        return this;
    }

    children(kids) {
        kids.forEach(kid => this.target.appendChild(kid));
        return this;
    }
}

class Div extends Ele {
    constructor() {
        super("div");
    }
}

export function div() {
    return new Div();
}

class Span extends Ele {
    constructor(text) {
        super("span");
        if (text) {
            this.textConent(text);
        }
    }

    textContent(text) {
        this.target.textConent = text;
    }
}

export function span(text) {
    return new Span(text);
}