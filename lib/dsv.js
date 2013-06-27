/**
 * Nigel - Delimiter-seperated files
 */ (function() {

	/*
	 * Taken and adapted from
	 * http://www.bennadel.com/blog/1504-Ask-Ben-Parsing-CSV-Strings-With-Javascript-Exec-Regular-Expression-Command.htm
	 */

	function parseSV(strData, objOptions) {

		var objPattern = new RegExp(
		(
		// Delimiters.
		"(\\" + objOptions.delimeter + "|\\r?\\n|\\r|^)" +
		// Quoted fields.
		"(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
		// Standard fields.
		"([^\"\\" + objOptions.delimeter + "\\r\\n]*))"),
			"gi");


		var arrData = [];
		if (!objOptions.firstRowHeaders) {
			arrData.push([]);
		}

		var arrMatches = null;

		//Header stuff
		var headers = [],
			firstRow = true,
			colCount = 0;

		while (arrMatches = objPattern.exec(strData)) {

			var strMatchedDelimiter = arrMatches[1],
				strMatchedValue;

			if (strMatchedDelimiter.length && (strMatchedDelimiter != objOptions.delimeter)) {

				if (objOptions.firstRowHeaders) {
					arrData.push({});
					colCount = 0;

					if (firstRow) {
						firstRow = false;
					}
				} else {
					arrData.push([]);
				}

			}

			if (arrMatches[2]) {
				strMatchedValue = arrMatches[2].replace(
					new RegExp("\"\"", "g"),
					"\"");
			} else {
				strMatchedValue = arrMatches[3];
			}

			//Number parsing
			if (objOptions.parseNumbers && !isNaN(strMatchedValue)) {
				strMatchedValue = +strMatchedValue;
			}

			//Header key collecting
			if (objOptions.firstRowHeaders && firstRow) {
				headers.push(strMatchedValue);
				continue;
			}

			if (objOptions.firstRowHeaders) {
				arrData[arrData.length - 1][headers[colCount]] = strMatchedValue;
				colCount++;
			} else {
				arrData[arrData.length - 1].push(strMatchedValue);
			}

		}

		return arrData;
	}


	Nigel.DSV = function(url, callback, options) {

		options = this._merge({
			"delimeter": ",",
			"firstRowHeaders": true,
			"parseNumbers": true,
			"raw": false
		}, (options || {}));

		this._load(url, options, function(response) {

			if (options.raw) {
				callback(response);
				return;
			}

			callback(parseSV(response, options));

		});

	};

}).call(this);