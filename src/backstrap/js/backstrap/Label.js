/**
 * A Backbone View that displays a model-bound label
 * with Bootstrap decoration.
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
                emptyContent : '',
                size: 'default',
                context: 'default'
            },
            
            tagName : 'label',

            initialize : function(options) {
                $$.View.prototype.initialize.call(this, options);
                this.mixin([$$.HasModel]);
                _(this).bindAll('render');
                this.$el.addClass('label label-' + $$._mapSize(this.options.size));
                if (this.options.size !== this.options.context) {
                    this.$el.addClass(' label-' + this.options.context);
                }
                if(this.options.name){
                    this.$el.addClass(this.options.name);
                }

            },

            render : function() {
                var labelText = this.resolveContent(this.model, this.options.labelContent) || this.options.labelContent;
                // if the label is undefined use the emptyContent option
                if(labelText === undefined){
                    labelText = this.options.emptyContent;
                }
                this._observeModel(this.render);

                this.$el.empty();
                
                // insert label
                this.el.appendChild(document.createTextNode(labelText));

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
}(this, 'Label', [ 'backstrap', 'backstrap/View', 'backstrap/HasModel' ]));
