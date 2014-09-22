/**
 * A Backbone View that displays model-bound content with Bootstrap decoration.
 * 
 * @license MIT
 */
(function(context) {
	var fn = function($$)
	{
		return ($$.Span = $$.View.extend({
			options : {
				size: 'default',
				context: 'default'
			},

			tagName : 'span',

			initialize : function(options) {
				$$.View.prototype.initialize.call(this, options);
				this.mixin([$$.HasModel, $$.HasGlyph]);
				_(this).bindAll('render');
				this.$el.addClass('text-' + $$._mapSize(this.options.size));
				if (this.options.size !== this.options.context) {
					this.$el.addClass(' text-' + this.options.context);
				}
			},

			render : function() {
				var content = this.resolveContent();

				this._observeModel(this.render);

				this.$el.empty();

				var glyphLeftClassName = this.resolveGlyph(this.model, this.options.glyphLeftClassName);
				var glyphRightClassName = this.resolveGlyph(this.model, this.options.glyphRightClassName);

				this.insertGlyphLayout(glyphLeftClassName, glyphRightClassName, content, this.el);

				return this;
			}
		}));
	};

	if (typeof context.define === "function" && context.define.amd &&
			typeof context._$$_backstrap_built_flag === 'undefined') {
		context.define("backstrap/Span", ["backstrap", "backstrap/HasModel", "backstrap/HasGlyph"], fn);
	} else if (typeof context.module === "object" && typeof context.module.exports === "object") {
		context.module.exports = fn(require("backstrap"));
	} else {
		if (typeof context.$$ !== 'function') throw new Error('Backstrap environment not loaded');
		fn(context.$$);
	}
}(this));
