import { Div, img } from "../../../lib/ele/ele.js";
import { PostInfoView } from "./postinfoview.js";

export class PreviewThumbnail extends Div {
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
        ]);

        this.postInfoView = null;

        this.target.oncontextmenu = e => {
            e.stopPropagation();
            e.preventDefault();

            // If postInfoView is already displayed, remove it.
            if (this.postInfoView !== null) {
                document.body.removeChild(this.postInfoView.target);
                this.postInfoView = null;
                return;
            }

            // right click on an image.
            const clientRect = this.target.getBoundingClientRect();
            this.postInfoView = new PostInfoView(this.postInfo, clientRect.left, clientRect.bottom + 10);
            document.body.appendChild(this.postInfoView.target);
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