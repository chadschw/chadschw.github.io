import { button, div, flex, Flex, span, StatesButton, textInput } from "../../../lib/ele/ele.js";
import { Posts } from "./posts.js";

export class SubReddit extends Flex {
    constructor(initialSubreddit) {
        super();
        
        this.styleAttr(`
            align-items: stretch;
            min-height: 100px;
            position: relative;
        `);

        //const header = new Header(initialSubreddit);
        const header = new Header2(initialSubreddit);
        const posts = new Posts();
        header.OnResponseCallback(posts.AddPosts.bind(posts));
        header.OnClealCallback(posts.ClearPosts.bind(posts));
        
        //const controls = new Controls();

        this.children([posts, header/*, controls*/]);

        // this.target.oncontextmenu = e => {
        //     e.preventDefault();
        //     controls.target.style.left = e.clientX + "px";
        //     controls.target.style.top = e.clientY + "px";
        // }
    }
}

// Think about: just right click somewhere and the controls appear at your mouse.
// class Controls extends Flex {
//     constructor() {
//         super();

//         this.styleAttr(`
//             background-color: #202020;
//             flex-direction: column;
//             margin: 10px;
//             padding: 10px;
//             position: absolute;
//             z-index: 10;
//         `);

//         this.subredditInput = textInput("hi");

//         this.children([
//             this.subredditInput,
//             flex().children([
//                 button().addChild(span("get"))/*.onclick(this.OnGetClick.bind(this))*/,
//                 button().addChild(span("clear"))/*.onclick(this.OnClearClick.bind(this))*/,
//                 /*new StatesButton(previewSizes, this.previewSize, this.OnSizeChange.bind(this))*/
//             ]).styleAttr(`
//                 gap: 5px;
//                 margin-top: 5px;
//             `)
//         ]);
//     }
// }

class Header2 extends Flex {
    constructor(initialSubreddit) {
        super();
        this.addClass("header-2");
        this.lastAfter = "";
        this.pendingRequest = false;

        this.subredditInput = textInput(initialSubreddit)
            .setOnClick(e => e.stopPropagation())
            .onenter(this.OnGetClick.bind(this))
            .setSpellcheck(false)
            .setAttr("placeholder", "subreddit");

        const previewSizes = ["sm", "med", "lg"];
        this.previewSize = previewSizes[0];

        this.controls = flex().children([
            flex().children([
                this.subredditInput,
                flex().children([
                    button().addChild(span("get")).onclick(this.OnGetClick.bind(this)),
                    button().addChild(span("clear")).onclick(this.OnClearClick.bind(this)),
                    new StatesButton(previewSizes, this.previewSize, this.OnSizeChange.bind(this))
                ]).styleAttr(`
                    gap: 5px;
                    margin-top: 5px;
                `)
            ]).styleAttr(`
                flex-direction: column;
                justify-content: flex-start;
                margin: 10px;
            `)
        ])
        .styleAttr(`
            align-items: stretch;
            margin: 20px;
        `);

        this.addChild(this.controls);

        // this.children([
        //     this.subredditInput,
        //     button().addChild(span("get")).onclick(this.OnGetClick.bind(this)),
        //     button().addChild(span("clear")).onclick(this.OnClearClick.bind(this)),
        //     new StatesButton(previewSizes, this.previewSize, this.OnSizeChange.bind(this))
        // ]);

        this.OnGetClick();

        this.controlsVisible = false;
        this.target.onclick = e => {
            if (this.controlsVisible) {
                this.styleAttr("");
            } else {
                this.styleAttr("right: 0px;");
            }
            this.controlsVisible = !this.controlsVisible;
        }
    }

    OnResponseCallback(callback) {
        this.onResponseCallback = callback;
        return this;
    }

    OnClealCallback(callback) {
        this.onClearCallback = callback;
    }

    OnGetClick(e) { 
        if (e) { e.stopPropagation(); }
        
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
        if (e) { e.stopPropagation(); }
        this.subredditInput.value = "";
        this.subredditInput.target.focus();
        this.lastAfter = "";
        if (this.onClearCallback) {
            this.onClearCallback();
        } else {
            console.warn("No onClearCallback set.");
        }
    }

    OnSizeChange(e, newSize) {
        if (e) { e.stopPropagation(); }
        console.log(`new size is ${newSize}`);
        this.previewSize = newSize;
        const subredditName = this.subredditInput.value;
        this.OnClearClick(null);
        this.subredditInput.value = subredditName;
        this.OnGetClick(null);
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