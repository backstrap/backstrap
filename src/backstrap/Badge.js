/**
 * A model-bound Bootstrap badge object.
 *
 * Use model and content options to set the content of the badge.
 * 
 * @author Kevin Perry perry@princeton.edu
 * @copyright 2014 The Trustees of Princeton University.
 * @license MIT
 * 
 */
(function(context) {
	var fn = function($$)
	{
		return ($$.Badge = Backbone.View.extend({
			options : {
				tagName : 'span',
			},
	
			initialize : function(options) {
				this.options = _.extend({}, this.options, options);
				this.mixin([context.$$.backbone_ui.HasModel]);
				_(this).bindAll('render');
				$(this.el).addClass('badge');
			},
	
			render : function() {
				var content = this.resolveContent();
				this._observeModel(this.render);
				$(this.el).text(content);
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
			throw new Error("$$ is not set - include backstrap.js before Badge.js.");
		}
		fn(context.$$);
	}
	
}(this));
