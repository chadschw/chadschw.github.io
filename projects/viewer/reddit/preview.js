import { anchor, div, flex, Flex, span, Video } from "../../../lib/ele/ele.js";
import { PostInfo } from "./postinfo.js";

export class Preview {
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
        return fullname;
    }
}

export class PreviewImg {
    constructor(obj) {
        this.height = obj.height;
        this.width = obj.width;
        this.url = obj.url.replace(/&amp;/g, "&");
    }
}

export class PreviewVideo {
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

export class PreviewVideoView extends Flex {
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
            //console.log("seeked");
            this.seeking = false;
        };
        this.videoEle.target.onstalled = (e) => {
            //console.log("stalled");
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
            //console.debug("mousemoved when seeking. abort.");
            return;
        }

        let newTime = this.videoEle.target.currentTime;
        newTime += (e.movementX > 0) ? this.step : -this.step;
        
        //console.debug(`mousemoved seek to ${newTime}`)
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