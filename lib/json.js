/**
 * Nigel - JSON
 */
(function(){

	/**
	 * Douglas Crockford's json_parse
	 * @url  https://github.com/douglascrockford/JSON-js
	 */
	var json_parse=(function(){var d,b,a={'"':'"',"\\":"\\","/":"/",b:"\b",f:"\f",n:"\n",r:"\r",t:"\t"},m,k=function(n){throw {name:"SyntaxError",message:n,at:d,text:m}},g=function(n){if(n&&n!==b){k("Expected '"+n+"' instead of '"+b+"'")}b=m.charAt(d);d+=1;return b},f=function(){var o,n="";if(b==="-"){n="-";g("-")}while(b>="0"&&b<="9"){n+=b;g()}if(b==="."){n+=".";while(g()&&b>="0"&&b<="9"){n+=b}}if(b==="e"||b==="E"){n+=b;g();if(b==="-"||b==="+"){n+=b;g()}while(b>="0"&&b<="9"){n+=b;g()}}o=+n;if(!isFinite(o)){k("Bad number")}else{return o}},h=function(){var q,p,o="",n;if(b==='"'){while(g()){if(b==='"'){g();return o}if(b==="\\"){g();if(b==="u"){n=0;for(p=0;p<4;p+=1){q=parseInt(g(),16);if(!isFinite(q)){break}n=n*16+q}o+=String.fromCharCode(n)}else{if(typeof a[b]==="string"){o+=a[b]}else{break}}}else{o+=b}}}k("Bad string")},j=function(){while(b&&b<=" "){g()}},c=function(){switch(b){case"t":g("t");g("r");g("u");g("e");return true;case"f":g("f");g("a");g("l");g("s");g("e");return false;case"n":g("n");g("u");g("l");g("l");return null}k("Unexpected '"+b+"'")},l,i=function(){var n=[];if(b==="["){g("[");j();if(b==="]"){g("]");return n}while(b){n.push(l());j();if(b==="]"){g("]");return n}g(",");j()}}k("Bad array")},e=function(){var o,n={};if(b==="{"){g("{");j();if(b==="}"){g("}");return n}while(b){o=h();j();g(":");if(Object.hasOwnProperty.call(n,o)){k('Duplicate key "'+o+'"')}n[o]=l();j();if(b==="}"){g("}");return n}g(",");j()}}k("Bad object")};l=function(){j();switch(b){case"{":return e();case"[":return i();case'"':return h();case"-":return f();default:return b>="0"&&b<="9"?f():c()}};return function(q,o){var n;m=q;d=0;b=" ";n=l();j();if(b){k("Syntax error")}return typeof o==="function"?(function p(u,t){var s,r,w=u[t];if(w&&typeof w==="object"){for(s in w){if(Object.prototype.hasOwnProperty.call(w,s)){r=p(w,s);if(r!==undefined){w[s]=r}else{delete w[s]}}}}return o.call(u,t,w)}({"":n},"")):n}}());


	Nigel.JSON = function(url, callback, options){

		options = this._merge({
			"injectToPage": false,
			"raw": false
		}, (options || {}) );

		this._load(url, options, function(response){

			if(options.injectToPage){
				callback(response);
				return;
			}

			if(options.raw){
				callback(response);
				return;
			}

			if("JSON" in window && JSON.parse){
				callback( JSON.parse(response) );
				return;
			}

			callback( json_parse(response) );
			return;

		});

	};

}).call(this);