/**
 * A model-bound Bootstrap tabs nav object.
 * 
 * @author Kevin Perry perry@princeton.edu
 * @copyright 2014 The Trustees of Princeton University.
 * @license MIT
 * 
 */
(function(context) {
	var fn = function($$)
	{
		var ItemView = $$.View.extend({
			tagName: 'a',
			className: 'nav-item',
			
			render: function render() {
				this.$el.addClass('nav-item-' + this.model.get('name'))
					.attr('href', this.model.get('href'))
					.text(this.model.get('label'));
				return this;
			}
		});
		
		return ($$.NavTabs = $$.List.extend({
	
			initialize: function (options) {
				this.options.itemView = ItemView;
				$$.List.prototype.initialize.call(this, options);
			},
	
			render: function () {
				$$.List.prototype.render.call(this);
				this.$('> ul').addClass('nav nav-tabs');
				return this;
			}
		}));
	};
	
	if (typeof context.define === "function" && context.define.amd &&
			typeof context._$$_backstrap_built_flag === 'undefined') {
		define("backstrap/NavTabs", ["backstrap"], function ($$) {
			return fn($$);
		});
	} else if (typeof context.module === "object" && typeof context.module.exports === "object") {
		module.exports = fn(require("backstrap"));
	} else {
		if (typeof context.$$ !== 'function') throw new Error('Backstrap environment not loaded');
		fn(context.$$);
	}
}(this));
