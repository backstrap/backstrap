/**
 * Description of object goes here.
 *
 * @author Kevin Perry perry@princeton.edu
 * @copyright 2014 The Trustees of Princeton University.
 * @license MIT
 * 
 */
(function(context)
{
	// Definition of object goes here.
	var Thing = {};

	// If we're in an AMD environment, register it as a named AMD module.
	if (typeof define === "function" && define.amd) {
		define("backstrap/Thing", ["backstrap"], function() {
			return Thing;
		});
	}

	// If we're in a CommonJS environment, export the object;
	// otherwise put it in the $$ namespace.
	if ( typeof module === "object" && typeof module.exports === "object" ) {
		module.exports = Thing;
	} else {
		if (typeof context.$$ !== "object") {
			throw new Error("$$ is not set - include backstrap.js before Thing.js.");
		}
		context.$$.Thing = Thing;
	}
}(this));
