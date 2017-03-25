/**
 * A Backbone View that displays a model-bound file input
 * with Bootstrap decoration.
 * 
 * @author Kevin Perry perry@princeton.edu
 * @license MIT
 */
define(
    "backstrap/views/FileInput",
    [
        "../core", "jquery", "underscore", "../View",
        "../mixins/HasModel", "../mixins/HasFormLabel", "../mixins/HasGlyph",
    ], function ($$, $, _)
{
    return ($$.FileInput = $$.views.FileInput = $$.View.extend({
        options: {
            // the value to use for both the name and id attribute 
            // of the underlying input element
            name: null,

            // disables the input
            disabled: false,

            // the tab index to set on the underlying input field
            tabIndex: null,

            // whether to allow multiple-selection or not
            multiple: false,

            // File object validation checks - defaults to not checking anything.
            // Each file object will be validated using these settings
            // before it is read and loaded into the model.
            typeMatch: null,
            nameMatch: null,
            maxSize: 0
        },

        initialize: function (options) {
            $$.View.prototype.initialize.call(this, options);

            this.mixin([$$.mixins.HasModel, $$.mixins.HasFormLabel, $$.mixins.HasGlyph,
                $$.mixins.HasError, $$.mixins.HasFocus]);

            _(this).bindAll('_updateModel');
            this.$el.addClass('form-group');

            if (this.options.name){
                this.$el.addClass(this.options.name);
            }

            this.input = $$.input();
            $(this.input).removeClass('form-control form-control-default').change(this._updateModel);
        },

        render: function () {
            if (this._parent) {
                $(this._parent).detach();
            }
            this.$el.empty();
    
            $(this.input).attr({
                id: this.options.name,
                type: 'file',
                name: this.options.name,
                tabIndex: this.options.tabIndex,
                multiple: this.options.multiple ? 'multiple' : null
            }).val('');

            // insert glyph if exist
            this._parent = $$.div({className: 'file_wrapper'});
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

        // sets the enabled state
        setEnabled: function (enabled) {
            if (enabled) {
                this.$el.removeClass('disabled');
            } else {
                this.$el.addClass('disabled');
            }

            this.input.disabled = !enabled;
        },

        validationFailure: function (message) {
            alert(message);
        },

        validate: function (file) {
            if (this.options.maxSize && file.size > this.options.maxSize) {
                return 'file size exceeds allowed maximum of ' + file.size + ' bytes';
            }
            if (this.options.typeMatch && !file.type.match(this.options.typeMatch)) {
                return 'file type ' + file.type + ' not allowed';
            }
            if (this.options.nameMatch && !file.name.match(this.options.nameMatch)) {
                return 'file name does not match allowed pattern';
            }
        },

        _updateModel: function () {
            if (this.input && this.input.files && this.input.files.length > 0) {
                var reader = new FileReader();

                _.each(this.input.files, function (file, index) {
                    var error = this.validate(file);

                    if (error) {
                        this.validationFailure('Invalid file: ' + file.name + ': ' + error);
                    } else {
                        var that = this;

                        reader.addEventListener('load', function () {
                            var value;

                            if (that.options.multiple) {
                                value =  _.clone(that.model.get(that.options.content));
                                value[index] = this.result;
                            } else {
                                value = this.result;
                            }

                            _(that.model).setProperty(that.options.content, value);
                        }, false);

                        reader.readAsDataURL(file);
                    }
                }, this);
            }
        }
    }));
});
