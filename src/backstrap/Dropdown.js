/**
 * A model-bound Bootstrap dropdown object.
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
		className: 'menuitem',
		
		initialize: function initialize() {
			if (this.model.get('divider') || this.model.get('header')) {
				// TODO test
				this.tagName = 'span';
			}
		},

		render: function render() {
			this.parent().attr('role', 'presentation');
			if (this.model.get('divider')) {
				this.parent().attr('class', 'divider');
			} else if (this.model.get('header')) {
				this.parent().attr('class', 'dropdown-header');
			} else {
				(this.$el.attr('role', 'menuitem')
					.attr('tabindex', -1)
					.attr('href', this.model.get('href'))
					.text(this.model.get('label')));
			}
			return this;
		}
	});
	
	$$.Dropdown = Backbone.UI.List.extend({
		className: 'dropdown',
		align: '',

		initialize: function () {
			Backbone.UI.List.prototype.initialize.apply(this, arguments);
			this.itemView = ItemView;
			this.button = new $$.Button({
				className: 'dropdown-toggle sr-only',
				id: this.options.buttonId,
				content: this.options.buttonLabel
			});
			this.button.$el.attr('type', 'button');
			this.button.$el.attr('data-toggle', 'dropdown');
			this.button.$el.append($$.span({className: 'caret'}));
			if ('align' in this.options) {
				this.align = this.options.align==='right' ? ' dropdown-menu-right' : ' dropdown-menu-left';
			}
		},

		render: function () {
			Backbone.UI.List.prototype.render.apply(this, arguments);
			this.$el.prepend(this.button);
			this.$('> ul').addClass('dropdown-menu' + this.align).attr({
				role: 'menu',
				'aria-labelledby': this.options.buttonId
			});
			return this;
		}
	});
	
	return $$.Dropdown;
})();

