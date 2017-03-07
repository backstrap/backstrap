/**
 * A Backbone View that displays a model-bound text field.
 * Largely from Backbone-UI's TextField class,
 * with Bootstrap decoration.
 * 
 * @author Kevin Perry perry@princeton.edu
 * @license MIT
 */
define("backstrap/views/TextField", ["../core", "jquery", "underscore"], function ($$, $, _)
{
    return ($$.TextField = $$.views.TextField = $$.View.extend({
        options: {
            // The type of input (text, password, number, email, etc.)
            type: 'text',

            // the value to use for both the name and id attribute 
            // of the underlying input element
            name: null,

            // disables the input text
            disabled: false,

            // the tab index to set on the underlying input field
            tabIndex: null,

            // a callback to invoke when a key is pressed within the text field
            onKeyPress: $.noop,

            // if given, the text field will limit its character count
            maxLength: null
        },

        // public accessors
        input: null,

        initialize: function (options) {
            $$.View.prototype.initialize.call(this, options);

            this.mixin([$$.mixins.HasModel, $$.mixins.HasFormLabel, $$.mixins.HasGlyph,
                $$.mixins.HasError, $$.mixins.HasFocus]);

            _(this).bindAll('_refreshValue', '_optKeyPress', '_updateModel');
            this.$el.addClass('text_field form-group');

            if (this.options.name){
                this.$el.addClass(this.options.name);
            }

            this.input = $$.input({maxLength: this.options.maxLength});

            $(this.input).keyup(this._optKeyPress).input(this._updateModel);

            this._observeModel(this._refreshValue);
        },

        render: function () {
            var value = (this.input && this.input.value.length) > 0 ? 
                this.input.value : this.resolveContent();

            this.$el.empty();

            $(this.input).attr({
                id: this.options.name,
                type: this.options.type ? this.options.type : 'text',
                name: this.options.name,
                tabIndex: this.options.tabIndex,
                placeholder: this.options.placeholder,
                pattern: this.options.pattern,
                value: value
            });

            // insert glyph if exist
            this._parent = $$.div({className: 'text_wrapper'});
            var glyphLeftClassName = this.resolveGlyph(this.model, this.options.glyphLeftClassName);
            var glyphRightClassName = this.resolveGlyph(this.model, this.options.glyphRightClassName);
            this.insertGlyphLayout(glyphLeftClassName, glyphRightClassName, this.input, this._parent);

            // add focusin / focusout
            this.setupFocus(this.input, this._parent);

            this.el.appendChild(this.getFormLabel());
            this.el.appendChild(this._parent);

            this.setEnabled(!this.options.disabled);

            return this;
        },

        getValue: function () {
            return this.input.value;
        },

        setValue: function (value) {
            this.input.value = value;
            this._updateModel();
        },

        // sets the enabled state
        setEnabled: function (enabled) {
            if (enabled) {
                this.$el.removeClass('disabled');
            } else {
                this.$el.addClass('disabled');
            }

            this.input.disabled = !enabled;
        },

        _optKeyPress: function (e) {
            var f = this.options.onKeyPress;

            if (_(f).exists() && _(f).isFunction()) {
                f(e, this);
            }
        },

        _updateModel: function () {
            _(this.model).setProperty(this.options.content, this.input.value);
        },

        _refreshValue: function () {
            var newValue = this.resolveContent();

            if(this.input && this.input.value !== newValue) {
                this.input.value = _(newValue).exists() ? newValue : '';
            }
        }
    }));
});
