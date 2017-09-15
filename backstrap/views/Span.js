/**
 * A Backbone View that displays model-bound content with Bootstrap decoration.
 *
 * @author Kevin Perry perry@princeton.edu
 * @license MIT
 */
define(
    'backstrap/views/Span',
    ['../core', 'underscore', '../View', '../mixins/HasGlyph', '../mixins/HasModel'],
    function ($$, _) {
        return ($$.Span = $$.views.Span = $$.Div.extend({
            tagName: 'span',

            initialize: function (options) {
                $$.Div.prototype.initialize.call(this, options);
                this.mixin([$$.mixins.HasGlyph]);
            },

            render: function () {
                $$.Div.prototype.render.call(this);
                this.wrapWithGlyphs(this.$el.children());

                return this;
            }
        }));
    }
);
