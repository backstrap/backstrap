/**
 * A model-bound Bootstrap tabs nav object.
 * 
 * @author Kevin Perry perry@princeton.edu
 * @copyright 2014 The Trustees of Princeton University.
 * @license MIT
 * 
 */
(function()
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
	
	$$.NavTabs = Backbone.UI.List.extend({

		initialize: function (options) {
			this.options.itemView = ItemView;
			Backbone.UI.List.prototype.initialize.call(this, options);
		},

		render: function () {
			Backbone.UI.List.prototype.render.call(this);
			this.$('> ul').addClass('nav nav-tabs');
			return this;
		}
	});
	
	return $$.NavTabs;
})();

