/**
 * A Backbone View that displays an un-editable model-bound text field.
 *
 * @author Kevin Perry perry@princeton.edu
 * @copyright 2015
 * @license MIT
 */
define(
    'backstrap/views/StaticField',
    [
        '../core', 'jquery', 'underscore', '../View',
        '../mixins/HasModel', '../mixins/HasGlyph', '../mixins/HasFormLabel'
    ], function ($$, $, _) {
        return ($$.StaticField = $$.views.StaticField = $$.View.extend({
            options: {
                formatter: _.identity
            },

            initialize: function (options) {
                $$.View.prototype.initialize.call(this, options);
                this.mixin([$$.mixins.HasModel, $$.mixins.HasGlyph, $$.mixins.HasFormLabel]);

                this.$el.addClass('static_field form-group');

                _(this).bindAll('refreshValue');
                this._observeModel(this.refreshValue);
            },

            render: function () {
                this.refreshValue();

                this.$el.empty().append(
                    this.getFormLabel(),
                    $$.div({className: 'text_wrapper'},
                        this.$elContent = $($$.span())
                    )
                );
                this.wrapWithGlyphs(this.$elContent);

                return this;
            },

            refreshValue: function () {
                this.$elContent.text($.trim(this.options.formatter(this.resolveContent())));
            }
        }));
    }
);
