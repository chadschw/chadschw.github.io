import { Preview, PreviewVideo } from "./preview.js";

export class PostInfo {
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