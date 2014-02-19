/**
 * A basic model-bound Bootstrap navbar object.
 * 
 * @author Kevin Perry perry@princeton.edu
 * @copyright 2014 The Trustees of Princeton University.
 * @license MIT
 * 
 */
define('backstrap/BasicNavbar', [ 'backstrap', 'backbone' ],
function ($$, Backbone)
{
	var NavItemView = Backbone.View.extend({
		tagName: 'a',
		className: 'nav-item',
		
		render: function render() {
			this.$el.addClass('nav-item-' + this.model.get('name'))
				.attr('href', this.model.get('href'))
				.text(this.model.get('label'));
			return this;
		}
	});
	
	var NavList = Backbone.UI.List.extend({
		className: 'navbar-collapse collapse',

		render: function () {
			Backbone.UI.List.prototype.render.apply(this, arguments);
			this.$('> ul').addClass('nav navbar-nav');
			return this;
		}
	});

	$$.BasicNavbar = Backbone.View.extend({
		className: 'navbar navbar-default',
		brand: '',

		initialize: function (options) {
			Backbone.View.prototype.initialize.apply(this, arguments);
			if ('navbarType' in options) {
				this.$el.addClass('navbar-'+options.navbarType);
			}
			if ('brand' in options) {
				this.brand = options.brand;
			}
			this.navList = new NavList({ model: options.model, itemView: NavItemView });
		},

		render: function () {
			this.$el.empty();
			this.$el.append(
				$.el.div({ className: 'container' },
					$.el.div({ className: 'navbar-header' },
						$.el.button({
								type: 'button',
								className: 'navbar-toggle',
								'data-toggle': 'collapse',
								'data-target': '.navbar-collapse'
							},
							$.el.span({ className: 'sr-only' }, 'Toggle navigation'),
							$.el.span({ className: 'icon-bar' }),
							$.el.span({ className: 'icon-bar' }),
							$.el.span({ className: 'icon-bar' })
						),
						$.el.a({ className: 'navbar-brand', href: '#' }, this.brand)
					),
					this.navList.render().el
				)
			).attr('role', 'navigation');
			return this;
		}
	});
	
	return $$.BasicNavbar;
});

