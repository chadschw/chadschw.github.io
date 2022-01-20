
import { anchor, Anchor, button, div, Div, download, flex, Flex, img, page, span, textInput } from "../../lib/ele/ele.js";

$(document).ready(() => new App());

class App {
    constructor() {
        const header = new Header();
        const posts = new Posts();
        header.OnResponseCallback(posts.AddPosts.bind(posts));
        header.OnClealCallback(posts.ClearPosts.bind(posts));

        page().children([
            header,
            posts
        ]);
    }
}

class Header extends Flex {
    constructor() {
        super();
        this.addClass("header");

        this.lastAfter = "";
        this.pendingRequest = false;

        this.subredditInput = textInput("wallpaper")
            .onenter(this.OnGetClick.bind(this))
            .setSpellcheck(false)
            .setAttr("placeholder", "subreddit");

        this.children([
            this.subredditInput,
            button().addChild(span("get")).onclick(this.OnGetClick.bind(this)),
            button().addChild(span("clear")).onclick(this.OnClearClick.bind(this))
        ]);

        this.OnGetClick();
    }

    OnResponseCallback(callback) {
        this.onResponseCallback = callback;
        return this;
    }

    OnClealCallback(callback) {
        this.onClearCallback = callback;
    }

    OnGetClick(e) { 
        const subredditName = this.subredditInput.value;
        if (subredditName.length === 0) {
            return;
        }

        let params = [subredditName, "hot"];
        if (subredditName.includes(":")) {
            params = subredditName.split(":");
        }

        let url = `https://www.reddit.com/r/${params[0]}/${params[1]}.json?limit=64`;

        if (this.lastAfter.length > 0) {
            url += `&after=${this.lastAfter}`;
        }
        
        if (url && url.length > 0) {
            console.debug(`Request url: ${url}`);
            $.get(url, this.HandleResponse.bind(this));
        }
    }

    HandleResponse(response, status) {
        if (status !== "success") {
            alert(`Request error: ${status}`);
            return;
        }

        this.lastAfter = response.data.after;
        if (!this.lastAfter) { 
            console.log("response.data.after is undefined");
            this.lastAfter = ""; 
        }

        console.debug("Response", response);

        if (this.onResponseCallback) {
            this.onResponseCallback(response);
        } else {
            console.warn("No onResponseCallback set.");
        }
    }

    OnClearClick(e) {
        this.subredditInput.value = "";
        this.subredditInput.target.focus();
        this.lastAfter = "";
        if (this.onClearCallback) {
            this.onClearCallback();
        } else {
            console.warn("No onClearCallback set.");
        }
    }
}

class Posts extends Flex {
    constructor() {
        super();
        this.addClass("posts");


        this.scrollLeftFloat = 0;
        this.scrollLeftVel = 0;
        this.scrollFriction = 0.94;
        this.scrollStopVel = 0.05;

        this.target.onwheel = (e) => {
            // this causes a jump.
            //this.target.scrollLeft += e.deltaY;

            // this scrolls smoothly, but if you mouse wheel quickly it is janky because a new event cancels the previous animation...
            // this.target.scrollBy({
            //     top: 0,
            //     left: e.deltaY * 3,
            //     behavior: "smooth"
            // });

            // This works well:
            // Mouse down bumps scroll velocity. Friction slows down the scrolling.

            // If scrolling up (to the left) and we're already all the way to the left or
            // scrolling down (to the right) and we're already all the way to the right
            // return.
            if (e.deltaY < 0 && this.target.scrollLeft === 0 || 
                e.deltaY > 0 && this.target.scrollLeft === this.target.scrollWidth) {
                return;
            }

            const oldVel = this.scrollLeftVel;
            this.scrollLeftVel += e.deltaY/2;

            // If we are stationary, start animating, else we are already animating.
            if (oldVel === 0) {
                this.scrollLeftFloat = this.target.scrollLeft;
                this.AnimateScroll();
            }
            
            e.preventDefault();
        }

        this.target.onmousedown = (e) => {
            this.mousedown = true;
            window.addEventListener("mousemove", this.OnMouseMove);
            window.addEventListener("mouseup", this.OnMouseUp);
        }
    }

    AnimateScroll = (e) => {
        this.scrollLeftFloat += this.scrollLeftVel;
        this.target.scrollLeft = Math.round(this.scrollLeftFloat);
        this.scrollLeftVel *= this.scrollFriction;
        //console.log(this.scrollLeftVel);
        console.log(this.scrollLeftFloat);

        if (Math.abs(this.scrollLeftVel) < this.scrollStopVel) {
            this.scrollLeftVel = 0;
        } else {
            requestAnimationFrame(this.AnimateScroll)
        }
    }

