/**
 * A paginated Backbone Collection object.
 *
 * Implements a simple paging scheme.
 *
 * If the server provides ETag headers for the pages,
 * then it caches the data and uses jQuery's ifModified
 * support to allow the server to avoid re-sending the data.
 *
 * @author Kevin Perry perry@princeton.edu
 * @license MIT
 */
define(
    ['underscore', './core', './Collection'],
    function (_, $$)
    {
        var etagCache = {};

        var checkCache = function (data, status, options) {
            var etag = options.xhr.getResponseHeader('ETag');

            if (status === 'notmodified' && etagCache[etag]) {
                console.log('using cached etag '+etag);
                data = etagCache[etag];
                this.set(data, this.refreshOptions);
            } else if (etag) {
                console.log('caching etag '+etag);
                etagCache[etag] = data;
            } else { // debugging...
                if (status === 'notmodified') {
                    console.log('not modified; no etag');
                } else {
                    console.log('normal success '+etag);
                }
            }
        };

        return ($$.PagedCollection = $$.Collection.extend({
            options: {
                // Name of the property in params that acts as the "page start" value.
                start: 'start',

                // Name of the property in params that acts as the "page end" value.
                end: 'end',

                // Whether to start counting items at 0 or 1.
                base1: false,

                // URL parameters for refresh.
                params: {start: 0, end: 9, count: 10},

                // Force ifModified=true.
                refreshOptions: {ifModified: true}
            },

            initialize: function (model, options) {
                $$.Collection.prototype.initialize.apply(this, arguments);

                this.options = _({}).extend(this.options, options);
                this.params = _.clone(this.options.params);

                var success = this.options.refreshOptions.success;

                // This gets called with (Collection, models, options)
                this.options.refreshOptions.success = function (data, status, options) {
                    if (status === 'notmodified') {
                        checkCache.apply(this, arguments);
                    }

                    if (success) {
                        success.apply(this, arguments);
                    }
                };
            },

            firstPage: function (size) {
                this.setPage(this.base1 ? 1 : 0, size);
            },

            nextPage: function (size) {
                this.setPage(this.params[this.options.end] + 1, size);
            },

            previousPage: function (size) {
                var start;
                var p = this.params;
                var base = (this.base1 ? 1 : 0);

                size = (size > 0 ? size : (p[this.options.end] - p[this.options.start] + 1));
                start = (p[this.options.start] <= size + base ? base : p[this.options.start] - size);

                this.setPage(start, size);
            },

            setPage: function (start, size) {
                var p = this.params;

                size = (size > 0 ? size : (p[this.options.end] - p[this.options.start] + 1));
                p[this.options.start] = (start > base1 ? start : base1);
                p[this.options.end] = start + size - 1;
                p[this.options.count] = size;
                this.refresh();
            }
        }));
    }
);
