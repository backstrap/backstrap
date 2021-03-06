/**
 * A Backbone View that displays a Bootstrap contextually-colored span or other tag,
 * where the context name is bound to model data.
 *
 * @author Kevin Perry perry@princeton.edu
 * @license MIT
 */
define(
    'backstrap/views/Context',
    ['../core', 'underscore', '../View'],
    function ($$, _) {
        return ($$.Context = $$.views.Context = $$.View.extend({
            tagName: 'span',

            options: {
                content: 'context',
                background: false,
                contentMap: null
            },

            initialize: function () {
                $$.View.prototype.initialize.apply(this, arguments);
                this.mixin([$$.mixins.HasModel]);
            },

            render: function () {
                var prefix = this.options.background ? 'bg-' : (this.options.bootstrap + '-');
                var contextName = this.resolveContent(this.options.model, this.options.contentMap);
                this._observeModel(_.bind(this.render, this));
                this.$el.removeClass(prefix + this.contextName).addClass(prefix + contextName);
                this.contextName = contextName;
                return this;
            }
        }));
    }
);
