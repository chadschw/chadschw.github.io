
class Quote {
    constructor(public quote: string, public author = "Unknown") {}
}

const quotes: Quote[] = [
    new Quote(
        "I'm selfish, impatient and a little insecure. I make mistakes, I am out of control and at times hard to handle. But if you can't handle me at my worst, then you sure as hell don't deserve me at my best.",
        "Marilyn Monroe"
    ),
    new Quote(
        "Two things are infinite: the universe and human stupidity; and I'm not sure about the universe.",
        "Albert Einstien"
    ),
    new Quote(
        "For instance, on the planet Earth, man had always assumed that he was more intelligent than dolphins because he had achieved so much—the wheel, New York, wars and so on—whilst all the dolphins had ever done was muck about in the water having a good time. But conversely, the dolphins had always believed that they were far more intelligent than man—for precisely the same reasons.",
        "Douglas Adams"
    )
];



const quoteSpan = span();
const authorSpan = span();

function loadQuote() {
    const quote = quotes[Math.floor(randBetween(0, quotes.length))];
    quoteSpan.textContent(quote.quote);
    authorSpan.textContent("- " + quote.author);
}

class MyTextInput  {
    public Item: TextInputContextMenuItem;
    private _textInput: TextInput;

    constructor(initialString: string) {
        this._textInput = textInput(initialString)
            .onenter(this.OnEnter.bind(this))
            .styleAttr(`
                
            `) as TextInput;

        this.Item = new TextInputContextMenuItem(this._textInput);
    }

    private OnEnter(e: Event) {
        alert(`You entered: ${this._textInput.value}`);
    }
}

page().children([
    flex().addChild(
        div()
            .children([
                div().addChild(quoteSpan).styleAttr(`font-size: 2rem; width: 100%;`),
                div().addChild(authorSpan).styleAttr(`text-align:right; width: 100%; font-weight: bold;`)
            ])
            .setOnClick(loadQuote)
            .styleAttr(`
                background-color: var(--background-color);
                border-radius: var(--border-radius);
                box-shadow: 0px 0px 3px 3px var(--shadow-color);
                color: var(--foreground-color);
                cursor: pointer;
                padding: 16px;
                width: 400px;
            `)
        ).styleAttr(`
            flex-direction: column;
            height: 100%; 
            width: 100%;
        `),
    themeToggleButton()
        .styleAttr(`
            position: absolute;
            top: 0;
            right: 0;
        `),
    contextMenu(document.body, [
        new TextContextMenuItem("Theme", Theme.Toggle),
        new TextContextMenuItem("Something Else", () => alert("Hi")),
        new MyTextInput("yo yo").Item
    ])
]);

loadQuote();