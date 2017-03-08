/**
 * A Backbone View that displays a Bootstrap contextually-colored glyphicon glyph.
 * Chooses one of two glyphs based on whether content is equal to "onValue".
 * 
 * @author Kevin Perry perry@princeton.edu
 * @license MIT
 */
define(
    "backstrap/views/OnOffGlyph",
    [
        "../core", "jquery", "underscore", "../View", "../mixins/HasModel"
    ], function ($$, $, _)
{
    return ($$.OnOffGlyph = $$.views.OnOffGlyph = $$.View.extend({
        options : {
            content: false,
            background: false,
            onValue: true,
            onContext: 'default',
            offContext: 'default',
            onContent: 'ok',
            offContent: 'none',
        },
        content: false,

        initialize : function(options) {
            options.tagName = 'span';
            $$.View.prototype.initialize.call(this, options);
            this.mixin([$$.mixins.HasModel]);
            _(this).bindAll('render');
            var prefix = this.options.background ? 'bg-' : 'text-';
            this.contextClasses = prefix + this.options.onContext + ' ' + prefix + this.options.offContext;
            this.contentClasses = 'glyphicon-' + this.options.onContent + ' glyphicon-' + this.options.offContent;
            this.$glyph = $($$.glyph(this.options.offContent));
            this.$el.append(this.$glyph).addClass(prefix + this.options.offContext);
        },

        render : function() {
            var value = (this.options.onValue === this.resolveContent(this.options.model, this.options.content, this.content));

            this._observeModel(this.render);

            if (value !== this.content) {
                this.$el.toggleClass(this.contextClasses);
                this.$glyph.toggleClass(this.contentClasses);
                this.content = value;
            }
            return this;
        }
    }));
});
