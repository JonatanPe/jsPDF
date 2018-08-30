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
