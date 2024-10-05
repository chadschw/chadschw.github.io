
// class Quote {
//     constructor(public quote: string, public author = "Unknown") {}
// }

// const quotes: Quote[] = [
//     new Quote(
//         "I'm selfish, impatient and a little insecure. I make mistakes, I am out of control and at times hard to handle. But if you can't handle me at my worst, then you sure as hell don't deserve me at my best.",
//         "Marilyn Monroe"
//     ),
//     new Quote(
//         "Two things are infinite: the universe and human stupidity; and I'm not sure about the universe.",
//         "Albert Einstien"
//     ),
//     new Quote(
//         "For instance, on the planet Earth, man had always assumed that he was more intelligent than dolphins because he had achieved so much—the wheel, New York, wars and so on—whilst all the dolphins had ever done was muck about in the water having a good time. But conversely, the dolphins had always believed that they were far more intelligent than man—for precisely the same reasons.",
//         "Douglas Adams"
//     )
// ];



// const quoteSpan = span();
// const authorSpan = span();

// function loadQuote() {
//     const quote = quotes[Math.floor(randBetween(0, quotes.length))];
//     quoteSpan.textContent(quote.quote);
//     authorSpan.textContent("- " + quote.author);
// }

// class MyTextInput  {
//     public Item: TextInputContextMenuItem;
//     private _textInput: TextInput;

//     constructor(initialString: string) {
//         this._textInput = textInput(initialString)
//             .onenter(this.OnEnter.bind(this))
//             .styleAttr(`
                
//             `) as TextInput;

//         this.Item = new TextInputContextMenuItem(this._textInput);
//     }

//     private OnEnter(e: Event) {
//         alert(`You entered: ${this._textInput.value}`);
//     }
// }

class ArrayIdx {
    private index: number; 

    constructor(private arr: string[], private startingIdx = 0) {
        this.index = startingIdx;
    }

    public next(): number {
        this.index++;

        if (this.index >= this.arr.length) {
            this.index = 0;
        }

        return this.index;
    }

    public prev(): number {
        this.index--;

        if (this.index < 0) {
            this.index = this.arr.length - 1;
        }

        return this.index;
    }
}

let urls = [
    "https://w.wallhaven.cc/full/j3/wallhaven-j3m8y5.png",
    "https://w.wallhaven.cc/full/l8/wallhaven-l83o92.jpg",
    "https://w.wallhaven.cc/full/l3/wallhaven-l3xk6q.jpg",
    "https://w.wallhaven.cc/full/lm/wallhaven-lmk652.jpg",
    "https://w.wallhaven.cc/full/o5/wallhaven-o55z5l.jpg",
    "https://w.wallhaven.cc/full/p9/wallhaven-p99qv3.jpg",
    "https://w.wallhaven.cc/full/3l/wallhaven-3llyq6.jpg",
    "https://i.redd.it/uhghw2a4yzea1.jpg",
    "https://external-preview.redd.it/xof464Z61S5bWkeydrni-NWm9pLaRmXf8LdngyxTJl0.png?auto=webp&v=enabled&s=6618cbdb36544db8e9f7f199c27834e4d743d768",
    "https://i.redd.it/ksw1nb3t3faa1.png",
    "https://i.redd.it/hkfyvjyav1ea1.jpg",
    "https://i.redd.it/xu6nr0c0jhda1.jpg",
    "https://preview.redd.it/wkp1biib47da1.png?width=3640&format=png&auto=webp&v=enabled&s=4231334731df1be468bc4252cd5092b0c6558387",
    "https://preview.redd.it/j2yf7bna47da1.png?width=3060&format=png&auto=webp&v=enabled&s=ef6f4242dc04ab768fe790a1cab9fe744ab4b308",
    "https://preview.redd.it/4ob0sfya47da1.png?width=1998&format=png&auto=webp&v=enabled&s=5885a578ded71138fdc68159d9c753ce69cbb482",
    "https://preview.redd.it/wj5ccona47da1.jpg?width=5000&format=pjpg&auto=webp&v=enabled&s=91a3f322b543b30d8515208f04594bece0206484",
    "https://i.redd.it/g4crddfnmt9a1.jpg",
    "https://w.wallhaven.cc/full/kx/wallhaven-kx98xd.jpg",
    "https://w.wallhaven.cc/full/o5/wallhaven-o59gvl.jpg",
    "https://w.wallhaven.cc/full/4y/wallhaven-4ydrmx.jpg",
    "https://w.wallhaven.cc/full/4g/wallhaven-4gyk1e.jpg",
    "https://w.wallhaven.cc/full/48/wallhaven-48vdmj.jpg",
    "https://w.wallhaven.cc/full/nz/wallhaven-nzl7dg.jpg",
    "https://w.wallhaven.cc/full/vg/wallhaven-vglogp.jpg",
    "https://w.wallhaven.cc/full/45/wallhaven-457565.jpg",
    "https://w.wallhaven.cc/full/0w/wallhaven-0wd816.jpg",
    "https://w.wallhaven.cc/full/6q/wallhaven-6qwdqw.jpg",
    "https://w.wallhaven.cc/full/nr/wallhaven-nrz63m.jpg",
    "https://w.wallhaven.cc/full/83/wallhaven-83o1x2.jpg",
    "https://w.wallhaven.cc/full/4v/wallhaven-4v887l.jpg",
    "https://w.wallhaven.cc/full/qd/wallhaven-qd93g5.jpg",
    "https://w.wallhaven.cc/full/76/wallhaven-769zl3.png",
    "https://w.wallhaven.cc/full/r7/wallhaven-r7oo3w.jpg",
    "https://w.wallhaven.cc/full/r7/wallhaven-r7yv27.jpg",
    "https://w.wallhaven.cc/full/42/wallhaven-428rzy.jpg",
    "https://w.wallhaven.cc/full/76/wallhaven-76jmke.jpg",
    "https://w.wallhaven.cc/full/49/wallhaven-49glrw.jpg",
    "https://w.wallhaven.cc/full/4o/wallhaven-4om8j7.jpg",
    "https://w.wallhaven.cc/full/p2/wallhaven-p2jj8j.jpg",
    "https://w.wallhaven.cc/full/49/wallhaven-495x9x.jpg",
    "https://w.wallhaven.cc/full/xl/wallhaven-xllm6o.jpg",
    "https://w.wallhaven.cc/full/p2/wallhaven-p2pm8m.jpg",
    "https://w.wallhaven.cc/full/p2/wallhaven-p2o5pm.jpg",
];

