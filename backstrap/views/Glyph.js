/**
 * A Backbone View that displays a Bootstrap contextually-colored glyphicon glyph.
 * context name bound to model data.
 * 
 * @author Kevin Perry perry@princeton.edu
 * @license MIT
 */
define(
    "backstrap/views/Glyph",
    [
        "../core", "jquery", "underscore", "../View", "../mixins/HasModel"
    ], function ($$, $, _)
{
    return ($$.Glyph = $$.views.Glyph = $$.View.extend({
        options : {
            context: 'default',
            contextMap: null,
            content: 'ok',
            contentMap: null,
            background: false
        },
        context: 'default',
        content: '',

        initialize : function(options) {
            options.tagName = 'span';
            $$.View.prototype.initialize.call(this, options);
            this.mixin([$$.mixins.HasModel]);
            _(this).bindAll('render');
            this.prefix = this.options.background ? 'bg-' : 'text-';
            this.glyph = $$.glyph(this.content);
            this.$el.append(this.glyph);
        },

        render : function() {
            var contextName = this.resolveContent(this.options.model, this.options.context, this.context);
            if (this.options.contextMap && this.options.contextMap[contextName]) {
                contextName = this.options.contextMap[contextName];
            }
            var contentName = this.resolveContent(this.options.model, this.options.content, this.content);
            if (this.options.contentMap && this.options.contentMap[contentName]) {
                contentName = this.options.contentMap[contentName];
            }
            this._observeModel(this.render);
            if (contextName !== this.context) {
                this.$el.removeClass(this.prefix + this.context).addClass(this.prefix + contextName);
                this.context = contextName;
            }
            if (contentName !== this.content) {
                $(this.glyph).removeClass('glyphicon-' + this.content).addClass('glyphicon-' + contentName);
                this.content = contentName;
            }
            return this;
        }
    }));
});
