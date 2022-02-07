
class Previewer extends Flex {
    private _img: Img;
    private _urlIdx = 0;
    private _urls: string[] = [];

    constructor() {
        super();
        this.styleAttr(`
            height: 90%; 
            width: 90%; 
        `);
        this._img = img().styleAttr(`
            box-shadow: var(--box-shadow);
            max-height: 100%;
            max-width: 100%;
        `) as Img;
        this.addChild(this._img);
    }

    AddPreviews(urls: string[]) {
        // just always reset for now...
        // this._urls = this._urls.concat(urls);
        // if (this._urlIdx === 0) {
        //     this._img.src(urls[0]);
        // }
        this._urlIdx = 0;
        this._urls = urls;
        this._img.src(urls[0]);
    }

    Clear() {
        this._urls = [];
        this._img.src("");
    }

    OnWheel(e: WheelEvent) {
        e.preventDefault();
        
        if (e.deltaY > 0) {
            if (this._urlIdx < this._urls.length - 1) {
                this._urlIdx++;
                this._img.src(this._urls[this._urlIdx]);
            }
        } else if (this._urlIdx > 0) {
            this._urlIdx--;
            this._img.src(this._urls[this._urlIdx]);
        }
    }
}