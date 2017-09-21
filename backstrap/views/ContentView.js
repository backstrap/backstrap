/**
 * A Backbone View that displays model-bound content with Bootstrap decoration.
 *
 * @author Kevin Perry perry@princeton.edu
 * @license MIT
 */
define(
    'backstrap/views/ContentView',
    ['../core', 'underscore', '../View', '../mixins/HasModel'],
    function ($$, _) {
        return ($$.ContentView = $$.views.ContentView = $$.View.extend({
            formatter: _.identity,
            options: {
                bootstrap: 'text',
                context: null,
                size: null,
                cols: null
            },

            initialize: function () {
                $$.View.prototype.initialize.apply(this, arguments);
                this.mixin([$$.mixins.HasModel]);
                _.extend(this, _.pick(this.options, 'formatter'));

                if (this.options.context) {
                    this.$el.addClass(this.options.bootstrap + '-' + this.options.context);
                }

                if (this.options.size && this.options.size !== this.options.context) {
                    this.$el.addClass(this.options.bootstrap + '-' + $$._mapSize(this.options.size));
                }

                if (this.options.cols) {
                    // cols may be a single number, array of numbers, or object.
                    // Values should be between 1 and 12.
                    var n = ['xs','sm','md','lg','xl'];
                    var value = this.options.cols;

                    if (_.isArray(value)) {
                        for (var i = 0; i < value.length && i < n.length; i += 1) {
                            this.$el.addClass('col-' + n[i] + '-' + value[i]);
                        }
                    } else if (_.isObject(value)) {
                        _.each(n, function (key) {
                            this.$el.addClass('col-' + key + '-' + value[key]);
                        });
                    } else if (_.isString(value)) {
                        this.$el.addClass('col-xs-' + value);
                    }
                }
            },

            resolveContent: function (model, content, defaultOption) {
                // Follow logic of prototype resolveContent to decide whether it will be using _.map(),
                // in which case we want to apply the formatter instead of calling it.
                defaultOption = (defaultOption === null || _(defaultOption).isUndefined()) ? this.options.content : defaultOption;
                content = _(content).exists() ? content : defaultOption;

                if (_(content).isArray()) {
                    return this.formatter.apply(null,
                        $$.View.prototype.resolveContent.apply(this, arguments)
                    );
                } else {
                    return this.formatter.call(null,
                        $$.View.prototype.resolveContent.apply(this, arguments)
                    );
                }
            }
        }));
    }
);
