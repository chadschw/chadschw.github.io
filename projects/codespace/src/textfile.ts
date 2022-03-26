
class TextFile {
    public get Name(): string { return this._name; }
    private _name: string;
    
    public get Lines(): string[] { return this._lines; }
    private _lines: string[];

    public static Read(f: File, onComplete: any): void {
        const reader = new FileReader();
        reader.onload = re => {
            if (!re.target) return onComplete(null);
            const lines = (re.target.result as string).split(/\r\n|\r|\n/);
            onComplete(new TextFile(f.name, lines));
        }
        reader.readAsText(f);
    }

    constructor(name: string, lines: string[]) {
        this._name = name;
        this._lines = lines;
    }
}