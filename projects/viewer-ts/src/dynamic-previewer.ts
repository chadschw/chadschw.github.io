

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

class FloatingImg extends Img {

    private _dragHist: Point[] = [];
    private _length = 10;
    private _downPos: Point = new Point(0, 0);

    constructor(private _imgPostVM: ImagePostVM, private _pos: Point, private _vel: Point, private _friction: number) {
        super();
        this.target.style.position = "absolute";
        this.target.style.left = this._pos.x + "px";
        this.target.style.top = this._pos.y + "px";
        this.src(this._imgPostVM.SmallestPreviewUrl())

        this.Update();

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
            const upPos = new Point(e.clientX, e.clientY);
            upPos.Subtract(this._downPos);
            upPos.x /= 10;
            upPos.y /= 10;
            this._vel = upPos;
        })
        
        // todo: this doesn't remove the image from _floatingImgs.
        this.target.oncontextmenu = e => {
            e.stopPropagation();
            e.preventDefault();
            this.target.parentElement?.removeChild(this.target);
        }

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
        
        this.target.style.left = this._pos.x + "px";
        this.target.style.top = this._pos.y + "px";
    }

    

    // OnDrag(e: MouseEvent) {
    //     const movement = new Point(e.movementX, e.movementY);
        
    //     // TODO: This averaging this isn't working right.
    //     this._sum.Subtract(this._dragHist[this._idx]);
    //     this._sum.Add(movement);
    //     if (++this._idx == this._length) {
    //         this._idx = 0;
    //     }

    //     this._vel = new Point(this._sum.x / this._length, this._sum.y/this._length);

    //     //this._vel = new Point(0, 0);
    //     this._pos.x += e.movementX;
    //     this._pos.y += e.movementY;
    // }
}