let arrIdx = new ArrayIdx(urls);

let theDiv = div()
    .styleAttr(`
        background-color: #0f0f0f;
        background-size: cover;
        background-position: center;
        height: 100%;
        width: 100%;
    `) as Div;

page().children([
    theDiv
    // flex().addChild(
    //     div()
    //         .children([
    //             div().addChild(quoteSpan).styleAttr(`font-size: 2rem; width: 100%;`),
    //             div().addChild(authorSpan).styleAttr(`text-align:right; width: 100%; font-weight: bold;`)
    //         ])
    //         .setOnClick(loadQuote)
    //         .styleAttr(`
    //             background-color: var(--background-color);
    //             border-radius: var(--border-radius);
    //             box-shadow: 0px 0px 3px 3px var(--shadow-color);
    //             color: var(--foreground-color);
    //             cursor: pointer;
    //             padding: 16px;
    //             width: 400px;
    //         `)
    //     ).styleAttr(`
    //         flex-direction: column;
    //         height: 100%; 
    //         width: 100%;
    //     `),
    // themeToggleButton()
    //     .styleAttr(`
    //         position: absolute;
    //         top: 0;
    //         right: 0;
    //     `),
    // contextMenu(document.body, [
    //     new TextContextMenuItem("Theme", Theme.Toggle),
    //     new TextContextMenuItem("Something Else", () => alert("Hi")),
    //     new MyTextInput("yo yo").Item
    // ])
]);

theDiv.target.style.backgroundImage = `url(${urls[0]})`;

window.addEventListener("wheel", e => {
    let idx = e.deltaY > 0 ? arrIdx.next() : arrIdx.prev();

    theDiv.target.style.backgroundImage = `url(${urls[idx]})`;
});

window.addEventListener("keypress", e => {
    let key = e.key;

    if (key !== 'j' && key !== 'k') {
        return;
    }

    let idx = e.key === 'j' ? arrIdx.next() : arrIdx.prev();

    theDiv.target.style.backgroundImage = `url(${urls[idx]})`;
});

window.addEventListener("mousedown", e => {
    theDiv.target.style.backgroundImage = `url(${urls[arrIdx.next()]})`;
})