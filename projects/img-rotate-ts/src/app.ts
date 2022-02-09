
class MyTextInput  {
    public Item: TextInputContextMenuItem;
    private _textInput: TextInput;

    constructor(initialString: string) {
        this._textInput = textInput(initialString)
            .onenter(this.OnEnter.bind(this))
            .styleAttr(`
                
            `) as TextInput;

        this.Item = new TextInputContextMenuItem(this._textInput);
    }

    private OnEnter(e: Event) {
        alert(`You entered: ${this._textInput.value}`);
    }
}

class MouseClickAndDrag {
    constructor(ele: HtmlEle, private _onDrag: (e: MouseEvent) => void) {
        ele.target.addEventListener("mousedown", e => {
            e.preventDefault();
            const boundDrag = this._onDrag.bind(ele);
            window.addEventListener("mousemove", boundDrag);
            window.addEventListener("mouseup", e => window.removeEventListener("mousemove", boundDrag));
        })
    }
}

class Cube extends Flex {
    private _xRot = 0;
    private _yRot = 0;
    
    constructor(private _xPos = 0, private _yPos = 0) {
        super();
        this.classes(["cube"])
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
        ])
        
        this.setStyle();

        new MouseClickAndDrag(this, this.OnDrag);
    }

    private OnDrag(e: MouseEvent) {
        this._xPos += e.movementX/2;
        this._yPos += e.movementY/2;
        this._xRot += -e.movementY/2;
        this._yRot += e.movementX/2;
        this.setStyle();
    }

    private setStyle() {
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
