/**
 * A Bootstrap View that displays a contextually-colored spanor other tag;
 * context name bound to model data.
 * 
 * @author Kevin Perry perry@princeton.edu
 * @copyright 2014 The Trustees of Princeton University.
 * @license MIT
 * 
 */
(function(context) {
	var fn = function($$)
	{
		return ($$.Context = $$.BaseView.extend({
			options : {
				tagName : 'span',
				background: false
			},
			context: null,
	
			initialize : function(options) {
				this.options = _.extend({}, this.options, options);
				this.mixin([$$.HasModel]);
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
	
	if (typeof context.define === "function" && context.define.amd &&
			typeof context._$$_backstrap_built_flag === 'undefined') {
		define("backstrap/Context", ["backstrap"], function ($$) {
			return fn($$);
		});
	} else if (typeof context.module === "object" && typeof context.module.exports === "object") {
		module.exports = fn(require("backstrap"));
	} else {
		if (typeof context.$$ !== 'function') throw new Error('Backstrap environment not loaded');
		fn(context.$$);
	}
}(this));
