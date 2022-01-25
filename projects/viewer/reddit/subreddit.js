import { button, Div, Flex, span, StatesButton, textInput } from "../../../lib/ele/ele.js";
import { Posts } from "./posts.js";

export class SubReddit extends Div {
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