/**
 * A Backbone View that displays a model-bound label
 * with Bootstrap decoration.
 *
 * @author Kevin Perry perry@princeton.edu
 * @license MIT
 */
define(
    'backstrap/views/Label',
    ['../core', 'underscore', '../View'],
    function ($$, _) {
        return ($$.Label = $$.views.Label = $$.View.extend({
            options: {
                emptyContent: '',
                bootstrap: 'label',
                name: null
            },

            tagName: 'label',

            initialize: function (options) {
                $$.View.prototype.initialize.call(this, options);
                this.mixin([$$.mixins.HasModel]);

                this.$el.addClass('label');

                if (this.options.name) {
                    this.$el.addClass(this.options.name);
                }
            },

            render: function () {
                var labelText = this.resolveContent(this.model, this.options.labelContent) || this.options.labelContent;

                // if the label is undefined use the emptyContent option
                if (labelText === undefined) {
                    labelText = this.options.emptyContent;
                }

                this._observeModel(_.bind(this.render, this));
                this.$el.empty();
                this.el.appendChild(document.createTextNode(labelText));

                return this;
            }
        }));
    }
);
