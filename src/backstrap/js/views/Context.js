/**
 * A Backbone View that displays a Bootstrap contextually-colored span or other tag;
 * context name bound to model data.
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
                tagName: 'span',
                content: 'context',
                background: false
            },
    
            initialize : function(options) {
                $$.View.prototype.initialize.call(this, options);
                this.mixin([$$.mixins.HasModel]);
                _(this).bindAll('render');
                this.prefix = this.options.background ? 'bg-' : 'text-';
            },
    
            render : function() {
                var contextName = this.resolveContent(this.options.model, this.options.contentMap);
                this._observeModel(this.render);
                this.$el.removeClass(this.prefix + this.context).addClass(this.prefix + contextName);
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
}(this, 'Context', [ 'backstrap', 'backstrap/View', 'backstrap/mixins/HasModel' ]));
