import { Anchor } from "../../../lib/ele/ele.js";

// TODO: If you click and drag on TextAnchor when you release the mouse it will open the link.
// I should make a SrollDrag base class or something that implements OnMouseDown, move, up functions and
// share it with textanchor and previewthumbnail.
export class TextAnchor extends Anchor {
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