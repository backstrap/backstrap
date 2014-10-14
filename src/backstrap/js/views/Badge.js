/**
 * A model-bound Bootstrap badge object.
 *
 * Use model and content options to set the content of the badge.
 * 
 * @author Kevin Perry perry@princeton.edu
 * @license MIT
 * 
 */
(function(context, moduleName, requirements)
{
    var fn = function($$)
    {
        return ($$[moduleName] = $$.views[moduleName] = $$.View.extend({
            tagName: 'span',
    
            initialize : function(options) {
                $$.View.prototype.initialize.call(this, options);
                this.mixin([$$.mixins.HasModel]);
                _(this).bindAll('render');
                this.$el.addClass('badge');
            },
    
            render : function() {
                var content = this.resolveContent();
                this._observeModel(this.render);
                this.$el.text(content);
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
}(this, 'Badge', [ 'backstrap', 'backstrap/View', 'backstrap/mixins/HasModel' ]));
