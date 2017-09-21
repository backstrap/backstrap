/**
 * A Backbone View that displays a tag with a model-bound attribute.
 *
 * @author Kevin Perry perry@princeton.edu
 * @license MIT
 */
define(
    'backstrap/views/AttributeView',
    ['../core', 'underscore', './ContentView'],
    function ($$, _) {
        return ($$.AttributeView = $$.views.AttributeView = $$.ContentView.extend({
            initialize: function () {
                $$.ContentView.prototype.initialize.apply(this, arguments);
                _.extend(this, _.pick(this.options, 'attribute'));
            },

            render: function () {
                $$.ContentView.prototype.render.call(this);
                this.$el.attr(
                    this.attribute,
                    this.resolveContent(this.model, this.options[this.attribute + 'Content'])
                );
                this.$el.append(this.resolveContent());
                return this;
            }
        }));
    }
);