    OnMouseMove = (e) => {
        this.target.scrollLeft -= e.movementX;
    }

    OnMouseUp = (e) => {
        window.removeEventListener("mousemove", this.OnMouseMove);
        window.removeEventListener("mouseup", this.OnMouseUp);
    }

    AddPosts(response) {
        console.debug("Add posts called with ", response);
        this.children(
            response.data.children
                .map(child => new PostInfo(child.data))
                    .map(postInfo => new PostView(postInfo)));
    }

    ClearPosts() {
        this.target.innerHTML = "";
    }
}

class PostInfo {
    static permalinkBase = "http://www.reddit.com";

    constructor(postData) {
        this.title = postData.title;
        this.url = postData.url;
        this.thumbnail = postData.thumbnail;
        this.permalink = postData.permalink;
        this.postHint = postData.post_hint;
        this.downs = postData.downs;
        this.ups = postData.ups;

        // created_utc is seconds since epoch. Multiple by 1000 to pass milliseconds to Date
        this.dateCreated = new Date(postData.created_utc * 1000);

        if (postData.preview && postData.preview.enabled) {
            this.preview = new Preview(postData.preview);
        }
    }

    NumPreviewImageSizes() {
        if (!this.preview) {
            return 0;
        } else {
            return this.preview.previewImgs.length;
        }
    }

    SmallSizePreviewUrl() {
        const numPreviewSizes = this.NumPreviewImageSizes();
        if (numPreviewSizes === 0) {
            return "";
        } else {
            this.preview.previewImgs[0].url;
        }
    }

    MedSizePreviewUrl() {
        const numPreviewSizes = this.NumPreviewImageSizes();
        if (numPreviewSizes === 0) {
            return "";
        } else if (numPreviewSizes === 1) {
            return this.preview.previewImgs[0].url;
        } else if (numPreviewSizes === 2) {
            return this.preview.previewImgs[1].url;
        } else {
            return this.preview.previewImgs[2].url;
        }
    }
}

class Preview {
    constructor(previewObj) {
        const images = previewObj.images[0];
        this.id = images.id;
        this.previewImgs = images.resolutions.map(res => new PreviewImg(res));
        this.source = new PreviewImg(images.source);
        //this.downloadUrl = this.MakeDownloadUrl();
        this.copyUrl = this.source.url;
        this.downloadFilename = this.MakeDownloadFilename();
    }

    // MakeDownloadUrl() {
    //     // TODO: Why can't i download from preview.redd.it...?
    //     return this.source.url
    //         .replace("https://preview", "https://i");
    //     //     .replace("external-i", "i")
    //     //     .replace("external-preview", "i");
    // }

    MakeDownloadFilename() {
        const url = this.source.url;
        const a = url.split("?")[0];
        const b = a.split(".");
        const extension = b.pop();
        const name = b.pop().split("/")[1];
        const fullname = `${name}.${extension}`;
        console.debug(fullname);
        return fullname;
    }
}

class PreviewImg {
    constructor(obj) {
        this.height = obj.height;
        this.width = obj.width;
        this.url = obj.url.replace(/&amp;/g, "&");
    }
}

class PostView extends Div
{
    constructor(postInfo) {
        super();
        
        if (postInfo.preview) {
            this.addChild(new PreviewThumbnail(postInfo));
        }
        else {
            this.addChild(new TextAnchor(postInfo));
        }
    }
}

