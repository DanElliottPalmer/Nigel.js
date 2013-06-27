/**
 * Nigel - XML
 */ (function() {

	function recursiveLoop(n) {
		var returnObj = {
			'attributes': [],
			'children': [],
			'nodeName': "",
			'nodeValue': ""
		},
			a = 0,
			l = 0;

		//Attributes
		if (n.attributes.length != 0) {
			for (a = 0, l = n.attributes.length; a < l; a++) {
				returnObj['attributes'].push([n.attributes[a].nodeName, n.attributes[a].nodeValue]);
			}
		}
		//Children
		for (a = 0, l = n.childNodes.length; a < l; a++) {
			if (n.childNodes[a].nodeType != 3) {
				returnObj['children'].push(recursiveLoop(n.childNodes[a]));
			}
		}
		//Name
		returnObj['nodeName'] = n.nodeName;
		//Value
		if (n.childNodes.length == 1 && n.childNodes[0].nodeType == 3) {
			returnObj['nodeValue'] = n.childNodes[0].nodeValue;
		}
		return returnObj;
	}

	Nigel.XML = function(url, callback, options) {

		options = this._merge({
			"raw": false
		}, (options || {}));

		this._load(url, options, function(response) {

			if (options.raw) {
				callback(response);
				return;
			}

			var xmlReader = null,
				nodes = {};

			if (typeof window.DOMParser != "undefined") {
				xmlReader = (new DOMParser()).parseFromString(response, 'text/xml');
			} else {
				xmlReader = new window.ActiveXObject('Microsoft.XMLDOM');
				xmlReader.async = "false";
				xmlReader.loadXML(response);
			}

			nodes = recursiveLoop(xmlReader.documentElement);

			callback(nodes);
		});

	};

}).call(this);