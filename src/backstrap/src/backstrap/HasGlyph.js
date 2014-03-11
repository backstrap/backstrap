// A mixin for dealing with glyphs in widgets 
(function(context){
	var fn = function($$)
	{
		return ($$.HasGlyph = {
			insertGlyphLayout : function(glyphLeftClassName, glyphRightClassName, content, parent) {

				// append left glyph
				if(glyphLeftClassName) {
					var glyphLeft = $$.span({
						className : 'glyph left ' + glyphLeftClassName
					});
					parent.appendChild(glyphLeft);
					$(parent).addClass('hasGlyphLeft');
				}

				// append content
				if(content) {
					parent.appendChild(content);
				}

				// append right glyph
				if(glyphRightClassName) {
					var glyphRight = $$.span({
						className : 'glyph right ' + glyphRightClassName
					});
					parent.appendChild(glyphRight);
					$(parent).addClass('hasGlyphRight');
				}
			 
			},

			resolveGlyph : function(model, content) {
				if(content === null) return null;
				var glyph = null;
				if(_(model).exists() && _((model.attributes || model)[content]).exists()) {
					glyph = this.resolveContent(model, content);
				}
				return _(glyph).exists() ? glyph : content;
			}
		});
	};

	if (typeof context.define === "function" && context.define.amd &&
			typeof context._$$_backstrap_built_flag === 'undefined') {
		define("backstrap/HasGlyph", ["backstrap"], function ($$) {
			return fn($$);
		});
	} else if (typeof context.module === "object" && typeof context.module.exports === "object") {
		module.exports = fn(require("backstrap"));
	} else {
		if (typeof context.$$ !== 'function') throw new Error('Backstrap environment not loaded');
		fn(context.$$);
	}
}(this));
