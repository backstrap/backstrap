/**
 * A generic Backbone Collection object, with extensions.
 * 
 * @license MIT
 */
(function(context){
  var fn = function($$, dispatcher, Backbone) {

    return ($$.Collection = Backbone.Collection.extend({
        options: {
          // Whether the Collection should automatically refresh at regular intervals.
          autoRefresh: false
        },

        initialize: function(model, options) {
            // NOOP Backbone.Collection.prototype.initialize.call(this, model, options);
            this.options = this.options ? _({}).extend(this.options, options) : options;
            if (this.options.autoRefresh) {
              dispatcher.startRefresh(this);
            }  
        },
    
        pauseAutoRefresh: function () {
              dispatcher.stopRefresh(this);
        },

        resumeAutoRefresh: function () {
              dispatcher.startRefresh(this);
        },

        refresh: function () {
            this.fetch();
        }

    }));
  };

    if (typeof context.define === "function" && context.define.amd &&
            typeof context._$$_backstrap_built_flag === 'undefined') {
        define("backstrap/Collection", ["backstrap", "backstrap/dispatcher", "backbone"], function ($$) {
            return fn($$);
        });
    } else if (typeof context.module === "object" && typeof context.module.exports === "object") {
        module.exports = fn(require("backstrap"), require('backstrap/dispatcher'), require('Backbone'));
    } else {
        if (typeof context.$$ !== 'function') throw new Error('Backstrap environment not loaded');
        if (typeof context.$$.dispatcher !== 'object') throw new Error('Backstrap dispatcher not loaded');
        if (typeof context.Backbone.View === 'undefined') throw new Error('Backbone environment not loaded');
        fn(context.$$, context.$$.dispatcher, context.Backbone);
    }
}(this));


