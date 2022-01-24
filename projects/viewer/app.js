
import { anchor, Anchor, button, Button, div, Div, download, flex, Flex, img, page, span, textInput, Video } from "../../lib/ele/ele.js";

$(document).ready(() => new App());

class App {
    constructor() {
        // const header = new Header();
        // const posts = new Posts();
        // header.OnResponseCallback(posts.AddPosts.bind(posts));
        // header.OnClealCallback(posts.ClearPosts.bind(posts));

        // page().children([
        //     header,
        //     posts
        // ]);
        page().children([new SubReddit("wallpaper"), new SubReddit("pics"), new SubReddit("earthporn")])
    }
}

class SubReddit extends Div {
    constructor(initialSubreddit) {
        super();
        this.styleAttr(`position: relative;`);

        const header = new Header(initialSubreddit);
        const posts = new Posts();
        header.OnResponseCallback(posts.AddPosts.bind(posts));
        header.OnClealCallback(posts.ClearPosts.bind(posts));
        
        this.children([header, posts]);
    }
}

class Header extends Flex {
    constructor(initialSubreddit) {
        super();
        this.addClass("header");

        this.lastAfter = "";
        this.pendingRequest = false;

        this.subredditInput = textInput(initialSubreddit)
            .onenter(this.OnGetClick.bind(this))
            .setSpellcheck(false)
            .setAttr("placeholder", "subreddit");

        const previewSizes = ["sm", "med", "lg"];
        this.previewSize = previewSizes[0];

        this.children([
            this.subredditInput,
            button().addChild(span("get")).onclick(this.OnGetClick.bind(this)),
            button().addChild(span("clear")).onclick(this.OnClearClick.bind(this)),
            new StatesButton(previewSizes, this.previewSize, this.OnSizeChange.bind(this))
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
            console.debug("response.data.after is undefined");
            this.lastAfter = ""; 
        }

        console.debug("Response", response);

        if (this.onResponseCallback) {
            this.onResponseCallback(response, this.previewSize);
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

    OnSizeChange(newSize) {
        console.log(`new size is ${newSize}`);
        this.previewSize = newSize;
        const subredditName = this.subredditInput.value;
        this.OnClearClick(null);
        this.subredditInput.value = subredditName;
        this.OnGetClick(null);
    }
}

class StatesButton extends Button {
    constructor(states, initialState, callback) {
        super();
        this.states = states;
        this.buttonSpan = new span(initialState);
        this.onClickCallback = callback;
        this.addChild(this.buttonSpan);
        this.onclick(this.OnClick.bind(this));
    }

    OnClick(e) {
        let newIdx = this.states.indexOf(this.buttonSpan.target.innerHTML) + 1;
        if (newIdx < 0 || newIdx >= this.states.length) {
            newIdx = 0;
        };
        this.buttonSpan.textContent(this.states[newIdx]);
        this.onClickCallback(this.states[newIdx]);
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

    AddPosts(response, previewSize) {
        console.debug("Add posts called with ", response);
        this.children(
            response.data.children
                .map(child => new PostInfo(child.data))
                    .map(postInfo => new PostView(postInfo, previewSize)));
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

        // if (postData.preview && postData.preview.enabled) {
        //     this.preview = new Preview(postData.preview);
        // }
        if (this.postHint === "image") {
            this.preview = new Preview(postData.preview);
        } else if (this.postHint === "rich:video") {
            if (postData.preview.reddit_video_preview) {
                this.previewVideo = new PreviewVideo(postData.preview);
            } else {
                console.debug(`found a rich:video with no preview.reddit_video_preview. Maybe can just use url: ${this.url}`)
            }
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
        return this.NumPreviewImageSizes() >= 1 ?
            this.preview.previewImgs[0].url :
            "";
    }

    MedSizePreviewUrl() {
        return this.NumPreviewImageSizes() >= 2 ?
            this.preview.previewImgs[1].url :
            this.SmallSizePreviewUrl;
    }

    LgSizePreviewUrl() {
        return this.NumPreviewImageSizes() >= 3 ?
            this.preview.previewImgs[2].url :
            this.MedSizePreviewUrl();
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

class PreviewVideo {
    constructor(previewObj) {
        if (previewObj.reddit_video_preview.fallback_url) {
            this.url = previewObj.reddit_video_preview.fallback_url;
            this.height = previewObj.reddit_video_preview.height;
            this.width = previewObj.reddit_video_preview.width;
        } else {
            console.debug("no fallback url");
            this.url = "";
        }
    }
}

class PostView extends Div
{
    constructor(postInfo, previewSize) {
        super();
        
        if (postInfo.preview) {
            this.addChild(new PreviewThumbnail(postInfo, previewSize));
        }
        else if (postInfo.previewVideo) {
            this.addChild(new PreviewVideoView(postInfo, previewSize));
        }
        else {
            this.addChild(new TextAnchor(postInfo));
        }
    }
}

class PreviewThumbnail extends Div {
    constructor(postInfo, previewSize) {
        super();
        this.postInfo = postInfo;
        this.addClass("thumbnail-anchor");
        this.mousemoved = false;
        this.children([
            img()
                .src(previewSize === "sm" ? 
                    postInfo.SmallSizePreviewUrl() :
                    previewSize === "med" ? 
                        postInfo.MedSizePreviewUrl() :
                        postInfo.LgSizePreviewUrl())
                .styleAttr(`display: block;`)
                .setOnMouseDown(this.OnMouseDown),
            // // TODO: want a way to hide initially but easy to get to this stuff too somehow.
            // flex().children([
            //     div().addChild(span(postInfo.title).styleAttr("font-size: 1.8rem; text-align: center;")),
            //     div().addChild(span(`${postInfo.dateCreated.toLocaleDateString()} ${postInfo.dateCreated.toLocaleTimeString()}`)),
            //     div().addChild(span(`${postInfo.postHint} | ${postInfo.preview.source.width}x${postInfo.preview.source.height}`)),
            //     div().addChild(
            //         anchor()
            //             .href(PostInfo.permalinkBase + postInfo.permalink)
            //             .addChild(span("comments"))
            //             .styleAttr("color: rgba(255, 255, 255, 0.8);")
            //             .setTarget("_blank")
            //     ),
            //     // div().addChild(
            //     //     anchor()
            //     //         .setOnClick((e) => download(postInfo.preview.downloadUrl, postInfo.preview.downloadFilename))
            //     //         .href("#")
            //     //         .addChild(span(`download ${postInfo.preview.downloadFilename}`))
            //     //         .styleAttr("color: rgba(255, 255, 255, 0.8);")
            //     // ),
            //     div().addChild(
            //         anchor()
            //             .setOnClick((e) => navigator.clipboard.writeText(postInfo.preview.copyUrl))
            //             .href("#")
            //             .addChild(span(`copy image address`))
            //             .styleAttr("color: rgba(255, 255, 255, 0.8);")
            //     )
            // ]).styleAttr(`
            //     flex-direction: column;
            //     margin-top: 10px;
            // `)
            
        // this.permalink = postData.permalink;
        // this.postHint = postData.post_hint;
        // this.downs = postData.downs;
        // this.ups = postData.ups;

        // // created_utc is seconds since epoch. Multiple by 1000 to pass milliseconds to Date
        // this.dateCreated = new Date(postData.created_utc * 1000);
        ]);

        this.target.oncontextmenu = e => {
            e.stopPropagation();
            e.preventDefault();
            // right click on an image.
            //console.log(e);
            console.log(this.target);
            console.log(`Right clicked on post: ${this.postInfo.title}`);

            const clientRect = this.target.getBoundingClientRect();

            document.body.appendChild(new PostInfoView(this.postInfo, clientRect.left, clientRect.bottom + 10).target);
        }
    }

    OnMouseDown = (e) => {
        e.preventDefault();
        
        if (e.button === 2) {
            return true;
        }

        this.mousemoved = false;
        this.mouseDownEvent = e;
        
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

class PostInfoView extends Div {
    constructor(postInfo, left, top) {
        super();
        this.styleAttr(`
            left: ${left}px;
            top: ${top}px;
            background-color: #202020;
            border-radius: 5px;
            box-shadow: 0px 0px 13px 3px black;
            font-size: 1.8rem;
            opacity: 0.85;
            padding: 10px;
            position: fixed;
        `);

        this.children([
            div().addChild(span(postInfo.title)),
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
                ),
            button()
                .onclick(e => {
                    document.body.removeChild(this.target);
                })
                .addChild(span("close"))
            ]);
    }
}

class PreviewVideoView extends Flex {
    constructor(postInfo, previewSize) {
        super();
        this.styleAttr(`
            flex-direction: column;
        `);

        this.videoEle = new Video()
            .src(postInfo.previewVideo.url)
            // This video scrolls smoothly with the click and drag... some other videos don't.
            //this.src("http://ozywuli.github.io/videos/atoms-hi-smooth.mp4");
            .controls()
            .height(previewSize === "sm" ? 200 : previewSize === "med" ? 400 : 720);
        
        const magicBlock = div()
            .styleAttr(`
                background-color: pink;
                height: 50px;
                width: 100px;
            `);

        magicBlock.target.onwheel = e => {
            e.preventDefault();
            e.stopPropagation();
            const step = 0.0333;    // 1/30 assuming 30fps video. How could we detect 60 fps video?
            this.videoEle.target.currentTime += e.deltaY > 0 ? step : -step;
        }

        const fastScrubBlock = div()
            .styleAttr(`
                background-color: green;
                height: 50px;
                width: 100px;
        `);

        this.seeking = false;
        this.videoEle.target.onseeked = (e) => {
            console.log("seeked");
            this.seeking = false;
        };
        this.videoEle.target.onstalled = (e) => {
            console.log("stalled");
            this.seeking = false;
        }

        magicBlock.target.onmousedown = e => {
            this.step = 0.03333;
            this.OnMouseDown(e);
        }

        fastScrubBlock.target.onmousedown = e => {
            // TODO: the real intent here is for a thumb for scrubbing through the whole video.
            this.step = 0.5;
            this.OnMouseDown(e);
        }

        this.children([this.videoEle, magicBlock, fastScrubBlock,
        
            flex().children([
                div().addChild(span(postInfo.title).styleAttr("font-size: 1.8rem; text-align: center;")),
                div().addChild(span(`${postInfo.dateCreated.toLocaleDateString()} ${postInfo.dateCreated.toLocaleTimeString()}`)),
                //div().addChild(span(`${postInfo.postHint} | ${postInfo.preview.source.width}x${postInfo.preview.source.height}`)),
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
        
        ]);
    }

    OnMouseDown = (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.mouseDownX = e.clientX;
        this.mouseDown = true;
        
        window.addEventListener("mousemove", this.OnMouseMove);
        window.addEventListener("mouseup", this.OnMouseUp);
    }

    OnMouseMove = (e) => {
        if (this.seeking) {
            console.debug("mousemoved when seeking. abort.");
            return;
        }

        let newTime = this.videoEle.target.currentTime;
        newTime += (e.movementX > 0) ? this.step : -this.step;
        
        console.debug(`mousemoved seek to ${newTime}`)
        this.seeking = true;
        this.videoEle.target.currentTime = newTime;

        
    }

    OnMouseUp = (e) => {
        this.mouseDown = false;
        this.seeking = false;
        window.removeEventListener("mousemove", this.OnMouseMove);
        window.removeEventListener("mouseup", this.OnMouseUp);
    }
}

// TODO: finish this and use it.
class ScrollBarThumb extends Div {
    constructor() {
        this.super();
        this.styleAttr(`
            position: absolute;
            left: 0px;
            height: 16px;
            min-width: 10px;
        `);
    }
}

// TODO: finish this and use it. click, hold move left starts advancing like middle mouse button.
class ScrubControl extends Div {
    constructor() {
        super();
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
