import { Anchor, Div, flex, Flex, span } from "../../../lib/ele/ele.js";
import { PostInfo } from "./postinfo.js";
import { PreviewImageView } from "./previewimageview.js";
import { PreviewVideoView } from "./preview.js";

export class Posts extends Flex {
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

class PostView extends Div
{
    constructor(postInfo, previewSize) {
        super();
        
        if (postInfo.preview) {
            this.addChild(new PreviewImageView(postInfo, previewSize));
        }
        else if (postInfo.previewVideo) {
            this.addChild(new PreviewVideoView(postInfo, previewSize));
        }
        else {
            this.addChild(new TextAnchor(postInfo));
        }
    }
}

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