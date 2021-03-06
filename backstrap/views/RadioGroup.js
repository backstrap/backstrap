/**
 * A Backbone View that displays a model-bound radio-button group
 * with Bootstrap decoration & CSS3 styling for the radiobox.
 *
 * @author Kevin Perry perry@princeton.edu
 * @license MIT
 */
define(
    'backstrap/views/RadioGroup',
    [
        '../core', 'jquery', 'underscore', '../View',
        '../mixins/HasModel', '../mixins/HasAlternativeProperty',
        '../mixins/HasFormLabel', '../mixins/HasError'
    ], function ($$, $, _) {
        return ($$.RadioGroup = $$.views.RadioGroup = $$.View.extend({
            options: {
                // used to group the radio inputs
                content: 'group',

                // enables / disables the radiogroup
                disabled: false,

                // A callback to invoke with the selected item whenever the selection changes
                onChange: $.noop
            },

            selectedItem: null,

            initialize: function (options) {
                $$.View.prototype.initialize.call(this, options);
                this.mixin([$$.mixins.HasModel,
                    $$.mixins.HasAlternativeProperty,
                    $$.mixins.HasFormLabel, $$.mixins.HasError]);
                _(this).bindAll('render', 'updateSelection');

                this.$el.addClass('radio-group');

                if (this.options.name) {
                    this.$el.addClass(this.options.name);
                }
            },

            render: function () {
                var selectedValue;

                this.$el.empty();
                this._observeModel(this.updateSelection);
                this._observeCollection(this.render);
                this.$group = $($$.div({className: 'radio-group-content'}));
                this.selectedItem = this._determineSelectedItem() || this.selectedItem;
                selectedValue = this._valueForItem(this.selectedItem);

                _(this._collectionArray()).each(function(item, idx, list) {
                    var id = _.uniqueId('radio');
                    var val = this._valueForItem(item);
                    var selected = (selectedValue === val);
                    var label = this.resolveContent(item, this.options.altLabelContent);
                    var input = $$.plain.input({
                        id: id,
                        type: 'radio',
                        name: this.options.content,
                        value: val
                    });

                    this.$group.append(
                        $$.plain.label({'for': id, className: 'radio-group-item'},
                            input,
                            $$.div({className: 'radio-group-display'},
                                $$.span({className: 'radio-group-graphic'},
                                    $$.span({className: 'radio-group-interior'})
                                ),
                                $$.span({className: 'radio-group-label'}, label)
                            )
                        )
                    );

                    $(input).attr('checked', selected).prop('checked', selected).on('click change', _.bind(this._updateModel, this, item));
                }, this);

                this.$el.append(this.getFormLabel(), this.$group);
                this.setEnabled(!this.options.disabled);

                return this;
            },

            _updateModel: function (item) {
                var changed = (this.selectedItem !== item);

                this._setSelectedItem(item);

                if (changed && _.isFunction(this.options.onChange)) {
                    this.options.onChange(item);
                }
            },

            updateSelection: function () {
                var item = this._determineSelectedItem();

                if (item) {
                    var value = this._valueForItem(item);

                    this.$group.find('input[value="' + value + '"]').prop('checked', true);
                    this.selectedItem = item;
                }
            },

            setEnabled: function (enabled) {
                this.$el.toggleClass('disabled', !enabled);
            }
        }));
    }
);
