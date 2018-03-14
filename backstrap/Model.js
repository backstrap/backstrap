/**
 * A generic Backbone Model object, with extensions.
 *
 * Implements autoRefresh, localCache and mixin extensions.
 *
 * @author Kevin Perry perry@princeton.edu
 * @license MIT
 */
define(
    ['underscore', 'jquery', 'backbone', './core', './dispatcher'],
    function (_, $, Backbone, $$)
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

            initialize: function (attrs, options) {
                options = _.extend({}, this.options, options);
                Backbone.Model.prototype.initialize.call(this, attrs, options);

                this.options = options;
                this.refreshOptions = this.options.refreshOptions;
                this.params = this.options.params;
                this.attrModels = {};

                if (this.options.localCache) {
                    this.options.localCache.attach(this);
                }

                if (this.options.autoRefresh) {
                  $$.dispatcher.startRefresh(this);
                }
            },

            destroy: function (options) {
                // Make the default return type be text, since we normally expect no data back.
                // Otherwise, Backbone attempts to JSON decode the empty string and throws an error.
                Backbone.Model.prototype.destroy.call(this, $.extend({dataType: 'text'}, options));
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
            },

            getModel: function (name, modelClass) {
                var model = this.attrModels[name];

                if (!model && _.isObject(this.get(name))) {
                    model = this.attrModels[name] = new (modelClass||$$.Model)(this.get(name));
                    model.listenTo(this, 'change:' + name, function (myself, value) {
                        model.set(value);
                    });
                    this.listenTo(model, 'change', function (model) {
                        this.set(name, _.clone(model.attributes));
                    });
                }

                return model;
            },

            getCollection: function (name, options, collectionClass) {
                var model = this.attrModels[name];

                if (!model && _.isArray(this.get(name))) {
                    model = this.attrModels[name] = new (collectionClass||$$.Collection)(this.get(name), options);
                    model.listenTo(this, 'change:' + name, function (myself, value, options) {
                        if (!options.internalCollectionUpdate) {
                            console.log('this-change');
                            model.set(value, {internalCollectionUpdate: true});
                        }
                    });
                    this.listenTo(model, 'update change', function (model, options) {
                        if (!options.internalCollectionUpdate) {
                            console.log('model-update');
                            this.set(name, model.models.map(function (m) { return _.clone(m.attributes); }), {internalCollectionUpdate: true});
                        }
                    });
                }

                return model;
            }
        }));
    }
);
