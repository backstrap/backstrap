 // A mixin for those views that are model bound
(function(context){
	var fn = function($$)
	{
		return ($$.HasModel = {
			options : {
				// The Backbone.Model instance the view is bound to
				model : null,

				// The property of the bound model this component should render / update.
				// If a function is given, it will be invoked with the model and will 
				// expect an element to be returned.	If no model is present, this 
				// property may be a string or function describing the content to be rendered
				content : null,

				// If provided this content will wrap the component with additional label.
				// The text displayed by the label is determined the same way the content attribute.
				// This option is a no-op when applied to Button, Calendar, Checkbox, Link components.
				formLabelContent : null,

				// If present, a square glyph area will be added to the left side of this 
				// component, and the given string will be used as the class name
				// property of that glyph area. This option is a no-op when applied 
				// to Calender and Menu components. 
				glyphLeftClassName : null,

				// Same as above, but on the right side.
				glyphRightClassName : null

			},

			_observeModel : function(callback) {
				if(_(this.model).exists() && _(this.model.unbind).isFunction()) {
					_(['content', 'labelContent']).each(function(prop) {
						var key = this.options[prop];
						if(_(key).exists()) {
							key = 'change:' + key;
							this.model.unbind(key, callback);
							this.model.bind(key, callback);
						}
					}, this);
				}
			},

			_unobserveModel : function(callback) {
				if(_(this.model).exists() && _(this.model.unbind).isFunction()) {
					_(['content', 'labelContent']).each(function(prop) {
						var key = this.options[prop];
						if(_(key).exists()) {
							key = 'change:' + key;
							this.model.unbind(key, callback);
						}
					}, this);
				}
			}

		});
	};

	if (typeof context.define === "function" && context.define.amd &&
			typeof context._$$_backstrap_built_flag === "undefined") {
		define("backstrap/HasModel", ["backstrap"], function ($$) {
			return fn($$);
		});
	} else if (typeof context.module === "object" && typeof context.module.exports === "object") {
		module.exports = fn(require("backstrap"));
	} else {
		if (typeof context.$$ !== 'function') throw new Error('Backstrap environment not loaded');
		fn(context.$$);
	}
}(this));

