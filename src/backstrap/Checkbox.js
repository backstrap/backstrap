(function(context) {
	var fn = function($$)
	{
		return ($$.Checkbox = $$.BaseView.extend({
			options : {
				// The property of the model describing the label that 
				// should be placed next to the checkbox
				labelContent : null,

				disabled : false
			},

			initialize : function(options) {
				$$.BaseView.prototype.initialize.call(this, options);
				this.mixin([$$.HasModel, $$.HasGlyph,
					$$.HasError]);
				_(this).bindAll('_refreshCheck');
				$(this.el).addClass('checkbox');
				if(this.options.name){
					$(this.el).addClass(this.options.name);
				}
				this.label = $$.label();
				this.input = $$.input({type : 'checkbox'});
				$(this.input).change(_(this._updateModel).bind(this));
				$(this.input).click(_(this._updateModel).bind(this));
				this._observeModel(_(this._refreshCheck).bind(this));
			},

			render : function() {

				$(this.el).empty();
				$(this.label).empty();

				$(this.input).off('change');
				$(this.input).off('click');

				var value = this.resolveContent() !== null ? 
					this.resolveContent() : this.input.checked;

				$(this.input).attr({
					name : this.options.name,
					id : this.options.name,
					tabIndex : this.options.tabIndex,
					checked : value,
					disabled : this.options.disabled
				});

				var labelText = this.resolveContent(this.model, this.options.labelContent) || this.options.labelContent;

				this.label.appendChild(this.input);
				this._labelText = $$.span(labelText);

				var parent = $$.div({className : 'checkbox_wrapper'});
				var content = this._labelText;
				var glyphLeftClassName = this.resolveGlyph(this.model, this.options.glyphLeftClassName);
				var glyphRightClassName = this.resolveGlyph(this.model, this.options.glyphRightClassName);
				this.insertGlyphLayout(glyphLeftClassName, glyphRightClassName, content, parent);

				this.label.appendChild(parent);
				this.el.appendChild(this.label);

				this.setEnabled(!this.options.disabled);

				$(this.input).on('change', _(this._updateModel).bind(this));
				$(this.input).on('click', _(this._updateModel).bind(this));

				return this;
			},

			_refreshCheck : function() {

				var value = this.resolveContent();

				$(this.input).attr({ checked : value });

				var labelText = this.resolveContent(this.model, this.options.labelContent) || this.options.labelContent;
				$(this._labelText).text(labelText);

			},

			_updateModel : function() {
				_(this.model).setProperty(this.options.content, this.input.checked);
			},

			// sets the enabled state
			setEnabled : function(enabled) {
				if(enabled) { 
					$(this.el).removeClass('disabled');
				} else {
					$(this.el).addClass('disabled');
				}
				this.input.disabled = !enabled;
			}

		}));
	};

	if (typeof context.define === "function" && context.define.amd &&
			typeof context._$$_backstrap_built_flag === 'undefined') {
		context.define("backstrap/Checkbox", ["backstrap", "backstrap/HasError", "backstrap/HasGlyph", "backstrap/HasModel"], fn);
	} else if (typeof context.module === "object" && typeof context.module.exports === "object") {
		context.module.exports = fn(require("backstrap"));
	} else {
		if (typeof context.$$ !== 'function') throw new Error('Backstrap environment not loaded');
		fn(context.$$);
	}
}(this));
