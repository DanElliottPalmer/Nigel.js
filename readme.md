#Nigel.js

###A small library for loading and parsing data in Javascript
####CSV, TSV, JSON & XML

===

###Installation
- Download Nigel.js/Nigel.min.js and store on your server
- Include in your page:

	`<script type="text/javascript" src="Nigel.min.js"></script>`

###Functions

- `Nigel.load( strURL, fnCallback, [optional] objOptions )`

	Loads the source file and fires the callback when load and parse are complete. The callback returns the parsed `data`.
- `Nigel.parse( strRawData, strType, [optional] objOptions)`

	Parses the given data and returns it as whatever format specified.
	
###Types
The types consist of:

- `CSV`

	The returned object can be of two states: array of arrays or an array of objects. If `firstRowHeaders` is set to `true`, then array of objects will be returned with the keys being the column headers and cell as the value.

- `TSV`

	Same as `CSV`

- `JSON`

	JSON object. However it is formatted when loaded.

- `XML`
	
	The `XML` is returned as an object with 4 keys: `attributes` (Object), `children` (Array), `nodeName` (String/Number) and `nodeValue` (String/Number).

###Options
- `raw` - Boolean - Used in `Nigel.load()`. If set to `true`, it will return the raw data, not parsed. Defaults to `false`.
- `firstRowHeaders` - Boolean - Used in `Nigel.load()` and `Nigel.parse()`. If the file being loaded is a TSV or CSV and is set to `true`, the first row will be treated as column headers returning an array of objects, rather than array of arrays. Defaults to `true`.
- `injectToPage` - Boolean - Used if you want to load the JSON into the page as an alternative way of loading. Sometimes you might need to do this. Defaults to `false`.
- `fusionTable` - Boolean - Stating whether the URL provided is a fusion table address. Defaults to `false`.

###FAQ

**1. Why is it called Nigel?**

There is absolutely no reason at all for it being called Nigel. I just felt like giving it a name.
	
**2. Which browsers does it work on?**

At this very moment in time, I haven't tested it fully but I know the majority of it works on Chrome. My plan is to make sure it works on IE7+, Firefox 3.5+, Safari, Chrome, Opera. I'll update this as soon as I know.

###Future plans

- Allow multiple file URLs to be specified and loaded.