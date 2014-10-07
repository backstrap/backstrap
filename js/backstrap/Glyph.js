/**
 * A Backbone View that displays a Bootstrap contextually-colored glyphicon glyph.
 * context name bound to model data.
 * 
 * @author Kevin Perry perry@princeton.edu
 * @copyright 2014 The Trustees of Princeton University.
 * @license MIT
 */
(function(context, moduleName, requirements)
{
    var fn = function($$)
    {
        return ($$[moduleName] = $$.View.extend({
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
                this.mixin([$$.HasModel]);
                _(this).bindAll('render');
                this.prefix = this.options.background ? 'bg-' : 'text-';
                this.glyph = $$.glyph(this.content);
                this.$el.append(this.glyph);
            },
    
            render : function() {
                var contextName = this.resolveContent(this.options.model, this.options.contextMap ? this.options.contextMap : this.options.context);
                var contentName = this.resolveContent(this.options.model, this.options.contentMap);
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
    };

    if (typeof context.define === 'function'
        && context.define.amd
        && !context._$$_backstrap_built_flag
    ) {
        context.define('backstrap/' + moduleName, requirements, fn);
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
}(this, 'Glyph', [ 'backstrap', 'backstrap/View', 'backstrap/HasModel' ]));
