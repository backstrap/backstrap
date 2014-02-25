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
				this.options = _.extend({}, this.options, options);
				this.mixin([context.$$.HasModel]);
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
	
	/* if (typeof context.define === "function" && context.define.amd) {
		context.define("backstrap/Badge", ["backstrap"], fn);
		// above doesn't work, so punt and use global for now.
		//fn(context.$$);
	} else */ if (typeof context.module === "object" && typeof context.module.exports === "object") {
		context.module.exports = fn(require("backstrap"));
	} else {
		if (typeof context.$$ !== 'function') throw new Error('Backstrap environment not loaded');
		fn(context.$$);
	}
}(this));
