
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


            // new Svg().viewBox(-100, -100, 200, 200).widthHeight(200, 200).children([
            //     new Circle().Radius(40).Center(0, 0).styleAttr("fill: rgba(255, 0, 0, 0.5); stroke: red; stroke-width: 5px;"),
            //     new Path().d(Path.randomPath(-100, 100, 20)).styleAttr("stroke: black; fill: transparent;")
            // ]).styleAttr("position: absolute;"),
            // new Svg().viewBox(-100, -100, 200, 200).widthHeight(200, 200).children([
            //     new Circle().Radius(45).Center(0, 0).styleAttr("fill: rgba(0, 255, 0, 0.5); stroke: green; stroke-width: 5px;"),
            //     new Path().d(Path.randomPath(-100, 100, 20)).styleAttr("stroke: black; fill: transparent;")
            // ]).styleAttr("position: absolute; transform: rotateY(90deg);"),
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
        // new Cube(400, 0),
        // new Cube(-400, 0),
        // new Cube(0, 400),
        // new Cube(0, -400),
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
