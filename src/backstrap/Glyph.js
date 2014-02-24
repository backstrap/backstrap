/**
 * A model-bound Bootstrap Glyphicon object.
 * 
 * @author Kevin Perry perry@princeton.edu
 * @copyright 2014 The Trustees of Princeton University.
 * @license MIT
 * 
 */
(function(context) {
	var fn = function($$)
	{
		return ($$.Glyph = Backbone.View.extend({
			options : {
				tagName : 'span',
			},
	
			initialize : function(options) {
				this.options = _.extend({}, this.options, options);
				this.mixin([$$.backbone_ui.HasModel]);
	
				_(this).bindAll('render');
	
				$(this.el).addClass('glyphicon');
			},
	
			render : function() {
				var glyph = this.resolveContent();
	
				this._observeModel(this.render);
	
				$(this.el).empty();
				$(this.el).addClass('glyphicon-' + glyph);
				
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
			throw new Error("$$ is not set - include backstrap.js before Glyph.js.");
		}
		fn(context.$$);
	}
	
}(this));
