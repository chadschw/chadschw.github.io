/// <reference path="reddit.ts" />
/// <reference path="previewer.ts" />
/// <reference path="dynamic-previewer.ts" />
/// <reference path="../../../libts/cipher/cipher-text.ts" />

class PresentSubreddit {
    public Name: string = "";
    public LastAfter: string = "";
    public NumPosts: number = 0;

    constructor( ) { }
}

const presentSubreddit = new PresentSubreddit();
//const previewer = new Previewer();
const previewer = new DynamicPreviewer();
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

async function DoSearchSubreddit(q: string) {
    previewer.Clear();
    const listing = await SearchReddit(q);
    if (listing) {
        previewer.AddListing(new ListingVM(listing));

        presentSubreddit.Name = "showing search results";
        presentSubreddit.LastAfter = listing.data.after;
        presentSubreddit.NumPosts += listing.data.children.length;
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
const searchInput = new SubredditInput("", DoSearchSubreddit);

document.body.addEventListener("wheel", e => { previewer.OnWheel(e); }, { passive: false });
document.body.onpaste = (e: ClipboardEvent) => {
    navigator.clipboard.readText().then(pastedText => {
        GetPosts(pastedText)
        subredditInput.SetTextInputValue(pastedText)
    });
};

GetPosts(defaultSubreddit);

const encoded = "12425553545912484944452a614c4558614e4e6e7366772a414e47454c49434245415554592a614e4e416b4154484152494e41762a616e7366772a414d415a494e47544954532a614e494d454d45532a6153484c4559744552564f52542a61545452414354495645614e494d415445442a615554554d4e66414c4c532a42414245534449524543544f52592a62454155544946554c66454d414c45532a62454155544946554c734c494d774f4d454e2a6245535462494b494e49624f444945532a62455354704f524e694e67414c4158592a42494754495453494e42494b494e49532a42494b494e49424f444945532a62494b494e49645245414d532a42494b494e49532a424f445950455246454354494f4e2a424f4f42424f554e43452a424f4f424945532a624f4f4253694e614354494f4e2a424f4f4d455248454e5441492a424f5554494e454241424553582a425241564f7f4749524c532a625245415354654e56592a62524f4f4b456255524b452a62555354597045544954452a63415355414c6a4947474c45532a63454c4542524954597f634c4541564147452a63494e44596d454c4c4f704943532a634c4152416c494e44424c4f4d2a634c41535359704f524e53544152532a434c41535359534558592a634c4f5448454462454155544945532a434f53504c41597f42414245532a434f53504c41594749524c532a63524953545972454e2a64634749524c532a645245535345447550664f52616348414e47452a654c5349456845574954542a654d494c59724154414a4b4f57534b492a65524f5449436255546e4f54704f524e2a65524f54494364414e43494e472a464c4143415300085350414e49534800464f5200534b494e4e59004749524c092a664954614e446e41545552414c2a46495443454c4542532a4649544749524c532a6649544e45535373544152532a664954734558596154484c455449436749524c532a464f525459464956454649465459464956452a67414c494e41645542454e454e4b4f2a47454e544c4542454155544945532a4749524c5346494e495348494e475448454a4f422a474f444445535345537f122a474f4c46434849434b532a474f5247454f55534e5544454749524c532a4752414345424f4f527f4c4f56452a67594d6d4f44454c532a68454752452a68454c47416c4f56454b4154592a48454e5441492a68656e7461697f6769662a48454e5441494d454d45532a684947486845454c532a684947487245536e7366772a484f4e4559445249502a684f547f624142452a684f546749524c53734d494c494e472a684f54544553546142532a684f545445535466454d414c456154484c455445532a494e5354414752414d53574545544845415254532a69726c4749524c532a4a41534d494e4e474c4f564552522a4a455353494341414c42412a6a4553534943417241424249542a6a555354684f54774f4d454e2a6b4154484152494e417f6d415a4550412a4b415445454f57454e2a6b41545941634c4f5645522a4c494e47455249452a4c4954544c45434150524943452a6c49594173494c5645522a6d4152545a4950414e4f56412a6d4152596e41424f4b4f56412a4d415652494e4d4f44454c532a4d4943524f42494b494e4953424f444945532a4d4f44454c532a6d4f44454c53674f4e456d494c442a4d4f44454c574f4d454e2a4d4f4e4445544f504c4553532a6e4154416c45452a6e4552564544454d4f4e2a6e4557794f524b6e494e452a6e494e54454e444f7741494655532a4e4950504c457f524950504c452a6e6e666e2a6e4f5354414c47494166415050494e472a4e5346572a4e5346577f4749462a6e73667766554e4e592a4f4c47414b4f425a41522a6f56455257415443487f704f524e2a704958454c6152546e7366772a704c4159424f592a504f524e69642a7052454d49554d7f704f524e4f4752415048592a7052455454596749524c532a505245545459574f4d454e2a7213144f56455257415443482a72414348454c634f4f4b2a52414348454c434f4f4b4e5346572a52414e444f4d534558494e4553532a724544484541444544674f444445535345532a724554524f55535345744954532a52554c4513142a52554c4513147f434f4d4943532a72554c4513146c4f6c2a53414c4d41484159454b2a5255535349414e4749524c532a7345445543544956456749524c536c4f554e47452a534558594255544e4f54504f524e2a53455859425554504f524e2a534558594749524c532a73455859774f4d414e6f467448456441592a73697357494d535549546749524c532a734b494e4e59774954486142532a734c494d414e44735441434b45442a734f46494949492a5357494d5355495453574f4d454e4f4e4c592a744153544546554c4c5972455645414c494e472a5448454649544749524c5a2a7448456c4f5354774f4f44532a7448524545664f55525448536f466114734f4d452a544849474844454f4c4f47592a54494b544f4b484f54474946532a54494b544f4b54484f54532a5449474854445245535345532a544954534f4e41535449434b2a74574f7448495244536f466113534f4d452a7568644e5346572a76414c454e54494e4167524953484b4f000876414b454e544900764954454c092a76414e455353416d415249504f53412a5649434b5950414c4143494f4641502a56494b494f44494e54434f56412a77415443486954664f52744845704c4f542a7745535445524e68454e5441492a57484f4c45534f4d4548454e5441492a574f4d454e574f5253484950";


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
        searchInput.Item,
        new TextContextMenuItem("Load More", () => { 
            if (presentSubreddit.LastAfter == null) { 
                alert("No more posts."); 
            } else { 
                GetPosts(presentSubreddit.Name);
            } 
        }),
        new TextContextMenuItem("x", () => {
            const key = prompt("key");
            if (!key) return;

            if (key.length > 0) {
                const d = decipher(key);
                const unencoded = d(encoded);
                console.log(unencoded)
            }
        })
    ]),
    //new CipherText()
]);
