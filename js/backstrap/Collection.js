/**
 * A generic Backbone Collection object, with extensions.
 * 
 * @author Kevin Perry perry@princeton.edu
 * @copyright 2014 The Trustees of Princeton University.
 * @license MIT
 */
(function(context, moduleName, requirements) {
    var fn = function($$, Backbone)
    {
        return ($$[moduleName] = Backbone.Collection.extend({
            options: {
              // Whether the Collection should automatically refresh at regular intervals.
              autoRefresh: false
            },
    
            initialize: function(model, options) {
                // NOOP Backbone.Collection.prototype.initialize.call(this, model, options);
                this.options = this.options ? _({}).extend(this.options, options) : options;
                if (this.options.autoRefresh) {
                  $$.dispatcher.startRefresh(this);
                }  
            },
        
            pauseAutoRefresh: function () {
                  $$.dispatcher.stopRefresh(this);
            },
    
            resumeAutoRefresh: function () {
                  $$.dispatcher.startRefresh(this);
            },
    
            refresh: function () {
                this.fetch();
            }
    
        }));
    };

    if (typeof context.define === 'function' && context.define.amd
            && !context._$$_backstrap_built_flag) {
        context.define('backstrap/' + moduleName, requirements, fn);
    } else if (typeof context.module === 'object'
            && typeof context.module.exports === 'object') {
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
        if (typeof context.Backbone !== 'function') {
            throw new Error('Backbone not loaded');
        }
        fn(context.$$, context.Backbone);
    }
}(this, 'Collection', [ 'backstrap', 'backbone', 'backstrap/dispatcher' ]
));

