// A mixin for dealing with glyphs in widgets 
(function(context) {
	var fn = function($$)
	{
		return ($$.HasFormLabel = {
			wrapWithFormLabel : function(content) {
				var wrapped = $$.label();
				
				var formLabelText = this.options.formLabelContent ? 
					this.resolveContent(this.model, this.options.formLabelContent, 
						this.options.formLabelContent) || this.options.formLabelContent : null;
				if(formLabelText) {
					wrapped.appendChild($$.span({className : 'form_label'}, formLabelText));
				}
				wrapped.appendChild(content);
				return wrapped;	
			}	
		});
	};

	if (typeof context.define === "function" && context.define.amd &&
			typeof context._$$_backstrap_built_flag === 'undefined') {
		context.define("backstrap/HasFormLabel", ["backstrap"], fn);
	} else if (typeof context.module === "object" && typeof context.module.exports === "object") {
		context.module.exports = fn(require("backstrap"));
	} else {
		if (typeof context.$$ !== 'function') throw new Error('Backstrap environment not loaded');
		fn(context.$$);
	}
}(this));
