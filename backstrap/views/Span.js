/**
 * A Backbone View that displays model-bound content with Bootstrap decoration.
 *
 * @author Kevin Perry perry@princeton.edu
 * @license MIT
 */
define(
    'backstrap/views/Span',
    ['../core', './Tag', '../mixins/HasGlyph'],
    function ($$) {
        return ($$.Span = $$.views.Span = $$.Tag.extend({
            tagName: 'span',

            initialize: function (options) {
                $$.Tag.prototype.initialize.call(this, options);
                this.mixin([$$.mixins.HasGlyph]);
            },

            render: function () {
                $$.Tag.prototype.render.call(this);
                this.wrapWithGlyphs(this.$el.children());

                return this;
            }
        }));
    }
);
