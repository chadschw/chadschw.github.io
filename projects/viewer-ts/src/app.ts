/// <reference path="reddit.ts" />
/// <reference path="previewer.ts" />

const previewer = new Previewer();
const defaultSubreddit = "earthporn:new";

async function GetPosts(subreddit: string) {
    new Subreddit(previewer.AddPreviews.bind(previewer)).OnGetPosts(subreddit);
    // const listing = await GetListing(subreddit)
    // console.debug(listing?.data.after);
}

document.body.addEventListener("wheel", e => { previewer.OnWheel(e); }, { passive: false });

GetPosts(defaultSubreddit);

class SubredditInput  {
    public Item: TextInputContextMenuItem;
    private _textInput: TextInput;

    constructor(initialString: string, private _onNewSubreddit: (newSubreddit: string) => void) {
        this._textInput = textInput(initialString)
            .onenter(this.OnEnter.bind(this));

        this.Item = new TextInputContextMenuItem(this._textInput);
    }

    private OnEnter(e: Event) {
        this._onNewSubreddit(this._textInput.value);
    }
}

page().children([
    flex().addChild(previewer).styleAttr("height: 100%; width: 100%"),
    new Clock().styleAttr("position: absolute; top: 5px; left: 5px; color: var(--foreground-color);"),
    contextMenu(document.body, [
        new TextContextMenuItem("Theme", Theme.Toggle),
        new TextContextMenuItem("Clear", () => previewer.Clear()),
        new SubredditInput(defaultSubreddit, (newSubreddit: string) => GetPosts(newSubreddit)).Item
    ])
]);
