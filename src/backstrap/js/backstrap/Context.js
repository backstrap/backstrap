/**
 * A Backbone View that displays a Bootstrap contextually-colored span or other tag;
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
		return ($$.Context = $$.View.extend({
			options : {
				tagName: 'span',
				content: 'context',
				background: false
			},
	
			initialize : function(options) {
				$$.View.prototype.initialize.call(this, options);
				this.mixin([$$.HasModel]);
				_(this).bindAll('render');
				this.prefix = this.options.background ? 'bg-' : 'text-';
			},
	
			render : function() {
				var contextName = this.resolveContent(this.options.model, this.options.contentMap);
				this._observeModel(this.render);
				this.$el.removeClass(this.prefix + this.context).addClass(this.prefix + contextName);
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
