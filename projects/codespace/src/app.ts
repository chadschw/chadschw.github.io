/// <reference path="codespace.ts"/>

window.onload = e => {
    const codeSpace = new CodeSpace();
    page().children([codeSpace.Svg]);
}
