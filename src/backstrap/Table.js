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
		return ($$.Table = $$.TableView.extend({
			options: {
				tagName: 'table',
				striped: false,
				bordered: false,
				hover: false,
				condensed: false,
				responsive: false // NB: needs a wrapping div!
			},
			
			render: function() {
				$$.TableView.prototype.render.apply(this, arguments);
				this.$('table').addClass('table');
				return this;
			}
		}));
	};
	
	/* if (typeof context.define === "function" && context.define.amd) {
		define("backstrap/Table", ["backstrap"], function ($$) {
			return fn($$);
		});
	} else */ if (typeof context.module === "object" && typeof context.module.exports === "object") {
		module.exports = fn(require("backstrap"));
	} else {
		if (typeof context.$$ !== 'function') throw new Error('Backstrap environment not loaded');
		fn(context.$$);
	}
}(this));
