
class Previewer extends Flex {
    private _img: PreviewImg = new PreviewImg();
    private _postIdx = 0;

    private _imgPosts: ImagePostVM[] = [];
    private _activePost: ImagePostVM | null = null;
    private _previewImgInfoVM = new PreviewImgInfoVm();

    constructor() {
        super();
        this.styleAttr(`
            height: 75%; 
            width: 90%;
            flex-direction: column;
        `);
        
        this._previewImgInfoVM.target.style.visibility = "hidden";
        this._img.target.style.position = "relative";
        this._img.target.style.boxSizing = "border-box";

        this.children([
            this._img,
            this._previewImgInfoVM,
            contextMenu(this.target, [
                new TextContextMenuItem("Info", () => { 
                    let visibility = this._previewImgInfoVM.target.style.visibility;
                    if (visibility === "hidden") {
                        this._previewImgInfoVM.target.style.visibility = "visible";
                    } else {
                        this._previewImgInfoVM.target.style.visibility = "hidden";
                    }
                }),
                new TextContextMenuItem("Source", () => window.open(this._activePost?.SourceUrl(), "_blank")),
                new TextContextMenuItem("Url", () => window.open(this._activePost?.Url(), "_blank")),
                new TextContextMenuItem("Permalink", () => window.open(this._activePost?.Permalink(), "_blank")),
                new TextContextMenuItem("Search Reddit", () => window.open(`https://www.reddit.com/search/?q=${this._activePost?.PostData.title}`)),
                new TextContextMenuItem("Search Google", () => window.open(`https://www.google.com/search?q=${this._activePost?.PostData.title}`))
            ])
        ]);
    }

    AddListing(listing: ListingVM) {
        this._imgPosts = this._imgPosts.concat(listing.ImagePosts);
        this.SetActivePost();
    }

    Clear() {
        this._postIdx = 0;
        this._imgPosts = [];
        this._img.Clear();
        this._previewImgInfoVM.Clear();
        
    }

    OnWheel(e: WheelEvent) {
        e.preventDefault();
        
        if (e.deltaY > 0) {
            if (this._postIdx < this._imgPosts.length - 1) {
                this._postIdx++;
                this.SetActivePost();
            }
        } else if (this._postIdx > 0) {
            this._postIdx--;
            this.SetActivePost();
        }
    }

    SetActivePost() {
        this._activePost = this._imgPosts[this._postIdx];
        this._img.src(this._activePost.LargestPreviewUrl());
        this._previewImgInfoVM.Update(this._activePost, this._postIdx + 1, this._imgPosts.length);
    }
}

class PreviewImg extends Img {
    constructor() {
        super();
        this.styleAttr(`
            box-shadow: 0px 0px 3px 3px var(--shade-3);
            border: 16px solid white;
            border-radius: 30px;
            max-height: 100%;
            max-width: 100%;
        `)
    }

    Clear() {
        this.src("");
    }
}

class PreviewImgInfoVm extends Flex {
    private _title = span().styleAttr("user-select: text;") as Span;
    private _size = span();
    private _created = span();
    private _position = span();
    
    constructor() {
        super();
        this.styleAttr(`
            background-color: var(--background-color);
            border-radius: var(--border-radius);
            box-shadow: var(--box-shadow);
            color: var(--foreground-color);
            flex-direction: column;
            font-size: 1.6rem;
            margin: 10px;
            padding: 10px;
        `)
        this.target.style.flexDirection = "column";
        this.target.style.fontSize = "1.6rem";
        this.target.style.margin = "10px";
        this.target.style
        this.children([
            div().addChild(this._title),
            flex().children([this._size, this._created, this._position]).styleAttr("gap: 20px; wrap: nowrap;"),
        ]);
    }

    Update(postVM: ImagePostVM, num: number, totalNum: number) {
        this._title.textContent(postVM.PostData.title);
        this._size.textContent(postVM.SourceSize());
        this._created.textContent(postVM.CreatedDateTime());
        this._position.textContent(`${num} of ${totalNum}`)
    }

    Clear() {
        this._title.textContent("");
        this._size.textContent("");
        this._created.textContent("");
        this._position.textContent("");
    }
}