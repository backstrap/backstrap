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
		tagName: function () {
			if (this.model.get('divider') || this.model.get('separator') || this.model.get('header')) {
				return 'span';
			} else {
				return 'a';
			}
		},

		render: function render() {
			if (this.model.get('divider') || this.model.get('separator')) {
			} else if (this.model.get('header')) {
				this.$el.text(this.model.get('label'));
			} else {
				this.$el.addClass('menuitem')
					.attr('role', 'menuitem')
					.attr('tabindex', -1)
					.attr('href', this.model.get('href'))
					.text(this.model.get('label'));
			}
			return this;
		}
	});
	
	$$.Dropdown = Backbone.UI.List.extend({
		className: 'dropdown',
		align: '',

		initialize: function (options) {
			this.options.itemView = ItemView;
			Backbone.UI.List.prototype.initialize.call(this, options);
			this.button = new $$.Button({
				tagName: 'button',
				className: 'dropdown-toggle',
				id: this.options.buttonId,
				content: this.options.buttonLabel + ' ',
				onClick: function () { return true; } // allow bubble-up to Bootstrap's Dropdown event handler!
			});
			this.button.render();
			this.button.$el.attr('type', 'button');
			this.button.$el.attr('data-toggle', 'dropdown');
			this.button.$el.append($$.span({className: 'caret'}));
			if ('align' in this.options) {
				this.align = this.options.align==='right' ? ' dropdown-menu-right' : ' dropdown-menu-left';
			}
			return this;
		},

		render: function () {
			Backbone.UI.List.prototype.render.call(this);
			this.$el.prepend(this.button.el);
			this.$('> ul').addClass('dropdown-menu' + this.align).attr({
				role: 'menu',
				'aria-labelledby': this.options.buttonId
			});
			return this;
		},
		
	    // renders an item for the given model, at the given index
	    _renderItem : function(model, index) {
			var li = Backbone.UI.List.prototype._renderItem.call(this, model, index);
			var $li = $(li);
			$li.attr('role', 'presentation');
			if (model.get('divider') || model.get('separator')) {
				$li.addClass('divider');
			} else if (model.get('header')) {
				$li.addClass('dropdown-header');
			}
			return li;
	    }
	});
	
	return $$.Dropdown;
})();

