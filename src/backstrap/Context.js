/**
 * A model-bound Bootstrap contextually-colored object.
 * 
 * @author Kevin Perry perry@princeton.edu
 * @copyright 2014 The Trustees of Princeton University.
 * @license MIT
 * 
 */
(function(context) {
	var fn = function($$)
	{
		return ($$.Context = Backbone.View.extend({
			options : {
				tagName : 'span',
				background: false
			},
			context: null,
	
			initialize : function(options) {
				this.options = _.extend({}, this.options, options);
				this.mixin([$$.backbone_ui.HasModel]);
				this.prefix = this.options.background ? 'bg-' : 'text-';
				_(this).bindAll('render');
			},
	
			render : function() {
				var context = this.resolveContent();
				this._observeModel(this.render);
				$(this.el).removeClass(this.prefix + this.context).addClass(this.prefix + context);
				this.context = context;
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
			throw new Error("$$ is not set - include backstrap.js before Context.js.");
		}
		fn(context.$$);
	}
	
}(this));
