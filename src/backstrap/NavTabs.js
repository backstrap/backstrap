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
		var ItemView = Backbone.View.extend({
			tagName: 'a',
			className: 'nav-item',
			
			render: function render() {
				this.$el.addClass('nav-item-' + this.model.get('name'))
					.attr('href', this.model.get('href'))
					.text(this.model.get('label'));
				return this;
			}
		});
		
		return ($$.NavTabs = $$.backbone_ui.List.extend({
	
			initialize: function (options) {
				this.options.itemView = ItemView;
				$$.backbone_ui.List.prototype.initialize.call(this, options);
			},
	
			render: function () {
				$$.backbone_ui.List.prototype.render.call(this);
				this.$('> ul').addClass('nav nav-tabs');
				return this;
			}
		}));
	};
	
	// If we're in an AMD environment, register it as a named AMD module.
	if (typeof define === "function" && define.amd) {
		define("backstrap/Badge", ["backstrap"], function($$) {
			return fn($$);
		});
	}
	
	// If we're in a CommonJS environment, export the object;
	// otherwise put it in the $$ namespace.
	if ( typeof module === "object" && typeof module.exports === "object" ) {
		module.exports = fn(require("backstrap"));
	} else {
		if (typeof context.$$ !== "function") {
			throw new Error("$$ is not set - include backstrap.js before NavTabs.js.");
		}
		fn(context.$$);
	}
	
}(this));
