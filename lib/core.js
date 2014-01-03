/**
 * Nigel - Core
 */ 
(function() {

	function Nigel() {
		var httpRequest = (window.XMLHttpRequest || ActiveXObject('Msxml2.XMLHTTP') || ActiveXObject('Microsoft.XMLHTTP')),
			isIE = ((navigator.userAgent.indexOf("MSIE") !== -1) ? true : false),
			isOldFF = /firefox\/3.6/.test(navigator.userAgent.toLowerCase());

		function parseEventRequest(callback, errcallback) {
			if (this.readyState == 4 && this.status == 200) {
				callback(this.responseText);
			} else if (this.readyState == 4 && this.status != 200) {
				errcallback.call(this);
			}
		}

		this._load = function(url, options, callback) {

			if (!url) {
				throw new Error("No url has been set");
			}

			options = this._merge({
				"async": true,
				"injectToPage": false,
				"onError": function() {}
			}, (options || {}));

			callback = callback || function() {};



			if (!options.injectToPage) {

				//Start
				var req = new httpRequest();

				if (isOldFF) {
					req.onload = req.onabort = function() {
						parseEventRequest.call(this, callback, options.onError);
					};
				} else {
					req.onreadystatechange = function() {
						parseEventRequest.call(this, callback, options.onError);
					};
				}
				req.onerror = options.onError;

				req.open("GET", url, options.async);
				req.send(null);

			} else {

				//This is used for JSONP
				//Set up the callback
				var cbName = "cb" + Math.round( (new Date()).getTime() * Math.random() );
				window.Nigel[cbName] = function(response) {
					delete window.Nigel[cbName];
					callback(response);
				};

				//Create the script
				//Remove any callback
				url = url.replace(/&callback(=[^&]*)?|callback(=[^&]*)?&?/gi, "");
				//Add our own
				if (url.indexOf("?") === -1) {
					url += "?";
				} else {
					url += "&";
				}
				url += "callback=Nigel." + cbName;
				//Add script to page
				var tmpScript = document.createElement("script");
				tmpScript.type = "text/javascript";
				tmpScript.src = url;
				var scr = document.getElementsByTagName("script")[0];
				scr.parentNode.insertBefore(tmpScript, scr);

			}

		};
		this._merge = function(obj1, obj2) {
			var out = {},
				key = "";
			for (key in obj1) {
				out[key] = obj1[key];
			}
			for (key in obj2) {
				out[key] = obj2[key];
			}
			return out;
		};
	}

	this.Nigel = new Nigel();

}).call(this);