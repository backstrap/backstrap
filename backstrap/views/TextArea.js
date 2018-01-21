/**
 * A Backbone View that displays a model-bound text area.
 * Largely from Backbone-UI's TextArea class,
 * with Bootstrap decoration.
 *
 * @author Kevin Perry perry@princeton.edu
 * @license MIT
 */
define(
    'backstrap/views/TextArea',
    [
        '../core', 'jquery', 'underscore', '../View', '../input_event',
        '../mixins/HasModel', '../mixins/HasFormLabel', '../mixins/HasError', '../mixins/HasFocus'
    ], function ($$, $, _) {
        return ($$.TextArea = $$.views.TextArea = $$.View.extend({
            options: {
                // id to use on the actual textArea
                textAreaId: null,

                // disables the text area
                disabled: false,

                tabIndex: null,

                // a callback to invoke when a key is pressed within the text field
                onKeyPress: $.noop,

                // if given, the text field will limit its character count
                maxLength: null
            },

            // public accessors
            textArea: null,

            initialize: function (options) {
                $$.View.prototype.initialize.call(this, options);

                this.mixin([$$.mixins.HasModel, $$.mixins.HasFormLabel,
                    $$.mixins.HasError, $$.mixins.HasFocus]);

                _(this).bindAll('_refreshValue', '_optKeyPress', '_updateModel');
                this.$el.addClass('text_area form-group');

                if (this.options.name){
                    this.$el.addClass(this.options.name);
                }

                this.textArea = $$.textarea({
                    maxLength: this.options.maxLength,
                    className: 'form-control'
                });

                $(this.textArea).keyup(this._optKeyPress).input(this._updateModel);

                this._observeModel(this._refreshValue);
            },

            render: function () {
                var value = (this.textArea && this.textArea.value.length) > 0 ?
                    this.textArea.value : this.resolveContent();

                this.$el.empty();

                $(this.textArea).attr({
                    id: this.options.textAreaId,
                    tabIndex: this.options.tabIndex,
                    placeholder: this.options.placeholder
                }).val(value);

                this._parent = $$.div({className: 'textarea_wrapper'}, this.textArea);

                // add focusin / focusout
                this.setupFocus(this.textArea, this._parent);

                this.el.appendChild(this.getFormLabel());
                this.el.appendChild(this._parent);

                this.setEnabled(!this.options.disabled);

                return this;
            },

            getValue: function () {
                return this.textArea.value;
            },

            setValue: function (value) {
                $(this.textArea).empty().val(value);
                this._updateModel();
            },

            // sets the enabled state
            setEnabled: function (enabled) {
                if (enabled) {
                    this.$el.removeClass('disabled');
                } else {
                    this.$el.addClass('disabled');
                }

                this.textArea.disabled = !enabled;
            },

            _optKeyPress: function (e) {
                var f = this.options.onKeyPress;

                if (_(f).exists() && _(f).isFunction()) {
                    f(e, this);
                }
            },

            _updateModel: function () {
                _(this.model).setProperty(this.options.content, this.textArea.value);
            },

            _refreshValue: function () {
                var newValue = this.resolveContent();

                if (this.textArea && this.textArea.value !== newValue) {
                    this.textArea.value = _(newValue).exists() ? newValue : '';
                }
            }
        }));
    }
);
