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
                deciphered.value = d(encoded.value)
            }
        })

        this.children([
            key, input, encoded, button, deciphered
        ]);

        input.target.onchange = e => {
            const k = key.value;
            

            if (k.length > 0) {
                const c = cipher(k);
                encoded.value = c(input.value)
            }
        }

        this.target.onpaste = e => { e.stopPropagation() }
    }
}