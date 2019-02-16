(function (jsPDFAPI) {
    "use strict";

    var heLangCodes = {
        "he": "Hebrew",
    };
  
    var heLangCodesKeys = Object.keys(heLangCodes);

    jsPDFAPI.processHebrew = function (text, reverse) {
      if(!reverse) return text;
      
      const replacementTable = {
        '(': ')',
        ')': '(',
      };

      const getHebrewWord = function getHebrewWord(text) {
        let resultWord = '';
        for (let i = 0; i < text.trim().length; i += 1) {
          const currentLetter = text[i];
          resultWord += replacementTable[currentLetter] ? replacementTable[currentLetter] : currentLetter;
        }
        return resultWord.split('').reverse().join('');
      };

      const isHebrewWord = function isHebrewWord(word) {
        for (let i = 0; i < word.length; i += 1) {
          if (word.charCodeAt(i) >= 0x590 && word.charCodeAt(i) <= 0x5FF) {
            return true;
          }
        }

        return false;
      };

      const words = text.trim().split(' ');

      const result = [];
      let hebrewPart = [];
      for (let i = 0; i < words.length; i += 1) {
        const currentWord = words[i];
        if (isHebrewWord(currentWord)) {
          hebrewPart.push(getHebrewWord(currentWord));
        } else {
          result.push(hebrewPart.reverse().join(' '));
          hebrewPart = [];
          result.push(currentWord);
        }
      }

      if (hebrewPart.length > 0) {
        result.push(hebrewPart.reverse().join(' '));
      }

      return result.join(' ');
    };

    var hebrewParserFunction = function (args) {
        var text = args.text;
        var options = args.options || {};
        var lang = options.lang;
        var reverse = options.reverse === undefined ? true : options.reverse;
        var tmpText = [];

        if (heLangCodesKeys.indexOf(lang) >= 0) {
            if (Object.prototype.toString.call(text) === '[object Array]') {
                var i = 0;
                tmpText = [];
                for (i = 0; i < text.length; i += 1) {
                    if (Object.prototype.toString.call(text[i]) === '[object Array]') {
                        tmpText.push([jsPDFAPI.processHebrew(text[i][0], reverse), text[i][1], text[i][2]]);
                    } else {
                        tmpText.push([jsPDFAPI.processHebrew(text[i], reverse)]);
                    }
                }
                args.text = tmpText;
            } else {
                args.text = jsPDFAPI.processHebrew(text, reverse);
            }
        }
    };

    jsPDFAPI.events.push([ 
    	'preProcessText'
    	,hebrewParserFunction
    ]);
    
})(jsPDF.API);
