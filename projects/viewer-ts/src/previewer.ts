
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

        this.children([
            this._img,
            this._previewImgInfoVM,
            contextMenu(this._img.target, [
                new TextContextMenuItem("Info", () => { 
                    let visibility = this._previewImgInfoVM.target.style.visibility;
                    if (visibility === "hidden") {
                        this._previewImgInfoVM.target.style.visibility = "visible";
                    } else {
                        this._previewImgInfoVM.target.style.visibility = "hidden";
                    }
                })
            ])
        ]);
    }

    AddListing(listing: ListingVM) {
        // just always reset for now... Future: append
        this._postIdx = 0;
        this._imgPosts = listing.ImagePosts;
        this.SetActivePost();
    }

    Clear() {
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
        this._previewImgInfoVM.Update(this._activePost);
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

    setPost(postVM: ImagePostVM) {
        this.src(postVM.LargestPreviewUrl())
    }

    Clear() {
        this.src("");
    }
}

class PreviewImgInfoVm extends Flex {
    private _title = span().styleAttr("user-select: text;") as Span;
    private _size = span();
    private _sourceLink = anchor().addChild(span().textContent("source")).setAttr("target", "_blank").styleAttr("color: var(--foreground-color);") as Anchor;
    private _urlLink = anchor().addChild(span().textContent("url")).setAttr("target", "_blank").styleAttr("color: var(--foreground-color);") as Anchor;
    private _postLink = anchor().addChild(span().textContent("post")).setAttr("target", "_blank").styleAttr("color: var(--foreground-color);") as Anchor;

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
            div().addChild(this._size),
            flex().children([this._sourceLink, this._urlLink, this._postLink]).styleAttr("gap: 5px; wrap: nowrap;")
        ]);
    }

    Update(postVM: ImagePostVM) {
        this._title.textContent(postVM.PostData.title);
        this._size.textContent(postVM.SourceSize());
        this._sourceLink.href(postVM.SourceUrl());
        this._urlLink.href(postVM.PostData.url)
        this._postLink.href(postVM.Permalink());
    }

    Clear() {
        this._title.textContent("");
        this._size.textContent("");
        this._sourceLink.href("https://www.google.com");
        this._urlLink.href("https://www.google.com");
        this._postLink.href("http://www.google.com");
    }
}