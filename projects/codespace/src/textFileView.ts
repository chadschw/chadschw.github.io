
class TextFileView {
    public get Text(): SvgText { return this._text; }
    private _text: SvgText = new SvgText();

    constructor(pos: Point, textFile: TextFile) {
        let x = pos.x;
        let y = pos.y;
        let yStep = 14;
        
        const nameView = new SvgTSpan(textFile.Name)
            .pos(x, y)
            .addClass("cs-text-file-view-name") as SvgTSpan;

        y += yStep * 2;

        const lineViews = textFile.Lines.map(
            (line, i) => new SvgTSpan(line)
                .pos(x, y + (i * yStep))
                .addClass("cs-text-file-view-line") as SvgTSpan) ;

        this._text.children([nameView].concat(lineViews));
    }
}