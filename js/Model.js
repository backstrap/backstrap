/**
 * A generic Backbone Model object, with extensions.
 * 
 * @author Kevin Perry perry@princeton.edu
 * @license MIT
 */
(function(context, moduleName, requirements)
{
    var fn = function($$, Backbone)
    {
        return ($$[moduleName] = Backbone.Model.extend({
            options: {
              // Whether the Model should automatically refresh at regular intervals.
              autoRefresh: false,
              // fetch() options for autoRefresh
              autoRefreshOptions: null
            },
    
            initialize: function(options) {
                Backbone.Model.prototype.initialize.call(this, options);
                if(this.options.autoRefresh) {
                  this.resumeAutoRefresh();
                }
                if (this.options.autoRefreshOptions) {
                    this.autoRefreshOptions = this.options.autoRefreshOptions;
                    this.autoRefreshOptions.ifModified = true;
                } else {
                    this.autoRefreshOptions = {ifModified: true};
                }
            },
        
            pauseAutoRefresh: function () {
                  $$.dispatcher.stopRefresh(this);
            },
    
            resumeAutoRefresh: function () {
                  $$.dispatcher.startRefresh(this);
            },
    
            refresh: function () {
                this.fetch({ifModified: true});
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
        if (typeof context.Backbone.Model !== 'function') {
            throw new Error('Backbone not loaded');
        }
        fn(context.$$, context.Backbone);
    }
}(this, 'Model', [ 'backstrap', 'backbone', 'backstrap/dispatcher' ]));
