(function(window,document,undefined){
	
	function Nigel(){

		/**
		 * Douglas Crockford's json_parse
		 * @url  https://github.com/douglascrockford/JSON-js
		 */
		var json_parse=(function(){var d,b,a={'"':'"',"\\":"\\","/":"/",b:"\b",f:"\f",n:"\n",r:"\r",t:"\t"},m,k=function(n){throw {name:"SyntaxError",message:n,at:d,text:m}},g=function(n){if(n&&n!==b){k("Expected '"+n+"' instead of '"+b+"'")}b=m.charAt(d);d+=1;return b},f=function(){var o,n="";if(b==="-"){n="-";g("-")}while(b>="0"&&b<="9"){n+=b;g()}if(b==="."){n+=".";while(g()&&b>="0"&&b<="9"){n+=b}}if(b==="e"||b==="E"){n+=b;g();if(b==="-"||b==="+"){n+=b;g()}while(b>="0"&&b<="9"){n+=b;g()}}o=+n;if(!isFinite(o)){k("Bad number")}else{return o}},h=function(){var q,p,o="",n;if(b==='"'){while(g()){if(b==='"'){g();return o}if(b==="\\"){g();if(b==="u"){n=0;for(p=0;p<4;p+=1){q=parseInt(g(),16);if(!isFinite(q)){break}n=n*16+q}o+=String.fromCharCode(n)}else{if(typeof a[b]==="string"){o+=a[b]}else{break}}}else{o+=b}}}k("Bad string")},j=function(){while(b&&b<=" "){g()}},c=function(){switch(b){case"t":g("t");g("r");g("u");g("e");return true;case"f":g("f");g("a");g("l");g("s");g("e");return false;case"n":g("n");g("u");g("l");g("l");return null}k("Unexpected '"+b+"'")},l,i=function(){var n=[];if(b==="["){g("[");j();if(b==="]"){g("]");return n}while(b){n.push(l());j();if(b==="]"){g("]");return n}g(",");j()}}k("Bad array")},e=function(){var o,n={};if(b==="{"){g("{");j();if(b==="}"){g("}");return n}while(b){o=h();j();g(":");if(Object.hasOwnProperty.call(n,o)){k('Duplicate key "'+o+'"')}n[o]=l();j();if(b==="}"){g("}");return n}g(",");j()}}k("Bad object")};l=function(){j();switch(b){case"{":return e();case"[":return i();case'"':return h();case"-":return f();default:return b>="0"&&b<="9"?f():c()}};return function(q,o){var n;m=q;d=0;b=" ";n=l();j();if(b){k("Syntax error")}return typeof o==="function"?(function p(u,t){var s,r,w=u[t];if(w&&typeof w==="object"){for(s in w){if(Object.prototype.hasOwnProperty.call(w,s)){r=p(w,s);if(r!==undefined){w[s]=r}else{delete w[s]}}}}return o.call(u,t,w)}({"":n},"")):n}}());

		var 
		_PARSERS = {
			"CSV": function(d,objOptions){
				objOptions = objOptions || {};
				objOptions.delimeter = ",";
				return _parseSV(d, objOptions);
			},
			"JSON": function(d){
				if("JSON" in window){
					return JSON.parse( d );
				}
				return json_parse( d );
			},
			"TSV": function(d,objOptions){
				objOptions = objOptions || {};
				objOptions.delimeter = "\t";
				return _parseSV(d, objOptions);
			},
			"XML": function(d){
				var 
				xmlReader = null,
				nodes = {};
				if( typeof window.DOMParser != "undefined" ){
					xmlReader = (new DOMParser()).parseFromString( d, 'text/xml' );
				} else {
					xmlReader = new window.ActiveXObject('Microsoft.XMLDOM');
					xmlReader.async = "false";
					xmlReader.loadXML(d);
				}
				function _recursiveLoop(n){
					var
					returnObj = {
						'attributes': [],
						'children': [],
						'nodeName': "",
						'nodeValue': ""
					},
					a = 0,
					l = 0;
					//Attributes
					if( n.attributes.length!=0 ){
						for(a=0,l=n.attributes.length;a<l;a++){
							returnObj['attributes'].push( [ n.attributes[a].nodeName, n.attributes[a].nodeValue ] );
						}
					}
					//Children
					for(a=0,l=n.childNodes.length; a<l; a++){
						if( n.childNodes[a].nodeType!=3 ){
							returnObj['children'].push( _recursiveLoop( n.childNodes[a] ) );
						}
					}
					//Name
					returnObj['nodeName'] = n.nodeName;
					//Value
					if(n.childNodes.length==1 && n.childNodes[0].nodeType==3){
						returnObj['nodeValue'] = n.childNodes[0].nodeValue;
					}
					return returnObj;
				}
				nodes = _recursiveLoop( xmlReader.documentElement );
				return nodes;
			}
		},
		_MIMETYPES = {
			"CSV": "text/csv",
			"JSON": "application/json",
			"TSV": "text/tab-separated-values",
			"XML": "text/xml"
		},
		httpRequest = ( window.XMLHttpRequest || ActiveXObject('Msxml2.XMLHTTP') || ActiveXObject('Microsoft.XMLHTTP') ),
		isIE = ((navigator.userAgent.indexOf("MSIE")!==-1)?true:false);

		/**
		 * Checks whether the url is fusion table nature
		 * @param  {String}  strURL     The URL of source file
		 * @param  {Object}  objOptions Options passed through
		 * @return {Boolean}            True or false baby
		 */
		function _isFusionTable(strURL, objOptions){
			if(objOptions.fusionTable || strURL.indexOf('/fusiontables/')!=-1){
				return true
			}
			return false;
		}

		/**
		 * Load the file
		 * @param  {String} strURL     Source file location
		 * @param  {String} fnCallback Callback function for when finished loading
		 * @param  {Object} objOptions Options
		 */
		function _load(strURL, fnCallback, objOptions){
			if(	strURL==="" ||
				fnCallback===undefined ||
				typeof fnCallback!=="function"){
				alert('No URL or callback');
				return;
			}

			objOptions = objOptions || {};

			var
			req    = new httpRequest(),
			result = null;

			objOptions.type         = objOptions.type || _predictType(strURL).type;
			objOptions.raw          = objOptions.raw || false;
			objOptions.injectToPage = objOptions.injectToPage || false;

			//Check if we're dealing with a fusion table
			if(objOptions.fusionTable = _isFusionTable(strURL, objOptions)){
				//Remove any callback and make sure it's set to JSON
				strURL = strURL	.replace(/(([&|\?]n?)alt=csv(&?))/gi, "$2alt=json$3")
								.replace(/&callback(=[^&]*)?|callback(=[^&]*)?&?/gi, "");
				//Make sure the type is JSON
				objOptions.type = "JSON";
			}

			//Some times, injecting the file into the page is best. Only works with JSON
			if(objOptions.injectToPage){

				//Set the callback
				this.loadCallback = fnCallback;

				//Add the callback to the URL
				strURL += "&callback=Nigel.loadCallback";

				var 
				tScript = document.createElement('script'),
				scr     = document.getElementsByTagName('script')[0];
				tScript.type = "text/javascript";
				tScript.src = strURL;

				scr.parentNode.insertBefore(tScript,scr);

			} else {

				req.onreadystatechange = function(){
					if(req.readyState==4 && req.status==200) {
						if(objOptions.raw){
							fnCallback( req.responseText );
						} else {
							//Parse
							result = _parse( req.responseText, objOptions.type, objOptions );
							//Callback
							fnCallback(result);
						}
					} else if(req.readyState==4 && req.status!=200){
						fnCallback( {"error": {'text':'Request error','code':req.status}} );
					}
				}
				req.onerror = function(){
					req.abort();
					fnCallback( {"error": {'text':'Request error','code':req.status}} );
				}
				req.open("GET", strURL, false);
				if(req.overrideMimeType){
					req.overrideMimeType( objOptions.type );
				}
				req.send(null);

			}
		}

		/**
		 * Public Parse function
		 * @param  {*} rawData    The raw data
		 * @param  {String} strType    The data type so we know how to parse
		 * @param  {Object} objOptions Settings
		 * @return {Array/Object/String}            The parsed data
		 */
		function _parse(rawData, strType, objOptions){
			return _PARSERS[ strType ]( rawData , objOptions);
		}

		/**
		 * [_parseSV description]
		 * @param  {String} strData    The data as a string
		 * @param  {Object} objOptions Settings
		 * @return {Array}            Parsed data
		 * @note I'm ok at Regex but DAMN I would not have been
		 *       able to work out the different combinations. Tweaked
		 *       a little to allow working out of column headers.
		 * @link http://stackoverflow.com/questions/7878762/parse-csv-string-w-variable-enclosure-character-in-javascript
		 */
		function _parseSV(strData, objOptions){
			if(typeof objOptions.firstRowHeaders!="boolean"){
				objOptions.firstRowHeaders = true;
			}
			
			var 
			svPattern  = new RegExp(
				"(?:(" + objOptions.delimeter + ")|[\\n\\r]|^)" +
		        "(?:([\"'])((?:[^\"']+|(?!\\2).|\\2\\2)*)\\2" + 
		        "|([^\"'" + objOptions.delimeter + "\\n\\r]*))",
			"gi"),
			outputArr     = [],
			tmpMatches    = null,
			tmpStrValue   = "",
			tmpColHeaders = [],
			tmpColCount	  = 0,
			tmpRowCount   = 0,
			quoted        = null;

			while( tmpMatches = svPattern.exec( strData ) ){

				if( !tmpMatches[1]){

					tmpColCount = 0;
					tmpRowCount++;

					if( tmpRowCount>1 && objOptions.firstRowHeaders || !objOptions.firstRowHeaders ){
						if(objOptions.firstRowHeaders){
							outputArr.push({});
						} else {
							outputArr.push([]);
						}
					}
					
				}

				quoted = tmpMatches[2];
				if( quoted ){
					tmpStrValue = tmpMatches[3].replace( new RegExp( quoted+quoted, "g" ) ,quoted);
				} else {
					tmpStrValue = tmpMatches[4];
				}

				if( tmpRowCount==1 && objOptions.firstRowHeaders ){
					tmpColHeaders.push( tmpStrValue );
				} else {

					if(objOptions.firstRowHeaders){
						outputArr[ outputArr.length-1 ][ tmpColHeaders[ tmpColCount ] ] = tmpStrValue;
						tmpColCount++;
					} else {
						outputArr[ outputArr.length-1 ].push(tmpStrValue);
					}

				}

			}

			return outputArr;
		}

		/**
		 * Predicts the file type from URL
		 * @param  {String} strURL The URL
		 * @return {Object}        Consists of the extension and predicted type
		 */
		function _predictType(strURL){
			var
			ext = strURL.split('.').pop().toLowerCase(),
			ty  = "";
			switch(ext) {
				case 'json': case 'js':
					ty = "JSON";
					break;
				case 'xml':
					ty = "XML";
					break;
				case 'csv':
					ty = "CSV";
					break;
				case 'tsv':
					ty = "TSV";
					break;
			}
			return {
				'ext': ext,
				'type': ty
			};
		}

		return {
			load: _load,
			loadCallback: function(){},
			parse: _parse
		};

	}

	window['Nigel'] = Nigel();

})(this,this.document);