/**
 * A Backbone View that displays model-bound content with Bootstrap decoration.
 * 
 * @author Kevin Perry perry@princeton.edu
 * @license MIT
 */
define(
    "backstrap/views/Span",
    [
        "../core", "underscore", "../View", "../mixins/HasGlyph", "../mixins/HasModel"
    ], function ($$, _)
{
    return ($$.Span = $$.views.Span = $$.View.extend({
        options : {
            size: 'default',
            context: 'default'
        },

        tagName : 'span',

        initialize : function(options) {
            $$.View.prototype.initialize.call(this, options);
            this.mixin([$$.mixins.HasModel, $$.mixins.HasGlyph]);
            _(this).bindAll('render');
            this.$el.addClass('text-' + $$._mapSize(this.options.size));
            if (this.options.size !== this.options.context) {
                this.$el.addClass(' text-' + this.options.context);
            }
        },

        render : function() {
            var content = this.resolveContent();

            this._observeModel(this.render);

            this.$el.empty();

            var glyphLeftClassName = this.resolveGlyph(this.model, this.options.glyphLeftClassName);
            var glyphRightClassName = this.resolveGlyph(this.model, this.options.glyphRightClassName);

            this.insertGlyphLayout(glyphLeftClassName, glyphRightClassName, document.createTextNode(content), this.el);

            return this;
        }
    }));
});
