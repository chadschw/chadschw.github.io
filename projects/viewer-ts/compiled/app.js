"use strict";
class Ele {
    constructor(tagName) {
        if (typeof (tagName) === 'string') {
            this._target = document.createElement(tagName);
        }
        else {
            this._target = tagName;
        }
    }
    get target() { return this._target; }
    classes(classNames) {
        classNames.forEach(className => this.target.classList.add(className));
        return this;
    }
    addClass(className) {
        this.target.classList.add(className);
        return this;
    }
    removeClass(className) {
        this.target.classList.remove(className);
        return this;
    }
    styleAttr(value) {
        this.target.setAttribute("style", value);
        return this;
    }
    addStyleAttr(value) {
        const presStyle = this.target.getAttribute("style");
        if (!presStyle) {
            this.styleAttr(value);
        }
        else {
            this.styleAttr(presStyle + " " + value);
        }
        return this;
    }
    setAttr(name, value) {
        this.target.setAttribute(name, value);
        return this;
    }
}
class HtmlEle extends Ele {
    get target() {
        return this._target;
    }
    constructor(tagName) {
        super(tagName);
    }
    setOnMouseDown(action) {
        this.target.onmousedown = action;
        return this;
    }
    setOnClick(action) {
        this.target.onclick = action;
        return this;
    }
    height(h) {
        this.target.style.height = h + "px";
        return this;
    }
    width(w) {
        this.target.style.width = w + "px";
        return this;
    }
}
class HtmlContainerEle extends HtmlEle {
    constructor(tagName) {
        super(tagName);
    }
    children(kids) {
        kids.forEach(kid => this.target.appendChild(kid.target));
        return this;
    }
    addChild(kid) {
        return this.children([kid]);
    }
}
class Page extends HtmlContainerEle {
    constructor() {
        super(document.body);
    }
}
function page() { return new Page(); }
class Div extends HtmlContainerEle {
    constructor() {
        super("div");
    }
}
function div() { return new Div(); }
class Span extends HtmlContainerEle {
    constructor() {
        super("span");
    }
    textContent(text) {
        this.target.textContent = text;
        return this;
    }
}
function span() { return new Span(); }
class Flex extends Div {
    constructor() {
        super();
        this.addClass("flex");
    }
}
function flex() { return new Flex(); }
class Anchor extends HtmlContainerEle {
    get target() { return this._target; }
    constructor() {
        super("a");
    }
    href(url) {
        this.target.href = url;
        return this;
    }
    setTarget(t = "_blank") {
        this.target.setAttribute("target", t);
        return this;
    }
    download(fileName) {
        this.setAttr("download", fileName);
        return this;
    }
}
function anchor() { return new Anchor(); }
class Img extends HtmlEle {
    get target() { return this._target; }
    constructor() {
        super("img");
    }
    src(url) {
        this.target.src = url;
        return this;
    }
}
function img() { return new Img(); }
class TextInput extends HtmlEle {
    get target() { return this._target; }
    get value() { return this.target.value; }
    set value(v) { this.target.value = v; }
    constructor(initialValue) {
        super("input");
        this.classes(["text-input"]);
        this.target.type = "input";
        if (initialValue) {
            this.value = initialValue;
        }
    }
    onenter(action) {
        this.target.onkeydown = (e) => {
            if (e.key === "Enter") {
                action(e);
            }
        };
        return this;
    }
    setSpellcheck(value) {
        this.target.setAttribute("spellcheck", value ? "true" : "false");
        return this;
    }
}
function textInput(initialValue) { return new TextInput(initialValue); }
class TextArea extends HtmlEle {
    get target() { return this._target; }
    get value() { return this.target.value; }
    set value(v) { this.target.value = v; }
    constructor(initialValue) {
        super("textarea");
        this.classes(["text-input"]);
        if (initialValue) {
            this.value = initialValue;
        }
    }
    ColsRows(cols, rows) {
        this.setAttr("cols", cols.toString());
        this.setAttr("rows", rows.toString());
        return this;
    }
}
class Button extends HtmlContainerEle {
    constructor() {
        super("button");
    }
    onclick(action) {
        this.target.onclick = action;
        return this;
    }
}
function button() { return new Button(); }
class Video extends HtmlEle {
    get target() { return this.target; }
    constructor() {
        super("video");
    }
    src(s) {
        this.target.src = s;
        return this;
    }
    controls() {
        this.setAttr("controls", "true");
        return this;
    }
}
function video() { return new Video(); }
// Utility functions.
// return a random number where  min <= x < max.
function randBetween(min, max) {
    const delta = max - min;
    const value = Math.random() * delta;
    return min + value;
}
function randomColor(alpha = 1) {
    return `rgba(${randBetween(0, 256)}, ${randBetween(0, 256)}, ${randBetween(0, 256)}, ${alpha})`;
}
/**
     * Modern browsers can download files that aren't from same origin this is a workaround to download a remote file
     * @param `url` Remote URL for the file to be downloaded
     */
