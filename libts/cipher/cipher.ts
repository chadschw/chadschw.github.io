function cipher(salt: string) {
    const textToChars = (text: any) => text.split('').map((c: any) => c.charCodeAt(0));
    const byteHex = (n: any) => ("0" + Number(n).toString(16)).substr(-2);
    const applySaltToChar = (code: any) => textToChars(salt).reduce((a: any,b: any) => a ^ b, code);

    return (text: any) => text.split('')
      .map(textToChars)
      .map(applySaltToChar)
      .map(byteHex)
      .join('');
}
    
function decipher(salt: string) {
    const textToChars = (text: any) => text.split('').map((c: any) => c.charCodeAt(0));
    const applySaltToChar = (code: any) => textToChars(salt).reduce((a: any,b: any) => a ^ b, code);
    return (encoded: any) => encoded.match(/.{1,2}/g)
      .map((hex: any) => parseInt(hex, 16))
      .map(applySaltToChar)
      .map((charCode: any) => String.fromCharCode(charCode))
      .join('');
}

// // To create a cipher
// const myCipher = cipher('mySecretSalt')

// //Then cipher any text:
// console.log(myCipher('the secret string'))

// //To decipher, you need to create a decipher and use it:
// const myDecipher = decipher('mySecretSalt')
// console.log(myDecipher("7c606d287b6d6b7a6d7c287b7c7a61666f"))