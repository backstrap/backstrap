/**
 * A Backbone View that displays model-bound content with Bootstrap decoration.
 * 
 * @author Kevin Perry perry@princeton.edu
 * @license MIT
 */
(function(context, moduleName, requirements)
{
    var fn = function($$)
    {
        return ($$[moduleName] = $$.views[moduleName] = $$.View.extend({
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

                this.insertGlyphLayout(glyphLeftClassName, glyphRightClassName, content, this.el);

                return this;
            }
        }));
    };

    if (typeof context.define === 'function'
        && context.define.amd
        && !context._$$_backstrap_built_flag
    ) {
        context.define('backstrap/views/' + moduleName, requirements, fn);
    } else if (typeof context.module === 'object'
        && typeof context.module.exports === 'object'
    ) {
        context.module.exports = fn.call(requirements.map(
            function (reqName)
            {
                return require(reqName);
            }
        ));
    } else {
        if (typeof context.$$ !== 'function') {
            throw new Error('Backstrap not loaded');
        }
        fn(context.$$);
    }
}(this, 'Span', [
    'backstrap',
    'backstrap/View',
    'backstrap/mixins/HasModel',
    'backstrap/mixins/HasGlyph'
]));
