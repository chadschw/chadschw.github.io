
interface PreviewImageResolution {
    height: number;
    url: string;
    width: number;
}

interface ImageSource {
    url: string;
    width: number;
    height: number;
}

interface PreviewImage {
    id: string;
    resolutions: PreviewImageResolution[];
    source: ImageSource;
}

interface Preview {
    enabled: boolean;
    images: PreviewImage[]
}

interface PostData {
    author: string;
    created_utc: number;
    domain: string;
    downs: number;
    id: string;
    is_video: boolean;
    name: string;
    num_comments: number;
    permalink: string;
    post_hint: string;
    preview: Preview;
    score: number;
    subreddit: string;
    subreddit_id: string;
    subreddit_name_prefixed: string;
    subreddit_subscribers: number;
    thumbnail: string;
    thumbnail_height: number;
    thumbnail_width: number;
    title: string;
    ups: number;
    upvote_ratio: number;
    url: string;
}

interface Post {
    data: PostData;
    kind: string;
}

interface ListingData {
    after: string;
    before: string;
    children: Post[];
}

interface Listing {
    data: ListingData;
    kind: string;
}

class Subreddit {
    //private _lastAfter: string = "";

    constructor(private _onUrls: (urls: string[]) => void) {

    }

    OnGetPosts(subreddit: string) {
        
        if (subreddit.length === 0) {
            return;
        }

        let params = [subreddit, "hot"];
        if (subreddit.includes(":")) {
            params = subreddit.split(":");
        }

        let url = `https://www.reddit.com/r/${params[0]}/${params[1]}.json?limit=64`;

        // if (this._lastAfter.length > 0) {
        //     url += `&after=${this._lastAfter}`;
        // }
        
        if (url && url.length > 0) {
            console.debug(`Request url: ${url}`);
            fetch(url).then(r => r.json()).then(this.OnGotPosts.bind(this)).catch(reason => console.error(reason));
        }
    }

    OnGotPosts(listing: Listing) {
        console.log("got", listing);
        const posts = listing.data.children;

        this.OnGotImgPosts(posts.filter(post => post.data.post_hint === "image"));        
    }

    OnGotImgPosts(posts: Post[]) {
        const previewUrls = posts.map(post => {
            const url = this.LargestPreviewUrl(post.data.preview.images[0].resolutions);
            return this.CleanUrl(url)
        });

        this._onUrls(previewUrls);
    }

    private LargestPreviewUrl(resolutions: PreviewImageResolution[]) {
        return resolutions[resolutions.length-1].url;
    }

    private CleanUrl(dirty: string): string {
        return dirty.replaceAll("&amp;", "&");
    }
}

async function GetListing(subredditName: string, lastAfter = ""): Promise<Listing | null> {
    if (subredditName.length === 0) {
        return null;
    }

    let params = [subredditName, "hot"];
    if (subredditName.includes(":")) {
        params = subredditName.split(":");
    }

    let url = `https://www.reddit.com/r/${params[0]}/${params[1]}.json?limit=64`;

    if (lastAfter.length > 0) {
        url += `&after=${lastAfter}`;
    }
    
    console.debug(`Request url: ${url}`);
    //fetch(url).then(r => r.json()).then(this.OnGotPosts.bind(this)).catch(reason => console.error(reason));
    let response = await fetch(url);
    let listing = await response.json() as Listing;
    return listing;
}

class ListingVM {
    public ImagePosts: ImagePostVM[];
    public VideoPosts: VideoPostVM[];
    constructor(public Listing: Listing) {
        this.ImagePosts = this.Listing.data.children.filter(entry => entry.data.post_hint === "image").map(imagePost => new ImagePostVM(imagePost.data));
        this.VideoPosts = this.Listing.data.children.filter(entry => entry.data.post_hint === "rich:video").map(videoPost => new VideoPostVM(videoPost.data));
    }
}

class PostVM {
    constructor(public PostData: PostData) {
        
    }

    public CleanUrl(dirty: string): string {
        return dirty.replaceAll("&amp;", "&");
    }
}

class ImagePostVM extends PostVM {
    constructor(postData: PostData) {
        super(postData);
    }

    public LargestPreviewUrl() {
        if (this.PostData.preview.enabled) {
            const resolutions = this.PostData.preview.images[0].resolutions;
            return this.CleanUrl(resolutions[resolutions.length-1].url);
        } else {
            return "";
        }
    }

    public SourceUrl() {
        if (this.PostData.preview.enabled) {
            return this.CleanUrl(this.PostData.preview.images[0].source.url);
        } else {
            return "";
        }
    }

    public SourceSize() {
        return `${this.PostData.preview.images[0].source.width}x${this.PostData.preview.images[0].source.height}`;
    }

    public Permalink() {
        return "https://www.reddit.com" + this.PostData.permalink;
    }
}

class VideoPostVM {
    constructor(public PostData: PostData) {

    }
}