class PreviewThumbnail extends Div {
    constructor(postInfo) {
        super();
        this.postInfo = postInfo;
        this.addClass("thumbnail-anchor");
        this.mousemoved = false;
        this.children([
            img()
                .src(postInfo.MedSizePreviewUrl())
                .styleAttr(`display: block;`)
                .setOnMouseDown(this.OnMouseDown),
            flex().children([
                div().addChild(span(postInfo.title).styleAttr("font-size: 1.8rem; text-align: center;")),
                div().addChild(span(`${postInfo.dateCreated.toLocaleDateString()} ${postInfo.dateCreated.toLocaleTimeString()}`)),
                div().addChild(span(`${postInfo.postHint} | ${postInfo.preview.source.width}x${postInfo.preview.source.height}`)),
                div().addChild(
                    anchor()
                        .href(PostInfo.permalinkBase + postInfo.permalink)
                        .addChild(span("comments"))
                        .styleAttr("color: rgba(255, 255, 255, 0.8);")
                        .setTarget("_blank")
                ),
                // div().addChild(
                //     anchor()
                //         .setOnClick((e) => download(postInfo.preview.downloadUrl, postInfo.preview.downloadFilename))
                //         .href("#")
                //         .addChild(span(`download ${postInfo.preview.downloadFilename}`))
                //         .styleAttr("color: rgba(255, 255, 255, 0.8);")
                // ),
                div().addChild(
                    anchor()
                        .setOnClick((e) => navigator.clipboard.writeText(postInfo.preview.copyUrl))
                        .href("#")
                        .addChild(span(`copy image address`))
                        .styleAttr("color: rgba(255, 255, 255, 0.8);")
                )
            ]).styleAttr(`
                flex-direction: column;
                margin-top: 10px;
            `)




            
        // this.permalink = postData.permalink;
        // this.postHint = postData.post_hint;
        // this.downs = postData.downs;
        // this.ups = postData.ups;

        // // created_utc is seconds since epoch. Multiple by 1000 to pass milliseconds to Date
        // this.dateCreated = new Date(postData.created_utc * 1000);
        ])
    }

    OnMouseDown = (e) => {
        this.mousemoved = false;
        this.mouseDownEvent = e;
        e.preventDefault();
        window.addEventListener("mousemove", this.OnMouseMove);
        window.addEventListener("mouseup", this.OnMouseUp);
    }

    OnMouseMove = (e) => {
        if (this.mousemoved) {
            return;
        }

        const deltaX = Math.abs(e.clientX - this.mouseDownEvent.clientX);
        const deltaY = Math.abs(e.clientY - this.mouseDownEvent.clientY);

        //console.debug(`mouse moved ${e.movementX},${e.movementY}`);
        if (deltaX > 4 || deltaY > 4) {
            console.debug("mouse moved.");
            this.mousemoved = true;
        }
    }

    OnMouseUp = (e) => {
        if (!this.mousemoved) {
            window.open(this.postInfo.preview.source.url);
        }

        window.removeEventListener("mousemove", this.OnMouseMove);
        window.removeEventListener("mouseup", this.OnMouseUp);
    }
}

// class ThumbnailAnchor extends Anchor {
//     constructor(postInfo) {
//         super();
//         this.href(postInfo.preview.source.url);
//         this.setTarget("_blank");
        
//         this.addChild(
//             div()
//                 .addClass("thumbnail-anchor")
//                 .addChild(
//                     img()
//                         .src(postInfo.preview.previewImgs[0].url)
//                         .styleAttr(`display: block;`)
//                         .setOnMouseDown((e) => e.preventDefault())
//                 )
//         );
        
//         //div.style.background = `url("${postInfo.url}")`; // Note: the url is the full size photo which can be a couple MB big. Good thing I have gigabit speed.
//         // div.style.background = `url("${postInfo.thumbnail}")`;
//         // div.style.backgroundPosition = "center";
//         // div.style.backgroundSize = "cover";
        
//         // const title = document.createElement("div");
//         // //title.innerHTML = postInfo.title;
//         // title.innerHTML = `${postInfo.dateCreated.toLocaleString()} downs: ${postInfo.downs} ups: ${postInfo.ups}<br>${postInfo.title}`;
//         // title.classList.add("thumbnail-title");
        
//         // this.target = document.createElement("a");
//         // //this.target.href = postInfo.url;
//         // this.target.href = postInfo.preview.source.url;
//         // this.target.target = "_blank";
//         // this.target.style.border = "0";
//         // this.target.appendChild(div);

//         // div.onclick = e => {
//         //     $.get(PostInfo.permalinkBase + postInfo.permalink + ".json", (response, status) => {
//         //         console.log(response);
//         //     });
//         // }
//     }
// }

// TODO: If you click and drag on TextAnchor when you release the mouse it will open the link.
// I should make a SrollDrag base class or something that implements OnMouseDown, move, up functions and
// share it with textanchor and previewthumbnail.
class TextAnchor extends Anchor {
    constructor(postInfo) {
        super();
        this.href(postInfo.url)
        this.setTarget("_blank")
        this.addClass("text-anchor");
        this.addChild(
            flex().children([
                flex().addChild(span(postInfo.title).styleAttr("font-size: 1.8rem; text-align: center;")),
                flex().addChild(span(postInfo.dateCreated.toLocaleDateString() + " " + postInfo.dateCreated.toLocaleTimeString())),
                flex().addChild(span(postInfo.postHint))
            ]).styleAttr("flex-direction: column;")
        );
    }
}
