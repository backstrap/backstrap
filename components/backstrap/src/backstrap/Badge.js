/**
 * A model-bound Bootstrap badge object.
 *
 * Use model and content options to set the content of the badge.
 * 
 * @author Kevin Perry perry@princeton.edu
 * @copyright 2014 The Trustees of Princeton University.
 * @license MIT
 * 
 */
(function(context) {
	var fn = function($$)
	{
		return ($$.Badge = $$.BaseView.extend({
			options : {
				tagName : 'span',
			},
	
			initialize : function(options) {
				$$.BaseView.prototype.initialize.call(this, options);
				this.mixin([$$.HasModel]);
				_(this).bindAll('render');
				$(this.el).addClass('badge');
			},
	
			render : function() {
				var content = this.resolveContent();
				this._observeModel(this.render);
				$(this.el).text(content);
				return this;
			}
		}));
	};
	
	if (typeof context.define === "function" && context.define.amd &&
			typeof context._$$_backstrap_built_flag === 'undefined') {
		context.define("backstrap/Badge", ["backstrap", "backstrap/HasModel"], fn);
	} else if (typeof context.module === "object" && typeof context.module.exports === "object") {
		context.module.exports = fn(require("backstrap"));
	} else {
		if (typeof context.$$ !== 'function') throw new Error('Backstrap environment not loaded');
		fn(context.$$);
	}
}(this));
