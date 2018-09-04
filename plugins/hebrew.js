(function (jsPDFAPI) {
    "use strict";

    var heLangCodes = {
        "he": "Hebrew",
    };
  
    var heLangCodesKeys = Object.keys(heLangCodes);
  
	var commonSubstition = function (character) {
		var replacementTable = {
			'(': ')',
			')': '('
		}
		return replacementTable[character] || character;
	}
    
    function isHebrewLetter(letter) {
      
    }

    var processHebrew = jsPDFAPI.processHebrew = function (text, reverse) {
      		var replacementTable = {
			'(': ')',
			')': '('
		}
            
        var result = "";    

        for (var i = 0; i < text.length; i += 1) {
            var currentLetter = text[i];
            result += replacementTable[currentLetter] ? replacementTable[currentLetter] : currentLetter;
        }
      
        var words = text.split(" ");
      
        result = "";
        var currentstr = ""
        for (var i = 0; i < words.length; i += 1) {
            var currentWord = words[i];
            if (currentWord.match(/[a-zA-Z]/)) {
                if (currentstr.length > 1) {
                  result = result + " " + currentstr.split("").reverse().join("");
                  currentstr = "";
                }
              result = result + " " + currentWord;
            } else {
              currentstr = currentstr + " " + currentWord;
            }
        }
      
        if (currentstr.length > 1) {
          result = result + " " + currentstr.split("").reverse().join("");
        }
      
        return result;
    }

    var hebrewParserFunction = function (args) {
        var text = args.text;
        var options = args.options || {};
        var lang = options.lang;
        var tmpText = [];

        if (heLangCodesKeys.indexOf(lang) >= 0) {
            if (Object.prototype.toString.call(text) === '[object Array]') {
                var i = 0;
                tmpText = [];
                for (i = 0; i < text.length; i += 1) {
                    if (Object.prototype.toString.call(text[i]) === '[object Array]') {
                        tmpText.push([processHebrew(text[i][0], true), text[i][1], text[i][2]]);
                    } else {
                        tmpText.push([processHebrew(text[i], true)]);
                    }
                }
                args.text = tmpText;
            } else {
                args.text = processHebrew(text, true);
            }
        }
    };

    jsPDFAPI.events.push([ 
    	'preProcessText'
    	,hebrewParserFunction
    ]);
    
})(jsPDF.API);
