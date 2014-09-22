/**
 * A Backbone View that displays a model-bound text field.
 * Largely from Backbone-UI's TextField class,
 * with Bootstrap decoration.
 * 
 * @license MIT
 */
(function(context) {
	var fn = function($$)
	{
		var noop = function(){};
		return ($$.TextField = $$.View.extend({
			options : {
				// disables the input text
				disabled : false,
				
				// The type of input (text, password, number, email, etc.)
				type : 'text',

				// the value to use for both the name and id attribute 
				// of the underlying input element
				name : null,

				// the tab index to set on the underlying input field
				tabIndex : null,

				// a callback to invoke when a key is pressed within the text field
				onKeyPress : noop,

				// if given, the text field will limit it's character count
				maxLength : null
			},

			// public accessors
			input : null,

			initialize : function(options) {
				$$.View.prototype.initialize.call(this, options);
				this.mixin([$$.HasModel, $$.HasGlyph, 
					$$.HasFormLabel, $$.HasError, $$.HasFocus]);
				_(this).bindAll('_refreshValue');
			
				$(this.el).addClass('text_field form-group');
				if(this.options.name){
					$(this.el).addClass(this.options.name);
				}

				this.input = $$.input({maxLength : this.options.maxLength});

				$(this.input).keyup(_(function(e) {
					if(_(this.options.onKeyPress).exists() && _(this.options.onKeyPress).isFunction()) {
						this.options.onKeyPress(e, this);
					}
				}).bind(this)).input(_(this._updateModel).bind(this));

				this._observeModel(this._refreshValue);
			},

			render : function() {
				var value = (this.input && this.input.value.length) > 0 ? 
					this.input.value : this.resolveContent();

				this.$el.empty();

				$(this.input).attr({
					type : this.options.type ? this.options.type : 'text',
					name : this.options.name,
					id : this.options.name,
					tabIndex : this.options.tabIndex,
					placeholder : this.options.placeholder,
					pattern : this.options.pattern,
					value : value});

				// insert glyph if exist
				this._parent = $$.div({className : 'text_wrapper'});
				var content = this.input;
				var glyphLeftClassName = this.resolveGlyph(this.model, this.options.glyphLeftClassName);
				var glyphRightClassName = this.resolveGlyph(this.model, this.options.glyphRightClassName);
				this.insertGlyphLayout(glyphLeftClassName, glyphRightClassName, content, this._parent);
				
				// add focusin / focusout
				this.setupFocus(this.input, this._parent);
							
				this.$el.append(this.wrapWithFormLabel($$.span()), this._parent);
				
				this.setEnabled(!this.options.disabled);

				return this;
			},

			getValue : function() {
				return this.input.value;
			},

			setValue : function(value) {
				this.input.value = value;
				this._updateModel();
			},

			// sets the enabled state
			setEnabled : function(enabled) {
				if(enabled) { 
					$(this.el).removeClass('disabled');
				} else {
					$(this.el).addClass('disabled');
				}
				this.input.disabled = !enabled;
			},

			_updateModel : function() {
				_(this.model).setProperty(this.options.content, this.input.value);
			},

			_refreshValue : function() {
				var newValue = this.resolveContent();
				if(this.input && this.input.value !== newValue) {
					this.input.value = _(newValue).exists() ? newValue : "";
				}
			}
		}));
	};

	if (typeof context.define === "function" && context.define.amd &&
			typeof context._$$_backstrap_built_flag === 'undefined') {
		context.define("backstrap/TextField",
			[ "backstrap", "backstrap/HasError", "backstrap/HasGlyph",
			  "backstrap/HasFocus", "backstrap/HasFormLabel", "backstrap/HasModel"
			], fn);
	} else if (typeof context.module === "object" && typeof context.module.exports === "object") {
		context.module.exports = fn(require("backstrap"));
	} else {
		if (typeof context.$$ !== 'function') throw new Error('Backstrap environment not loaded');
		fn(context.$$);
	}
}(this));
