/**
 * A basic model-bound Bootstrap navbar object.
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
		
		var NavList = $$.backbone_ui.List.extend({
			className: 'navbar-collapse collapse',
	
			render: function () {
				$$.backbone_ui.List.prototype.render.apply(this, arguments);
				this.$('> ul').addClass('nav navbar-nav');
				return this;
			}
		});
	
		return ($$.BasicNavbar = Backbone.View.extend({
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
				this.navList = new NavList({ model: options.model, itemView: ItemView });
			},
	
			render: function () {
				this.$el.empty();
				this.$el.append(
					$$.div({ className: 'container' },
						$$.div({ className: 'navbar-header' },
							$$.button({
									type: 'button',
									className: 'navbar-toggle',
									'data-toggle': 'collapse',
									'data-target': '.navbar-collapse'
								},
								$$.span({ className: 'sr-only' }, 'Toggle navigation'),
								$$.span({ className: 'icon-bar' }),
								$$.span({ className: 'icon-bar' }),
								$$.span({ className: 'icon-bar' })
							),
							$$.a({ className: 'navbar-brand', href: '#' }, this.brand)
						),
						this.navList.render().el
					)
				).attr('role', 'navigation');
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
			throw new Error("$$ is not set - include backstrap.js before BasicNavbar.js.");
		}
		fn(context.$$);
	}
	
}(this));
