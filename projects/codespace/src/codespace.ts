/// <reference path="./../../../libts/ele/ele.ts"/>
/// <reference path="./../../../libts/ele/svg.ts"/>
/// <reference path="textfile.ts"/>
/// <reference path="textfileview.ts"/>

class CodeSpace {
    public get Svg(): Svg { return this._svg; }
    private _svg : Svg = new Svg();

    private _dropEvents = new DropEvents(this._svg.target, this.OnDrop.bind(this))
    private _files: TextFile[] = [];
    private _fileViews: TextFileView[] = [];

    constructor() {
        this._svg.setAttr("width", "100%");
        this._svg.setAttr("height", "100%");
        window.addEventListener("resize", this.OnResize.bind(this));
        this._svg.ViewBox._pos = new Point(0, 0);
        this.OnResize();
    }

    private OnResize() {
        console.log("resize");
        // this._svg.setAttr("width", `${window.innerWidth}px`);
        // this._svg.setAttr("height", `${window.innerHeight}px`);
        //this._svg.ViewBox.Size = new Point(window.innerWidth, window.innerHeight);
        this._svg.ViewBox.OnResize(new Point(window.innerWidth, window.innerHeight));
    }

    private OnDrop(e: DragEvent) {
        if (!e.dataTransfer) return;
        let dropPoint = this._svg.ViewBox.ClientPointToSvgPoint(new Point(e.clientX, e.clientY));
        
        for (let file of e.dataTransfer.files) {
            TextFile.Read(file, (textFile: TextFile) => this.OnAddTextFile(dropPoint, textFile));
        }
    }

    private OnAddTextFile(dropPoint: Point, textFile: TextFile) {
        console.log("new text file", dropPoint, textFile);
        this._files.push(textFile);
        const view = new TextFileView(dropPoint, textFile);
        this._fileViews.push(view);

        this._svg.addChild(view.Text);
    }
}

class DropEvents {
    private _target: Element;
    private _onDragEnter;
    private _onDragOver;
    private _onDrop;
    private _onDropCallback;

    constructor(target: Element, onDropCallback: any) {
        this._target = target;
        this._onDragEnter = this.OnDragEnter.bind(this);
        this._onDragOver = this.OnDragOver.bind(this);
        this._onDrop = this.OnDrop.bind(this);
        this._onDropCallback = onDropCallback;

        this._target.addEventListener("dragenter", this._onDragEnter);
        this._target.addEventListener("dragover", this._onDragOver);
        this._target.addEventListener("drop", this._onDrop);
    }

    public Unload() {
        this._target.removeEventListener("dragenter", this._onDragEnter);
        this._target.removeEventListener("dragover", this._onDragOver);
        this._target.removeEventListener("drop", this._onDrop);
    }

    private OnDragEnter(e: Event) {
        e.preventDefault();
    }

    private OnDragOver(e: Event) {
        e.preventDefault();
        const dragEvent = e as DragEvent;
        if (dragEvent.dataTransfer) dragEvent.dataTransfer.dropEffect = "copy";
    }

    private OnDrop(e: Event) {
        e.stopPropagation();
        e.preventDefault();
        const dragEvent = e as DragEvent;
        if (!dragEvent.dataTransfer) return;

        this._onDropCallback(dragEvent);
    }
}