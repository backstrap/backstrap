/**
 * A Bootstrap View that displays a model-bound dropdown list.
 * Largely from Backbone-UI's Pulldown class,
 * with Bootstrap decoration.
 * 
 * @license MIT
 */
(function(context) {
	var fn = function($$)
	{
		var ItemView = $$.BaseView.extend({
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
		
	
		return ($$.Dropdown = $$.List.extend({
			className: 'dropdown',
			align: '',
	
			initialize: function (options) {
				this.options.itemView = ItemView;
				$$.List.prototype.initialize.call(this, options);
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
				$$.List.prototype.render.call(this);
				this.$el.prepend(this.button.el);
				this.$('> ul').addClass('dropdown-menu' + this.align).attr({
					role: 'menu',
					'aria-labelledby': this.options.buttonId
				});
				return this;
			},
			
		    // renders an item for the given model, at the given index
		    _renderItem : function(model, index) {
				var li = $$.List.prototype._renderItem.call(this, model, index);
				var $li = $(li);
				$li.attr('role', 'presentation');
				if (model.get('divider') || model.get('separator')) {
					$li.addClass('divider');
				} else if (model.get('header')) {
					$li.addClass('dropdown-header');
				}
				return li;
		    }
		}));
	};
	
	if (typeof context.define === "function" && context.define.amd &&
			typeof context._$$_backstrap_built_flag === 'undefined') {
		define("backstrap/Dropdown", ["backstrap"], function ($$) {
			return fn($$);
		});
	} else if (typeof context.module === "object" && typeof context.module.exports === "object") {
		module.exports = fn(require("backstrap"));
	} else {
		if (typeof context.$$ !== 'function') throw new Error('Backstrap environment not loaded');
		fn(context.$$);
	}
}(this));
