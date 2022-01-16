import { page, div, span, Div, randBetween } from "./lib/ele.js";

class Point {
    constructor(x,y) {
        this.x = x;
        this.y = y;
    }
}

class TailLink extends Div {
    constructor(x,y) {
        super();
        this.addClass("tail-link");
        this.Position(x,y);
    }

    Position(x,y) {
        this.styleAttr(`
            left: ${x-10}px;
            top: ${y-10}px;
        `);
    }
}

class Tails extends Div {
    constructor() {
        super();
        this.mouseDown = false;
        this.target.onmousedown = this.OnMouseDown.bind(this);
        this.target.onmousemove = this.OnMouseMove.bind(this);
        this.styleAttr(`
            height: 100%;
        `);

        this.tailLinks = 5;
        this.mouseMoveCount = 0;
    }

    OnMouseDown(e) {
        this.mouseDown = true;
    }

    OnMouseUp() {
        this.mouseDown = false;
    }

    OnMouseMove(e) {
        const x = e.clientX;
        const y = e.clientY;

        if (this.head) {
            this.head.Position(x,y);
        }

        if (++this.mouseMoveCount % 20 !== 0) {
            return;
        }
        
        this.head = new TailLink(e.clientX, e.clientY);
        this.children([this.head]);

        while(this.target.children.length > this.tailLinks) {
            this.target.removeChild(this.target.children[0]);
        }
    }

    AddLink() {
        this.tailLinks++;
    }

    RemoveLink() {
        this.tailLinks--;
    }
}

class Food extends Div {
    constructor(onEnterCallback) {
        super();
        this.onEnterCallback = onEnterCallback;
        this.addClass("food");
        this.MoveToRandomSpot();
        this.target.onmouseenter = this.OnMouseEnter.bind(this);
    }

    MoveToRandomSpot() {
        const x = randBetween(50, document.body.clientWidth - 50);
        const y = randBetween(50, document.body.clientHeight - 50);

        this.styleAttr(`
            left: ${x}px;
            top: ${y}px;
        `);
    }

    OnMouseEnter(e) {
        this.onEnterCallback();
        this.MoveToRandomSpot();
    }
}

class NotFood extends Food {
    constructor(onEnterCallback) {
        super(onEnterCallback);
        this.addStyleAttr('background-color: red');
        this.target.onmouseenter = this.OnMouseEnter.bind(this);
    }

    OnMouseEnter(e) {
        this.onEnterCallback();
    }
}

// page().children([
//     div().children([
//         span("hello.")
//     ])
// ]);
const tails = new Tails();
const p = page().children([tails]);

// need to let the DOM render.
setTimeout(() => p.children([new Food(MealTime)]), 1);

function Ouch() {
    tails.RemoveLink();
}

function MealTime() {
    tails.AddLink();
    // adding not food only at meal time is too easy... let's just add not food at a fixed interval.
    p.children([new NotFood(Ouch)]);
}

setInterval(() => p.children([new NotFood(Ouch)]), 1000);