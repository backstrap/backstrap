/**
 * A generic Backbone Model object, with extensions.
 * 
 * Implements autoRefresh, localCache and mixin extensions.
 *
 * @author Kevin Perry perry@princeton.edu
 * @license MIT
 */
define("backstrap/Model", ["./core", "jquery", "underscore", "backbone"], function ($$, $, _, Backbone)
{
    return ($$.Model = Backbone.Model.extend({
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
});
