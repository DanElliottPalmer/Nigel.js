#Nigel.js

###A small library for loading and parsing data in Javascript
####DSV (TSV, CSV), JSON & XML

===

###Installation
I have seperated DSV, JSON and XML into their own files so you can only load the bits you need.

1. Always include a core. This can be the production or minified version.
2. Include the script related to the data you're trying to load. E.g. If you're going to be loading JSON, include json.js/json.min.js.

Or

1. Include all.min.js for access to all the loaders.

###Functions
`Nigel.JSON()`, `Nigel.XML()` and `Nigel.DSV()` all take three arguments:

- URL - String - The URL of the file you're trying to load.
- Complete callback - Function - The callback fired when finished loading your data. This returns the data.
- Options - Object - The settings that can be changed. These depend on which function you're using. Check below for more information on it.

	
###Types
The types consist of:

- `DSV`

	The returned object can be of two states: array of arrays or an array of objects. If `firstRowHeaders` is set to `true`, then array of objects will be returned with the keys being the column headers and cell as the value.

- `JSON`

	JSON object. However it is formatted when loaded.

- `XML`
	
	The `XML` is returned as an object with 4 keys: `attributes` (Object), `children` (Array), `nodeName` (String/Number) and `nodeValue` (String/Number).

###Options
- `raw` - Boolean - If set to `true`, it will return the raw data, not parsed. Defaults to `false`.
- `firstRowHeaders` - Boolean - If the file being loaded is a DSV and is set to `true`, the first row will be treated as column headers returning an array of objects, rather than array of arrays. Defaults to `true`.
- `injectToPage` - Boolean - Used if you want to load the JSON into the page as an alternative way of loading. Sometimes you might need to do this. Defaults to `false`.
- `parseNumbers` - Boolean - Used when parsing DSV. You can choose to have the value kept as a string or turned into a number. Defaults to `true`
- `delimeter` - String - Used when parsing DSV. If you're load a CSV, you will want to set this to ",". If you're load a TSV, you will want to set this to "	". Defaults to ","
- `onError` - Function - Triggered when there is an error parsing or loading the given data.
- `async` - Boolean - Used to set whether you want the data to load asynchronously. Defaults to `true`

###FAQ

**1. Why is it called Nigel?**

There is absolutely no reason at all for it being called Nigel. I just felt like giving it a name and strangely it does help when referencing it in conversation.
	
**2. Which browsers does it work on?**

The browsers I have tested on are:

- IE7 - Win
- IE8 - Win
- IE9 - Win
- IE10 - Win
- FF5 - Win
- FF16 - Win
- Chrome - Win
- FF7 - Mac
- FF12 - Mac
- Safari 6 - Mac
- Chrome - Mac
- iOS5 - Simulator
- iOS6 - Simulator