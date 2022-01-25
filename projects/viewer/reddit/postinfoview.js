import { anchor, button, div, Div, span } from "../../../lib/ele/ele.js";
import { PostInfo } from "./postinfo.js";

export class PostInfoView extends Div {
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