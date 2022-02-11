/// <reference path="reddit.ts" />
/// <reference path="previewer.ts" />

class PresentSubreddit {
    public Name: string = "";
    public LastAfter: string = "";
    public NumPosts: number = 0;

    constructor( ) { }
}

const presentSubreddit = new PresentSubreddit();
const previewer = new Previewer();
const defaultSubreddit = "earthporn:new";

async function GetPosts(subreddit: string) {
    if (presentSubreddit.Name !== subreddit) {
        presentSubreddit.Name = subreddit;
        presentSubreddit.LastAfter = "";
        presentSubreddit.NumPosts = 0;
        previewer.Clear();
    }

    const listing = await GetListing(subreddit, presentSubreddit.LastAfter)

    if (listing) {
        previewer.AddListing(new ListingVM(listing));

        presentSubreddit.Name = subreddit;
        presentSubreddit.LastAfter = listing.data.after;
        presentSubreddit.NumPosts += listing.data.children.length;

        console.log(presentSubreddit);
    }
}

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

    SetTextInputValue(text: string) {
        this._textInput.value = text;
    }
}

const subredditInput = new SubredditInput(defaultSubreddit, (newSubreddit: string) => GetPosts(newSubreddit));

document.body.addEventListener("wheel", e => { previewer.OnWheel(e); }, { passive: false });
document.body.onpaste = (e: ClipboardEvent) => {
    navigator.clipboard.readText().then(pastedText => {
        GetPosts(pastedText)
        subredditInput.SetTextInputValue(pastedText)
    });
};

GetPosts(defaultSubreddit);

page().children([
    flex().addChild(previewer).styleAttr("height: 100%; width: 100%"),
    new Clock().styleAttr("position: absolute; top: 5px; left: 5px; color: var(--foreground-color);"),
    contextMenu(document.body, [
        new TextContextMenuItem("Theme", Theme.Toggle),
        new TextContextMenuItem("Clear", () => {
            previewer.Clear()
            presentSubreddit.LastAfter = ""
            presentSubreddit.Name = ""
            subredditInput.SetTextInputValue("")
        }),
        subredditInput.Item,
        new TextContextMenuItem("Load More", () => { 
            if (presentSubreddit.LastAfter == null) { 
                alert("No more posts."); 
            } else { 
                GetPosts(presentSubreddit.Name);
            } 
        })
    ])
]);
