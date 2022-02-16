

class DynamicPreviewer extends Div {

    private _imgPosts: ImagePostVM[] = [];
    private _postIdx = 0;
    private _floatingImgs: FloatingImg[] = [];

    constructor() {
        super();
        this.styleAttr("width: 100%; height: 100%;")
        
        const render = () => {
            this._floatingImgs.forEach(img => img.Update());
            requestAnimationFrame(render)
        }

        render();
    }

    AddListing(listing: ListingVM) {
        this._imgPosts = this._imgPosts.concat(listing.ImagePosts);
        this.AddFloatingImg();
    }

    OnWheel(e: WheelEvent) {
        e.preventDefault();
        
        if (e.deltaY > 0) {
            if (this._postIdx < this._imgPosts.length - 1) {
                this._postIdx++;
                this.AddFloatingImg();
            }
        }
    }

    AddFloatingImg() {
        const r = this.target.getBoundingClientRect();
        const post = this._imgPosts[this._postIdx];
        const imgSize = post.SmallestPreviewWidthHeight();
        const floatingImg = new FloatingImg(
            post,
            new Point(r.width/2 - imgSize.x/2, r.height/2-imgSize.y/2),
            new Point(randBetween(-1, 1), randBetween(-1, 1)),
            randBetween(0.99, 0.999)
        );
        
        this._floatingImgs.push(floatingImg);
        this.addChild(floatingImg);    
    }

    Clear() {
        this._postIdx = 0;
        this._imgPosts = [];
        this.target.innerHTML = "";
    }
}

class FloatingImg extends Div {
    private _img = img();
    private _dragHist: Point[] = [];
    private _length = 10;
    private _downPos: Point = new Point(0, 0);
    private _maxRot = 45;
    private _zRot = 0;
    private _maxZRotVel = 0.5;
    private _zRotVel = randBetween(-this._maxZRotVel, this._maxZRotVel);
    private _previewIndex = 0;
    private _numPreviews;
    
    constructor(private _imgPostVM: ImagePostVM, private _pos: Point, private _vel: Point, private _friction: number) {
        super();
        this.classes(["floating-img"])
        this._img.classes(["floating-img-img"])
        this.children([
            this._img,
            contextMenu(this.target, [
                // new TextContextMenuItem("Info", () => { 
                //     let visibility = this._previewImgInfoVM.target.style.visibility;
                //     if (visibility === "hidden") {
                //         this._previewImgInfoVM.target.style.visibility = "visible";
                //     } else {
                //         this._previewImgInfoVM.target.style.visibility = "hidden";
                //     }
                // }),
                new TextContextMenuItem("Source", () => window.open(this._imgPostVM?.SourceUrl(), "_blank")),
                new TextContextMenuItem("Url", () => window.open(this._imgPostVM?.Url(), "_blank")),
                new TextContextMenuItem("Permalink", () => window.open(this._imgPostVM?.Permalink(), "_blank")),
                new TextContextMenuItem("Search Reddit", () => window.open(`https://www.reddit.com/search/?q=${this._imgPostVM?.PostData.title}`)),
                new TextContextMenuItem("Search Google", () => window.open(`https://www.google.com/search?q=${this._imgPostVM?.PostData.title}`))
            ])
        ])
        
        this.target.style.left = this._pos.x + "px";
        this.target.style.top = this._pos.y + "px";
        this._img.src(this._imgPostVM.SmallestPreviewUrl())

        this.Update();

        this._numPreviews = this._imgPostVM.NumPreviewSizes();

        new MouseClickAndDrag(this, e => {
            this._pos.x += e.movementX;
            this._pos.y += e.movementY;
        })

        new MouseDownUp(this, e => {
            e.preventDefault();
            e.stopPropagation();
            this._vel = new Point(0, 0);
            this._downPos = new Point(e.clientX, e.clientY);
        },
        e => {
            e.preventDefault();
            e.stopPropagation();

            if (e.button == 2 ) return;
            
            const upPos = new Point(e.clientX, e.clientY);
            upPos.Subtract(this._downPos);
            upPos.x /= 10;
            upPos.y /= 10;
            this._vel = upPos;
            //this._zRotVel = randBetween(-this._maxZRotVel, this._maxZRotVel);
        })

        this.target.onwheel = e => {
            e.stopPropagation();
            e.preventDefault();

            if (e.deltaY > 0) {
                if (this._previewIndex < this._numPreviews - 1) {
                    this._img.src(this._imgPostVM.PreviewUrl(++this._previewIndex))
                    this._zRot = 0;
                    this._zRotVel = 0;
                }
            } else if (this._previewIndex > 0) {
                this._img.src(this._imgPostVM.PreviewUrl(--this._previewIndex))
            }
        }
        
        // // todo: this doesn't remove the image from _floatingImgs.
        // this.target.oncontextmenu = e => {
        //     e.stopPropagation();
        //     e.preventDefault();
        //     this.target.parentElement?.removeChild(this.target);
        // }

        for (let i = 0; i < this._length; i++) {
            this._dragHist[i] = new Point(0,0);
        }
    }

    Update() {
        this._vel.x *= this._friction;
        this._vel.y *= this._friction;

        if (Math.abs(this._vel.x) < 0.01) this._vel.x = 0;
        if (Math.abs(this._vel.y) < 0.01) this._vel.y = 0;

        this._pos.x += this._vel.x;
        this._pos.y += this._vel.y;

        this._zRotVel *= this._friction;
        this._zRot += this._zRotVel;
        if (Math.abs(this._zRot) > this._maxRot) {
            this._zRotVel *= -1;
        }

        this.target.style.left = this._pos.x + "px";
        this.target.style.top = this._pos.y + "px";
        this.target.style.transform = `rotateZ(${this._zRot}deg)`;
    }
}