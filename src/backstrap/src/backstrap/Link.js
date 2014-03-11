(function(context) {
	var fn = function($$)
	{
		return ($$.Link = $$.BaseView.extend({
			options : {
				// disables the link (non-clickable) 
				disabled : false,

				// A callback to invoke when the link is clicked
				onClick : null
			},

			tagName : 'a',

			initialize : function(options) {
				$$.BaseView.prototype.initialize.call(this, options);
				this.mixin([$$.HasModel, $$.HasGlyph]);

				_(this).bindAll('render');

				$(this.el).addClass('link');

				$(this.el).bind('click', _(function(e) {
					return this.options.disabled ? false :
						(this.options.onClick ? this.options.onClick(e) : true);
				}).bind(this));
			},

			render : function() {
				var labelText = this.resolveContent();

				this._observeModel(this.render);

				$(this.el).empty();

				var content = $$.span(labelText);

				var glyphLeftClassName = this.resolveGlyph(this.model, this.options.glyphLeftClassName);
				var glyphRightClassName = this.resolveGlyph(this.model, this.options.glyphRightClassName);

				this.insertGlyphLayout(glyphLeftClassName, glyphRightClassName, content, this.el);

				// add appropriate class names
				this.setEnabled(!this.options.disabled);

				return this;
			},

			// sets the enabled state of the button
			setEnabled : function(enabled) {
				if(enabled) {
					this.el.href = '#';
				} else { 
					this.el.removeAttribute('href');
				}
				this.options.disabled = !enabled;
				$(this.el).toggleClass('disabled', !enabled);
			}
		}));
	};

	if (typeof context.define === "function" && context.define.amd &&
			typeof context._$$_backstrap_built_flag === 'undefined') {
		context.define("backstrap/Link", ["backstrap", "backstrap/HasModel", "backstrap/HasGlyph"], fn);
	} else if (typeof context.module === "object" && typeof context.module.exports === "object") {
		context.module.exports = fn(require("backstrap"));
	} else {
		if (typeof context.$$ !== 'function') throw new Error('Backstrap environment not loaded');
		fn(context.$$);
	}
}(this));