function download(url, filename) {
    fetch(url)
        .then(response => response.blob())
        .then(blob => {
        const blobURL = URL.createObjectURL(blob);
        const a = anchor().href(blobURL);
        a.styleAttr("display: none");
        if (filename && filename.length)
            a.download(filename);
        document.body.appendChild(a.target);
        a.target.click();
        document.body.removeChild(a.target);
    })
        .catch((e) => console.error("Download error:", e));
}
class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    Add(other) {
        this.x += other.x;
        this.y += other.y;
    }
    Subtract(other) {
        this.x -= other.x;
        this.y -= other.y;
    }
}
class MouseClickAndDrag {
    constructor(ele, _onDrag) {
        this._onDrag = _onDrag;
        this._boundDrag = e => { };
        this._boundUp = e => { };
        ele.target.addEventListener("mousedown", e => {
            e.preventDefault();
            e.stopPropagation();
            this._boundDrag = this._onDrag.bind(ele);
            this._boundUp = this.OnMouseUp.bind(this);
            window.addEventListener("mousemove", this._boundDrag);
            window.addEventListener("mouseup", this._boundUp);
        });
    }
    OnMouseUp(e) {
        window.removeEventListener("mousemove", this._boundDrag);
        window.removeEventListener("mouseup", this._boundUp);
    }
}
class MouseDownUp {
    constructor(ele, _onDown, _onUp) {
        this._onDown = _onDown;
        this._onUp = _onUp;
        this._boundUp = e => { };
        ele.target.addEventListener("mousedown", e => {
            e.preventDefault();
            e.stopPropagation();
            this._onDown(e);
            this._boundUp = this.OnMouseUp.bind(this);
            window.addEventListener("mouseup", this._boundUp);
        });
    }
    OnMouseUp(e) {
        this._onUp(e);
        window.removeEventListener("mouseup", this._boundUp);
    }
}
function ShortMonthName(d) { return new Intl.DateTimeFormat("en-US", { month: "short" }).format(d); }
function TwoDigit(x, locale = "en-us") {
    return x.toLocaleString(locale, { minimumIntegerDigits: 2 });
}
function hhmm(d) { return d.getHours() + ":" + TwoDigit(d.getMinutes()); }
;
function dayMonthYear(d) { return `${d.getDate()} ${ShortMonthName(d)} ${d.getFullYear()}`; }
class Clock extends Flex {
    constructor() {
        super();
        this.classes(["clock"]);
        this._timeSpan = span().styleAttr("font-size: 2.2rem");
        this._dateSpan = span();
        this.children([
            div().addChild(this._timeSpan),
            div().addChild(this._dateSpan)
        ]);
        setInterval(() => {
            const d = new Date();
            this._timeSpan.textContent(hhmm(d));
            this._dateSpan.textContent(dayMonthYear(d));
        }, 1000);
    }
}
class StatesButton extends Button {
    constructor(_states, initialState, _onClickCallback) {
        super();
        this._states = _states;
        this._onClickCallback = _onClickCallback;
        this._buttonSpan = span().textContent(initialState);
        this.addChild(this._buttonSpan);
        this.onclick(this.OnClick.bind(this));
    }
    OnClick(e) {
        let newIdx = this._states.indexOf(this._buttonSpan.target.innerHTML) + 1;
        if (newIdx < 0 || newIdx >= this._states.length) {
            newIdx = 0;
        }
        ;
        this._buttonSpan.textContent(this._states[newIdx]);
        this._onClickCallback(e, this._states[newIdx]);
        return this;
    }
}
class Theme {
    static IsDark() {
        return document.body.classList.contains(Theme._dark);
    }
    static Toggle() {
        if (Theme.IsDark()) {
            Theme.SetLight();
        }
        else {
            Theme.SetDark();
        }
    }
    static SetLight() {
        if (Theme.IsDark()) {
            document.body.classList.remove(Theme._dark);
        }
    }
    static SetDark() {
        if (!Theme.IsDark()) {
            document.body.classList.add(Theme._dark);
        }
    }
}
Theme._dark = "dark";
class ThemeToggleButton extends Div {
    constructor() {
        super();
        this.classes(["toggle-theme-button"]);
        this.target.style.backgroundColor = Theme.IsDark() ? "transparent" : "var(--foreground-color)";
        this.setOnClick(this.OnClick.bind(this));
    }
    OnClick(e) {
        if (Theme.IsDark()) {
            Theme.SetLight();
        }
        else {
            Theme.SetDark();
        }
    }
}
function themeToggleButton() {
    return new ThemeToggleButton();
}
class ContextMenuItem extends Div {
    constructor(onClick, closeAfterClick = true) {
        super();
        this.onClick = onClick;
        if (closeAfterClick) {
            this.setOnClick((e) => {
                e.stopPropagation();
                onClick();
                if (this.target.parentElement) {
                    this.target.parentElement.style.display = "none";
                }
            });
        }
        else {
            this.setOnClick(e => {
                e.stopPropagation();
                onClick();
            });
        }
        this.target.addEventListener("mousedown", e => e.stopPropagation());
        this.target.addEventListener("mouseup", e => e.stopPropagation());
        this.classes(["context-menu-item"]);
    }
}
class TextContextMenuItem extends ContextMenuItem {
    constructor(text, onclick) {
        super(onclick);
        this.addChild(span().textContent(text));
    }
}
class TextInputContextMenuItem extends ContextMenuItem {
    constructor(textInput) {
        super(() => { });
        this.addChild(textInput);
        textInput.setOnClick(e => textInput.target.select());
        this.setOnClick(e => e.stopPropagation());
    }
}
class ContextMenu extends Div {
    constructor(element, items) {
        super();
        this.children(items);
        this.classes(["context-menu"]);
        element.oncontextmenu = this.OnContextMenu.bind(this);
    }
    OnContextMenu(e) {
        e.preventDefault();
        e.stopPropagation();
        if (this.target.style.display === "block") {
            this.target.style.display = "none";
            return;
        }
        this.target.style.top = e.offsetY + "px";
        this.target.style.left = e.offsetX + "px";
        this.target.style.display = "block";
    }
}
function contextMenu(ele, items) {
    return new ContextMenu(ele, items);
}
class SvgEle extends Ele {
    constructor(tagName) {
        super(document.createElementNS(SvgEle.xmlns, tagName));
    }
    setAttrNS(name, value) {
        this.target.setAttributeNS(null, name, value);
        return this;
    }
}
SvgEle.xmlns = "http://www.w3.org/2000/svg";
class Svg extends SvgEle {
    get target() {
        return this._target;
    }
    constructor() {
        super("svg");
    }
    children(kids) {
        kids.forEach(kid => this.target.appendChild(kid.target));
        return this;
    }
    addChild(kid) {
        return this.children([kid]);
    }
    widthHeight(w, h) {
        this.setAttrNS("width", w.toString());
        this.setAttrNS("height", h.toString());
        return this;
    }
    viewBox(x, y, w, h) {
        this.setAttrNS("viewBox", `${x},${y},${w},${h}`);
        return this;
    }
}
class Circle extends SvgEle {
    constructor() {
        super("circle");
    }
    Radius(r) {
        this.setAttrNS("r", r.toString());
        return this;
    }
    Center(x, y) {
        this.setAttrNS("cx", x.toString());
        this.setAttrNS("cy", y.toString());
        return this;
    }
}
class Path extends SvgEle {
    constructor() {
        super("path");
    }
    d(str) {
        this.setAttrNS("d", str);
        return this;
    }
    static randomPath(min, max, steps) {
        const start = (max - min) / 2;
        let s = `M${start},${start} `;
        for (let i = 0; i < steps; i++) {
            s += `L${randBetween(min, max)},${randBetween(min, max)} `;
        }
        return s;
    }
}
class Subreddit {
    //private _lastAfter: string = "";
    constructor(_onUrls) {
        this._onUrls = _onUrls;
    }
    OnGetPosts(subreddit) {
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
    OnGotPosts(listing) {
        console.log("got", listing);
        const posts = listing.data.children;
        this.OnGotImgPosts(posts.filter(post => post.data.post_hint === "image"));
    }
    OnGotImgPosts(posts) {
        const previewUrls = posts.map(post => {
            const url = this.LargestPreviewUrl(post.data.preview.images[0].resolutions);
            return this.CleanUrl(url);
        });
        this._onUrls(previewUrls);
    }
    LargestPreviewUrl(resolutions) {
        return resolutions[resolutions.length - 1].url;
    }
    CleanUrl(dirty) {
        return dirty.replaceAll("&amp;", "&");
    }
}
async function GetListing(subredditName, lastAfter = "") {
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
    let listing = await response.json();
    return listing;
}
async function SearchReddit(q, lastAfter = "") {
    if (q.length === 0) {
        return null;
    }
    let url = `https://www.reddit.com/search/.json?q=${q}`;
    if (lastAfter.length > 0) {
        url += `&after=${lastAfter}`;
    }
    console.debug(`Request url: ${url}`);
    let response = await fetch(url);
    let listing = await response.json();
    return listing;
}
class ListingVM {
    constructor(Listing) {
        this.Listing = Listing;
        this.ImagePosts = this.Listing.data.children.filter(entry => entry.data.post_hint === "image").map(imagePost => new ImagePostVM(imagePost.data));
        this.VideoPosts = this.Listing.data.children.filter(entry => entry.data.post_hint === "rich:video").map(videoPost => new VideoPostVM(videoPost.data));
    }
}
class PostVM {
    constructor(PostData) {
        this.PostData = PostData;
    }
    CleanUrl(dirty) {
        return dirty.replaceAll("&amp;", "&");
    }
    CreatedDateTime() {
        var date = new Date(this.PostData.created_utc * 1000);
        return dayMonthYear(date) + " " + hhmm(date);
    }
    Url() {
        return this.CleanUrl(this.PostData.url);
    }
}
class ImagePostVM extends PostVM {
    constructor(postData) {
        super(postData);
    }
    SmallestPreviewUrl() {
        if (this.PostData.preview.enabled) {
            const resolutions = this.PostData.preview.images[0].resolutions;
            return this.CleanUrl(resolutions[0].url);
        }
        else {
            return "";
        }
    }
    SmallestPreviewWidthHeight() {
        if (this.PostData.preview.enabled) {
            const resolutions = this.PostData.preview.images[0].resolutions;
            return new Point(resolutions[0].width, resolutions[0].height);
        }
        else {
            return new Point(0, 0);
        }
    }
    LargestPreviewUrl() {
        if (this.PostData.preview.enabled) {
            const resolutions = this.PostData.preview.images[0].resolutions;
            return this.CleanUrl(resolutions[resolutions.length - 1].url);
        }
        else {
            return "";
        }
    }
    LargestPreviewWidthHeight() {
        if (this.PostData.preview.enabled) {
            const resolutions = this.PostData.preview.images[0].resolutions;
            return new Point(resolutions[resolutions.length - 1].width, resolutions[resolutions.length - 1].height);
        }
        else {
            return new Point(0, 0);
        }
    }
    NumPreviewSizes() {
        return this.PostData.preview.enabled ?
            this.PostData.preview.images[0].resolutions.length : 0;
    }
    PreviewUrl(index) {
        const numPreviews = this.NumPreviewSizes();
        if (numPreviews == 0) {
            return "";
        }
        if (index >= this.NumPreviewSizes()) {
            index = this.NumPreviewSizes() - 1;
        }
        return this.CleanUrl(this.PostData.preview.images[0].resolutions[index].url);
    }
    SourceUrl() {
        if (this.PostData.preview.enabled) {
            return this.CleanUrl(this.PostData.preview.images[0].source.url);
        }
        else {
            return "";
        }
    }
    SourceSize() {
        return `${this.PostData.preview.images[0].source.width}x${this.PostData.preview.images[0].source.height}`;
    }
    Permalink() {
        return "https://www.reddit.com" + this.PostData.permalink;
    }
}
class VideoPostVM {
    constructor(PostData) {
        this.PostData = PostData;
    }
}
class Previewer extends Flex {
    constructor() {
        super();
        this._img = new PreviewImg();
        this._postIdx = 0;
        this._imgPosts = [];
        this._activePost = null;
        this._previewImgInfoVM = new PreviewImgInfoVm();
        this.styleAttr(`
            height: 75%; 
            width: 90%;
            flex-direction: column;
        `);
        this._previewImgInfoVM.target.style.visibility = "hidden";
        this.children([
            this._img,
            this._previewImgInfoVM,
            contextMenu(this._img.target, [
                new TextContextMenuItem("Info", () => {
                    let visibility = this._previewImgInfoVM.target.style.visibility;
                    if (visibility === "hidden") {
                        this._previewImgInfoVM.target.style.visibility = "visible";
                    }
                    else {
                        this._previewImgInfoVM.target.style.visibility = "hidden";
                    }
                }),
                new TextContextMenuItem("Source", () => window.open(this._activePost?.SourceUrl(), "_blank")),
                new TextContextMenuItem("Url", () => window.open(this._activePost?.Url(), "_blank")),
                new TextContextMenuItem("Permalink", () => window.open(this._activePost?.Permalink(), "_blank")),
                new TextContextMenuItem("Search Reddit", () => window.open(`https://www.reddit.com/search/?q=${this._activePost?.PostData.title}`)),
                new TextContextMenuItem("Search Google", () => window.open(`https://www.google.com/search?q=${this._activePost?.PostData.title}`))
            ])
        ]);
    }
    AddListing(listing) {
        this._imgPosts = this._imgPosts.concat(listing.ImagePosts);
        this.SetActivePost();
    }
    Clear() {
        this._postIdx = 0;
        this._imgPosts = [];
        this._img.Clear();
        this._previewImgInfoVM.Clear();
    }
    OnWheel(e) {
        e.preventDefault();
        if (e.deltaY > 0) {
            if (this._postIdx < this._imgPosts.length - 1) {
                this._postIdx++;
                this.SetActivePost();
            }
        }
        else if (this._postIdx > 0) {
            this._postIdx--;
            this.SetActivePost();
        }
    }
    SetActivePost() {
        this._activePost = this._imgPosts[this._postIdx];
        this._img.src(this._activePost.LargestPreviewUrl());
        this._previewImgInfoVM.Update(this._activePost, this._postIdx + 1, this._imgPosts.length);
    }
}
class PreviewImg extends Img {
    constructor() {
        super();
        this.styleAttr(`
            box-shadow: 0px 0px 3px 3px var(--shade-3);
            border: 16px solid white;
            border-radius: 30px;
            max-height: 100%;
            max-width: 100%;
        `);
    }
    Clear() {
        this.src("");
    }
}
class PreviewImgInfoVm extends Flex {
    constructor() {
        super();
        this._title = span().styleAttr("user-select: text;");
        this._size = span();
        this._created = span();
        this._position = span();
        this.styleAttr(`
            background-color: var(--background-color);
            border-radius: var(--border-radius);
            box-shadow: var(--box-shadow);
            color: var(--foreground-color);
            flex-direction: column;
            font-size: 1.6rem;
            margin: 10px;
            padding: 10px;
        `);
        this.target.style.flexDirection = "column";
        this.target.style.fontSize = "1.6rem";
        this.target.style.margin = "10px";
        this.target.style;
        this.children([
            div().addChild(this._title),
            flex().children([this._size, this._created, this._position]).styleAttr("gap: 20px; wrap: nowrap;"),
        ]);
    }
    Update(postVM, num, totalNum) {
        this._title.textContent(postVM.PostData.title);
        this._size.textContent(postVM.SourceSize());
        this._created.textContent(postVM.CreatedDateTime());
        this._position.textContent(`${num} of ${totalNum}`);
    }
    Clear() {
        this._title.textContent("");
        this._size.textContent("");
        this._created.textContent("");
        this._position.textContent("");
    }
}
class DynamicPreviewer extends Div {
    constructor() {
        super();
        this._imgPosts = [];
        this._postIdx = 0;
        this._floatingImgs = [];
        this.styleAttr("width: 100%; height: 100%;");
        const render = () => {
            this._floatingImgs.forEach(img => img.Update());
            requestAnimationFrame(render);
        };
        render();
    }
    AddListing(listing) {
        this._imgPosts = this._imgPosts.concat(listing.ImagePosts);
        this.AddFloatingImg();
    }
    OnWheel(e) {
        e.preventDefault();
        if (e.deltaY > 0) {
            if (this._postIdx < this._imgPosts.length - 1) {
                this._postIdx++;
                this.AddFloatingImg();
            }
        }
    }
    AddFloatingImg() {
        const r = this.target.getBoundingClientRect();
        const post = this._imgPosts[this._postIdx];
        const imgSize = post.SmallestPreviewWidthHeight();
        const floatingImg = new FloatingImg(post, new Point(r.width / 2 - imgSize.x / 2, r.height / 2 - imgSize.y / 2), new Point(randBetween(-1, 1), randBetween(-1, 1)), randBetween(0.99, 0.999));
        this._floatingImgs.push(floatingImg);
        this.addChild(floatingImg);
    }
    Clear() {
        this._postIdx = 0;
        this._imgPosts = [];
        this.target.innerHTML = "";
    }
}
class FloatingImg extends Div {
    constructor(_imgPostVM, _pos, _vel, _friction) {
        super();
        this._imgPostVM = _imgPostVM;
        this._pos = _pos;
        this._vel = _vel;
        this._friction = _friction;
        this._img = img();
        this._dragHist = [];
        this._length = 10;
        this._downPos = new Point(0, 0);
        this._maxRot = 45;
        this._zRot = 0;
        this._maxZRotVel = 0.5;
        this._zRotVel = randBetween(-this._maxZRotVel, this._maxZRotVel);
        this._previewIndex = 0;
        this.classes(["floating-img"]);
        this._img.classes(["floating-img-img"]);
        this.children([
            this._img,
            contextMenu(this.target, [
                // new TextContextMenuItem("Info", () => { 
                //     let visibility = this._previewImgInfoVM.target.style.visibility;
                //     if (visibility === "hidden") {
                //         this._previewImgInfoVM.target.style.visibility = "visible";
                //     } else {
                //         this._previewImgInfoVM.target.style.visibility = "hidden";
                //     }
                // }),
                new TextContextMenuItem("Source", () => window.open(this._imgPostVM?.SourceUrl(), "_blank")),
                new TextContextMenuItem("Url", () => window.open(this._imgPostVM?.Url(), "_blank")),
                new TextContextMenuItem("Permalink", () => window.open(this._imgPostVM?.Permalink(), "_blank")),
                new TextContextMenuItem("Search Reddit", () => window.open(`https://www.reddit.com/search/?q=${this._imgPostVM?.PostData.title}`)),
                new TextContextMenuItem("Search Google", () => window.open(`https://www.google.com/search?q=${this._imgPostVM?.PostData.title}`))
            ])
        ]);
        this.target.style.left = this._pos.x + "px";
        this.target.style.top = this._pos.y + "px";
        this._img.src(this._imgPostVM.SmallestPreviewUrl());
        this.Update();
        this._numPreviews = this._imgPostVM.NumPreviewSizes();
        new MouseClickAndDrag(this, e => {
            this._pos.x += e.movementX;
            this._pos.y += e.movementY;
        });
        new MouseDownUp(this, e => {
            e.preventDefault();
            e.stopPropagation();
            this._vel = new Point(0, 0);
            this._downPos = new Point(e.clientX, e.clientY);
        }, e => {
            e.preventDefault();
            e.stopPropagation();
            if (e.button == 2)
                return;
            const upPos = new Point(e.clientX, e.clientY);
            upPos.Subtract(this._downPos);
            upPos.x /= 10;
            upPos.y /= 10;
            this._vel = upPos;
            //this._zRotVel = randBetween(-this._maxZRotVel, this._maxZRotVel);
        });
        this.target.onwheel = e => {
            e.stopPropagation();
            e.preventDefault();
            if (e.deltaY > 0) {
                if (this._previewIndex < this._numPreviews - 1) {
                    this._img.src(this._imgPostVM.PreviewUrl(++this._previewIndex));
                    this._zRot = 0;
                    this._zRotVel = 0;
                }
            }
            else if (this._previewIndex > 0) {
                this._img.src(this._imgPostVM.PreviewUrl(--this._previewIndex));
            }
        };
        // // todo: this doesn't remove the image from _floatingImgs.
        // this.target.oncontextmenu = e => {
        //     e.stopPropagation();
        //     e.preventDefault();
        //     this.target.parentElement?.removeChild(this.target);
        // }
        for (let i = 0; i < this._length; i++) {
            this._dragHist[i] = new Point(0, 0);
        }
    }
    Update() {
        this._vel.x *= this._friction;
        this._vel.y *= this._friction;
        if (Math.abs(this._vel.x) < 0.01)
            this._vel.x = 0;
        if (Math.abs(this._vel.y) < 0.01)
            this._vel.y = 0;
        this._pos.x += this._vel.x;
        this._pos.y += this._vel.y;
        this._zRotVel *= this._friction;
        this._zRot += this._zRotVel;
        if (Math.abs(this._zRot) > this._maxRot) {
            this._zRotVel *= -1;
        }
        this.target.style.left = this._pos.x + "px";
        this.target.style.top = this._pos.y + "px";
        this.target.style.transform = `rotateZ(${this._zRot}deg)`;
    }
}
function cipher(salt) {
    const textToChars = (text) => text.split('').map((c) => c.charCodeAt(0));
    const byteHex = (n) => ("0" + Number(n).toString(16)).substr(-2);
    const applySaltToChar = (code) => textToChars(salt).reduce((a, b) => a ^ b, code);
    return (text) => text.split('')
        .map(textToChars)
        .map(applySaltToChar)
        .map(byteHex)
        .join('');
}
function decipher(salt) {
    const textToChars = (text) => text.split('').map((c) => c.charCodeAt(0));
    const applySaltToChar = (code) => textToChars(salt).reduce((a, b) => a ^ b, code);
    return (encoded) => encoded.match(/.{1,2}/g)
        .map((hex) => parseInt(hex, 16))
        .map(applySaltToChar)
        .map((charCode) => String.fromCharCode(charCode))
        .join('');
}
// // To create a cipher
// const myCipher = cipher('mySecretSalt')
// //Then cipher any text:
// console.log(myCipher('the secret string'))
// //To decipher, you need to create a decipher and use it:
// const myDecipher = decipher('mySecretSalt')
// console.log(myDecipher("7c606d287b6d6b7a6d7c287b7c7a61666f"))
/// <reference path="../ele/ele.ts" />
/// <reference path="./cipher.ts" />
class CipherText extends Flex {
    constructor() {
        super();
        const key = new TextInput("");
        const input = new TextArea("").ColsRows(50, 20);
        const encoded = new TextArea("").ColsRows(50, 20);
        const deciphered = new TextArea("").ColsRows(50, 20);
        const button = new Button()
            .addChild(span().textContent("decipher"))
            .setOnClick(e => {
            const k = key.value;
            const encodedText = encoded.value;
            if (k.length > 0 && encodedText.length > 0) {
                const d = decipher(k);
                deciphered.value = d(encoded.value);
            }
        });
        this.children([
            key, input, encoded, button, deciphered
        ]);
        input.target.onchange = e => {
            const k = key.value;
            if (k.length > 0) {
                const c = cipher(k);
                encoded.value = c(input.value);
            }
        };
        this.target.onpaste = e => { e.stopPropagation(); };
    }
}
/// <reference path="reddit.ts" />
/// <reference path="previewer.ts" />
/// <reference path="dynamic-previewer.ts" />
/// <reference path="../../../libts/cipher/cipher-text.ts" />
class PresentSubreddit {
    constructor() {
        this.Name = "";
        this.LastAfter = "";
        this.NumPosts = 0;
    }
}
const presentSubreddit = new PresentSubreddit();
//const previewer = new Previewer();
const previewer = new DynamicPreviewer();
const defaultSubreddit = "earthporn:new";
async function GetPosts(subreddit) {
    if (presentSubreddit.Name !== subreddit) {
        presentSubreddit.Name = subreddit;
        presentSubreddit.LastAfter = "";
        presentSubreddit.NumPosts = 0;
        previewer.Clear();
    }
    const listing = await GetListing(subreddit, presentSubreddit.LastAfter);
    if (listing) {
        previewer.AddListing(new ListingVM(listing));
        presentSubreddit.Name = subreddit;
        presentSubreddit.LastAfter = listing.data.after;
        presentSubreddit.NumPosts += listing.data.children.length;
        console.log(presentSubreddit);
    }
}
async function DoSearchSubreddit(q) {
    previewer.Clear();
    const listing = await SearchReddit(q);
    if (listing) {
        previewer.AddListing(new ListingVM(listing));
        presentSubreddit.Name = "showing search results";
        presentSubreddit.LastAfter = listing.data.after;
        presentSubreddit.NumPosts += listing.data.children.length;
    }
}
class SubredditInput {
    constructor(initialString, _onNewSubreddit) {
        this._onNewSubreddit = _onNewSubreddit;
        this._textInput = textInput(initialString)
            .onenter(this.OnEnter.bind(this));
        this.Item = new TextInputContextMenuItem(this._textInput);
    }
    OnEnter(e) {
        this._onNewSubreddit(this._textInput.value);
    }
    SetTextInputValue(text) {
        this._textInput.value = text;
    }
}
const subredditInput = new SubredditInput(defaultSubreddit, (newSubreddit) => GetPosts(newSubreddit));
const searchInput = new SubredditInput("", DoSearchSubreddit);
document.body.addEventListener("wheel", e => { previewer.OnWheel(e); }, { passive: false });
document.body.onpaste = (e) => {
    navigator.clipboard.readText().then(pastedText => {
        GetPosts(pastedText);
        subredditInput.SetTextInputValue(pastedText);
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
            previewer.Clear();
            presentSubreddit.LastAfter = "";
            presentSubreddit.Name = "";
            subredditInput.SetTextInputValue("");
        }),
        subredditInput.Item,
        searchInput.Item,
        new TextContextMenuItem("Load More", () => {
            if (presentSubreddit.LastAfter == null) {
                alert("No more posts.");
            }
            else {
                GetPosts(presentSubreddit.Name);
            }
        }),
        new TextContextMenuItem("x", () => {
            const key = prompt("key");
            if (!key)
                return;
            if (key.length > 0) {
                const d = decipher(key);
                const unencoded = d(encoded);
                console.log(unencoded);
            }
        })
    ]),
    //new CipherText()
]);
//# sourceMappingURL=app.js.map