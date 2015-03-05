/**
 * A generic Backbone Model object, with extensions.
 * 
 * Implements autoRefresh, localCache and mixin extensions.
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
                // LocalCache object for caching data in localStorage.
                // To use, declare as "localCache: new LocalCache('objectId')".
                localCache: null,
                
                // Whether the Model should automatically refresh at regular intervals.
                autoRefresh: false,
                
                // Fetch options for refresh.
                refreshOptions: {},
                
                // URL params for refresh.
                params: {}
            },
    
            initialize: function(options) {
                this.options = this.options ? _({}).extend(this.options, options) : options;
                Backbone.Model.prototype.initialize.call(this, options);

                this.refreshOptions = this.options.refreshOptions;
                this.params = this.options.params;

                if (this.options.localCache) {
                    this.options.localCache.attach(this);
                }

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
                // Enforce ifModified: true; layer params on top of refreshOptions.data.
                var opts = _({}).extend(this.refreshOptions, { ifModified: true });
                opts.data = _.extend(opts.data ? _.clone(opts.data) : {}, this.params);
                this.fetch(opts);
            },
            
            mixin: function (objects) {
                var options = _(this.options).clone();

                _(objects).each(function (object) {
                    $.extend(true, this, object);
                }, this);

                $.extend(true, this.options, options);
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
