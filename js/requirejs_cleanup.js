/**
 * Cleanup our temporary global context defn's. See _setup.js for explanation.
 * 
 * @author Kevin Perry perry@princeton.edu
 */
if (typeof this.define === "function" && this.define.amd) {
	this._$$_backstrap_built_flag();
	this.define("backstrap", ["jquery", "backbone"], this.$$.noConflict);
}
