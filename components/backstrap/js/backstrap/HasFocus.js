// A mixin for dealing with focus in / focus out
(function(context) {
	var fn = function($$)
	{
		return ($$.HasFocus = {
			setupFocus : function(el, parent) {
			
				// add focusin 
				$(el).focusin(_(function(e) {
					$(parent).addClass('focused');
				}).bind(this));

				// add focusout
				$(el).focusout(_(function(e) {
					$(parent).removeClass('focused');
				}).bind(this));
				
			}
		});
	};

	if (typeof context.define === "function" && context.define.amd &&
			typeof context._$$_backstrap_built_flag === 'undefined') {
		context.define("backstrap/HasFocus", ["backstrap"], fn);
	} else if (typeof context.module === "object" && typeof context.module.exports === "object") {
		context.module.exports = fn(require("backstrap"));
	} else {
		if (typeof context.$$ !== 'function') throw new Error('Backstrap environment not loaded');
		fn(context.$$);
	}
}(this));
