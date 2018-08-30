import TTFFont from './ttffont';

const putFont = ({ font,newObject,out }) => {
    if (font.id.slice(1) < 15) return;

    const dictionary = font.metadata.embedTTF(font.encoding, newObject, out);
    if (dictionary) {
        font.objectNumber = dictionary;
        font.isAlreadyPutted = true;
    }
}

const postProcessText = (args) => {
    const {text, mutex :{activeFontKey, fonts}} = args;
    const isHex = activeFontKey.slice(1) >= 15;
    const activeFont = fonts[activeFontKey];
    const {encode, subset} = activeFont.metadata;

    args.text = isHex ? text.map(str => Array.isArray(str) ? [encode(subset, str[0]), str[1], str[2]] : encode(subset, str)) : text;
    args.mutex.isHex = isHex;
}


(function (jsPDF, global) {
    "use strict";

jsPDF.API.TTFFont = TTFFont;

jsPDF.API.events.push(['addFont', function(font){
    const {id, fontName, postScriptName} = font;
    if (jsPDF.API.existsFileInVFS(postScriptName)) {
        font.metadata = jsPDF.API.TTFFont.open(postScriptName, fontName, jsPDF.API.getFileFromVFS(postScriptName));
        const {hmtx : {widths}, capHeight} = font.metadata;
        font.encoding = (widths.length < 500 && capHeight < 800) ? "WinAnsiEncoding" : "MacRomanEncoding";
    } else if (id.slice(1) >= 15) {
        console.error(`Font does not exist in FileInVFS, import fonts or remove declaration doc.addFont('${postScriptName}').`);
    }
}]);
  
  jsPDF.API.events.push(['putFont', putFont]);

jsPDF.API.events.push(['postProcessText', postProcessText]);


})(jsPDF, typeof self !== "undefined" && self || typeof global !== "undefined" && global || typeof window !== "undefined" && window || (Function ("return this"))());