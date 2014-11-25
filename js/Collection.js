/**
 * A generic Backbone Collection object, with extensions.
 *
 * Implements autoRefresh and localCache extensions.
 * 
 * @author Kevin Perry perry@princeton.edu
 * @license MIT
 */
(function(context, moduleName, requirements)
{
    var fn = function($$, Backbone)
    {
        return ($$[moduleName] = Backbone.Collection.extend({
            options: {
              // Whether the Collection should automatically refresh at regular intervals.
              autoRefresh: false,
              // LocalCache object for caching data in localStorage.
              // To use, declare as "localCache: new LocalCache('collectionName')".
              localCache: null,
              // Fetch options for refresh.
              refreshOptions: {},
              // URL params for refresh.
              params: {}
            },

            initialize: function(model, options) {
                this.options = _({}).extend(this.options, options);

                this.refreshOptions = this.options.refreshOptions;
                this.params = _.clone(this.options.params);

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
    
            refresh: function (options) {
                // Default ifModified to true; layer params on top of refreshOptions.data.
                var opts = _({ ifModified: true }).extend(this.refreshOptions, options);
                opts.data = _.extend(opts.data ? _.clone(opts.data) : {}, this.params);
                this.fetch(opts);
            },

            sync: function(method, model, options) {
                var success = options.success;
                options.success = function(resp, status) {
                    if (status !== 'notmodified') {
                        success.apply(null, arguments);
                    }
                };
                return Backbone.sync.apply(this, arguments);
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
        if (typeof context.Backbone.Collection !== 'function') {
            throw new Error('Backbone not loaded');
        }
        fn(context.$$, context.Backbone);
    }
}(this, 'Collection', [ 'backstrap', 'backbone', 'backstrap/dispatcher' ]));
