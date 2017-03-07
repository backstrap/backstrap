/**
 * A generic Backbone Collection object, with extensions.
 *
 * Implements autoRefresh, localCache and mixin extensions.
 * 
 * @author Kevin Perry perry@princeton.edu
 * @license MIT
 */
define("backstrap/Collection", ["./core", "jquery", "underscore", "backbone"], function ($$, $, _, Backbone)
{
    // Duplicates Backbone's wrapError() exactly.  Need it in fetch().
    var wrapError = function(model, options) {
        var error = options.error;
        options.error = function(resp) {
            if (error) error(model, resp, options);
            model.trigger('error', model, resp, options);
        };
    };
      
    return ($$.Collection = Backbone.Collection.extend({
        options: {
            // LocalCache object for caching data in localStorage.
            // To use, declare as "localCache: new LocalCache('collectionName')".
            localCache: null,
            
            // Whether the Collection should automatically refresh at regular intervals.
            autoRefresh: false,
          
            // Fetch options for refresh.
            refreshOptions: {},
          
            // URL params for refresh.
            params: {}
        },

        initialize: function(models, options) {
            this.options = this.options ? _({}).extend(this.options, options) : options;

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
        
        /* Override Backbone.Collection.fetch(), to handle 'notmodified' correctly (Backbone issue #3410) */
        fetch: function(options) {
            options = options ? _.clone(options) : {};
            if (options.parse === void 0) options.parse = true;
            var success = options.success;
            var collection = this;
            options.success = function(resp, status) {
                if (status !== 'notmodified') {
                    var method = options.reset ? 'reset' : 'set';
                    collection[method](resp, options);
                }
                if (success) success(collection, resp, options);
                collection.trigger('sync', collection, resp, options);
            };
            wrapError(this, options);
            return this.sync('read', this, options);
          },
          
          mixin: function (objects) {
              var options = _(this.options).clone();

              _(objects).each(function (object) {
                  $.extend(true, this, object);
              }, this);

              $.extend(true, this.options, options);
          }
    }));
});
