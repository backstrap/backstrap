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
            options: {
                size: 'default',
                context: 'default',
                formatter: _.identity
            },

            initialize: function (options) {
                $$.View.prototype.initialize.call(this, options);
                this.mixin([$$.mixins.HasModel]);
                _(this).bindAll('render');
                this.$el.addClass('text-' + $$._mapSize(this.options.size));

                if (this.options.size !== this.options.context) {
                    this.$el.addClass(' text-' + this.options.context);
                }
            },

            render: function () {
                var content = this.options.formatter(this.resolveContent());

                if (_.isString(content)) {
                    content = document.createTextNode(content);
                }

                this.$el.empty().append(content);
                this._observeModel(this.render);

                return this;
            }
        }));
    }
);
