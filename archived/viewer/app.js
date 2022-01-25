
$(document).ready(() => new App());

class App {
    constructor() {
        this.inputView = new InputView(this.Get.bind(this), this.ClearPosts.bind(this));
        document.body.appendChild(this.inputView.view);

        this.postsView = new PostsView();
        document.body.appendChild(this.postsView.view);

        this.InitInfiniscroll();
        this.Get();
    }

    InitInfiniscroll() {
        this.lastAfter = "";
        this.pendingRequest = false;
        window.onwheel = this.OnScroll.bind(this);

        this.inputView.view.onchange = () => {
            this.lastAfter = "";
        }
    }

    OnScroll(e) {
        console.log(e.deltaY);
        if (e.deltaY < 0) {
            console.log("less than zero");
            return;
        }

        const {
            scrollTop,
            scrollHeight,
            clientHeight
        } = document.documentElement;

        const atBottom = scrollTop + clientHeight >= scrollHeight;
        console.log(`this.lastAfter.length: ${this.lastAfter.length} this.pendingRequest: ${this.pendingRequest} atBottom: ${atBottom}`);

        if (this.lastAfter.length > 0 && this.pendingRequest === false && atBottom) {
            console.log("load more");
            this.pendingRequest = true;
            this.Get();
        }
    }

    Get() {
        const requestSubreddit = this.inputView.requestSubreddit;

        if (requestSubreddit.length === 0) {
            return;
        }

        let url = `https://www.reddit.com/r/${requestSubreddit}/hot.json?limit=64`;

        if (this.lastAfter.length > 0) {
            url += `&after=${this.lastAfter}`;
        }
        
        if (url && url.length > 0) {
            $.get(url, this.HandleResponse.bind(this));
        }
    }

    HandleResponse(response, status) {
        this.pendingRequest = false;
        if (status !== "success") {
            alert(`Request error: ${status}`);
            return;
        }

        this.lastAfter = response.data.after;
        if (!this.lastAfter) { 
            console.log("response.data.after is undefined");
            this.lastAfter = ""; 
        }

        console.log(status);    
        console.log(response);
        const postInfos = response.data.children.map(child => new PostInfo(child.data));
        //console.log(postInfos);
        this.postsView.AddPosts(postInfos);
        console.log(`num posts: ${this.postsView.view.children.length}`)
    }

    ClearPosts() {
        this.postsView.view.innerHTML = "";
        this.lastAfter = "";
        this.inputView.input.value = "";
        this.inputView.input.focus();
    }
}

class InputView {
    get requestSubreddit() { return this.input.value; }

    constructor(onclick, onclear) {
        this.input = document.createElement("input");
        this.input.classList.add("input-request-endpoint");
        this.input.type = "text";
        this.input.value = "wallpaper";
        setTimeout(e => this.input.focus(), 500);    // hacky, but works. Wait until input is in the DOM before calling focus.

        const button = document.createElement("button");
        button.classList.add("button-get");
        button.onclick = onclick;
        button.innerHTML = "Get";

        const clearButton = document.createElement("button");
        clearButton.classList.add("button-get");
        clearButton.onclick = onclear;
        clearButton.innerHTML = "Clear";

        this.view = document.createElement("div");
        this.view.classList.add("input-view");
        
        this.view.appendChild(this.input);
        this.view.appendChild(button);
        this.view.appendChild(clearButton);
    }
}

class PostsView {
    constructor() {
        this.view = document.createElement("div");
        this.view.classList.add("posts-view");
    }

    AddPosts(postInfos) {
        postInfos.map(
            info => new PostView(info))
                .forEach(view => this.view.appendChild(view.target));
    }
}

class PostInfo {
    static permalinkBase = "http://www.reddit.com";

    constructor(postData) {
        this.title = postData.title;
        this.url = postData.url;
        this.thumbnail = postData.thumbnail;
        this.permalink = postData.permalink;
        this.downs = postData.downs;
        this.ups = postData.ups;

        // created_utc is seconds since epoch. Multiple by 1000 to pass milliseconds to Date
        this.dateCreated = new Date(postData.created_utc * 1000);
    }
}

class PostView
{
    constructor(postInfo) {
        this.target = document.createElement("div");
        
        if (postInfo.thumbnail && postInfo.thumbnail.includes("http")) {
            this.target.appendChild(new ThumbnailAnchor(postInfo).target);
        }
        else {
            this.target.appendChild(new TextAnchor(postInfo).target);
        }
    }
}

class ThumbnailAnchor {
    constructor(postInfo) {
        const div = document.createElement("div");
        div.classList.add("thumbnail-anchor");
        div.style.background = `url("${postInfo.thumbnail}")`;
        div.style.backgroundPosition = "center";
        div.style.backgroundSize = "cover";
        
        this.target = document.createElement("a");
        this.target.href = postInfo.url;
        this.target.target = "_blank";
        this.target.style.border = "0";
        this.target.appendChild(div);

        div.onclick = e => {
            $.get(PostInfo.permalinkBase + postInfo.permalink + ".json", (response, status) => {
                console.log(response);
            });
        }
    }
}
