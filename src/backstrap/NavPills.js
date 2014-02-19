/**
 * A model-bound Bootstrap pills nav object.
 * 
 * @author Kevin Perry perry@princeton.edu
 * @copyright 2014 The Trustees of Princeton University.
 * @license MIT
 * 
 */
define('backstrap/NavPills', [ 'backstrap', 'backbone' ],
function ($$, Backbone)
{
	var NavItemView = Backbone.View.extend({
		tagName: 'a',
		className: 'nav-item',
		
		render: function render() {
			return this.$el.addClass('nav-item-' + this.model.get('name'))
				.attr('href', this.model.get('href'))
				.text(this.model.get('label'));
		}
	});
	
	$$.NavPills = Backbone.UI.List.extend({

		initialize: function () {
			Backbone.UI.List.prototype.initialize.apply(this, arguments);
			this.itemView = NavItemView;
		},

		render: function () {
			Backbone.UI.List.prototype.render.apply(this, arguments);
			return this.$('> ul').addClass('nav nav-pills');
		}
	});
	
	return $$.NavPills;
});

