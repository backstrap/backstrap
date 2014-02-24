/**
 * A model-bound Bootstrap table object.
 * 
 * @author Kevin Perry perry@princeton.edu
 * @copyright 2014 The Trustees of Princeton University.
 * @license MIT
 * 
 */
(function(context) {
	var fn = function($$)
	{
		return ($$.Table = $$.backbone_ui.TableView.extend({
			options: {
				tagName: 'table',
				striped: false,
				bordered: false,
				hover: false,
				condensed: false,
				responsive: false // NB: needs a wrapping div!
			},
			
			render: function() {
				$$.backbone_ui.TableView.prototype.render.apply(this, arguments);
				this.$('table').addClass('table');
				return this;
			}
		}));
	};
	
	// If we're in an AMD environment, register it as a named AMD module.
	if (typeof define === "function" && define.amd) {
		define("backstrap/Badge", ["backstrap"], function($$) {
			return fn($$);
		});
	}
	
	// If we're in a CommonJS environment, export the object;
	// otherwise put it in the $$ namespace.
	if ( typeof module === "object" && typeof module.exports === "object" ) {
		module.exports = fn(require("backstrap"));
	} else {
		if (typeof context.$$ !== "function") {
			throw new Error("$$ is not set - include backstrap.js before Table.js.");
		}
		fn(context.$$);
	}
	
}(this));
