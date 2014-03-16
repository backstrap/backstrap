/**
 * A Backbone View that displays a model-bound Bootstrap Glypicon glyph.
 * with Bootstrap decoration.
 * 
 * @author Kevin Perry perry@princeton.edu
 * @copyright 2014 The Trustees of Princeton University.
 * @license MIT
 */
(function(context) {
	var fn = function($$)
	{
		return ($$.Glyph = $$.BaseView.extend({
			options : {
				tagName : 'span',
			},
	
			initialize : function(options) {
				this.options = _.extend({}, this.options, options);
				this.mixin([$$.HasModel]);
				_(this).bindAll('render');
				this.$el.addClass('glyphicon');
			},
	
			render : function() {
				var glyph = this.resolveContent();
				this._observeModel(this.render);
				this.$el.empty();
				this.$el.addClass('glyphicon-' + glyph);
				return this;
			}
		}));
	};
	
	if (typeof context.define === "function" && context.define.amd &&
			typeof context._$$_backstrap_built_flag === 'undefined') {
		define("backstrap/Glyph", ["backstrap"], function ($$) {
			return fn($$);
		});
	} else if (typeof context.module === "object" && typeof context.module.exports === "object") {
		module.exports = fn(require("backstrap"));
	} else {
		if (typeof context.$$ !== 'function') throw new Error('Backstrap environment not loaded');
		fn(context.$$);
	}
}(this));
