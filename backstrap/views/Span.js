/**
 * A Backbone View that displays model-bound content with Bootstrap decoration.
 *
 * @author Kevin Perry perry@princeton.edu
 * @license MIT
 */
define(
    'backstrap/views/Span',
    ['../core', './ContentView', '../mixins/HasGlyph'],
    function ($$) {
        return ($$.Span = $$.views.Span = $$.ContentView.extend({
            tagName: 'span',

            initialize: function (options) {
                $$.ContentView.prototype.initialize.call(this, options);
                this.mixin([$$.mixins.HasGlyph]);
            },

            render: function () {
                $$.ContentView.prototype.render.call(this);
                this.wrapWithGlyphs(this.$el.children());

                return this;
            }
        }));
    }
);
