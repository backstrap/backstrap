/**
 * A Backbone View that displays a Bootstrap contextually-colored span or other tag;
 * context name bound to model data.
 *
 * @author Kevin Perry perry@princeton.edu
 * @license MIT
 */
define(
    'backstrap/views/Context',
    ['../core', 'underscore', '../View', '../mixins/HasModel'],
    function ($$, _) {
        return ($$.Context = $$.views.Context = $$.View.extend({
            options: {
                tagName: 'span',
                content: 'context',
                background: false,
                formatter: _.identity
            },

            initialize: function (options) {
                $$.View.prototype.initialize.call(this, options);
                this.mixin([$$.mixins.HasModel]);
                _(this).bindAll('render');
                this.prefix = this.options.background ? 'bg-' : 'text-';
            },

            render: function () {
                var contextName = this.options.formatter(this.resolveContent(this.options.model, this.options.contentMap));
                this._observeModel(this.render);
                this.$el.removeClass(this.prefix + this.context).addClass(this.prefix + contextName);
                return this;
            }
        }));
    }
);
