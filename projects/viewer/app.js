
import { Div, page } from "../../lib/ele/ele.js";
import { SubReddit } from "./reddit/subreddit.js";

$(document).ready(() => new App());

class App {
    constructor() {
        page().children([
            new SubReddit("wallpaper"), 
            new SubReddit("pics"), 
            new SubReddit("earthporn")])
    }
}

// TODO: finish this and use it.
class ScrollBarThumb extends Div {
    constructor() {
        this.super();
        this.styleAttr(`
            position: absolute;
            left: 0px;
            height: 16px;
            min-width: 10px;
        `);
    }
}

// TODO: finish this and use it. click, hold move left starts advancing like middle mouse button.
class ScrubControl extends Div {
    constructor() {
        super();
    }
}
