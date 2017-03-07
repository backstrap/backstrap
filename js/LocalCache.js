/**
 * Stores a copy of Backbone Collection or Model data
 * in localStorage without interrupting the normal sync() processing.
 *
 * To cache/retrieve data in the localCache object,
 * the Collection or Model should call localCache.attach().
 *
 * @author Kevin Perry perry@princeton.edu
 */
define("backstrap/LocalCache", ["./core", "underscore", "backbone"], function ($$, _, Backbone)
{
    var extend = function extend(obj, props) {
        for (var key in props) {
            obj[key] = props[key];
        }

        return obj;
    };

    // Our Store is represented by a single JS object in *localStorage*.
    // Create it with a meaningful name.
    $$.LocalCache = function (name, serializer) {
        if ( !this.localStorage ) {
            throw 'LocalCache: Environment does not support localStorage.';
        }

        this.name = name;

        if (serializer) {
            this.serializer = serializer;
        }
    };

    extend($$.LocalCache.prototype, {
        serializer: {
            serialize: function serialize(item) {
                return JSON.stringify(item);
            },

            deserialize: function deserialize(data) {
                return data ? JSON.parse(data) : null;
            }
        },

        localStorage: function () {
            return localStorage;
        },

        attach: function attach(obj) {
            var cached = this.load();

            if ('reset' in obj) {
                obj.reset(cached ? cached : []);
            } else {
                obj.set(cached ? cached : {}, {silent: true});
                obj.trigger('reset', obj);
            }

            obj._$$sync = obj.sync;
            obj.sync = this.getSync();
        },

        saveAttach: function saveAttach(obj) {
            this.save(obj);
            obj._$$sync = obj.sync;
            obj.sync = this.getSync();
        },

        detach: function detach(obj) {
            if (obj._$$sync) {
                obj.sync = obj._$$sync;
                delete(obj._$$sync);
            }
        },

        // Save the object to localStorage.
        save: function save(obj) {
            this.localStorage().setItem(this.name, this.serializer.serialize(obj));
        },

        // Return the data currently in localStorage.
        load: function load() {
            return this.serializer.deserialize(this.localStorage().getItem(this.name));
        },

        getSync: function getSync() {
            var localCache = this;

            return function sync(method, obj, options) {
                if (method == 'read') {
                    options = options ? _.clone(options) : {};
                    var success = options.success;
                    options.success = function success(resp) {
                        if (success) {
                            success(resp);
                        }

                        localCache.save(obj);
                    };
                }

                return (this._$$sync ? this._$$sync : Backbone.sync).call(this, method, this, options);
            };
        }
    });

    return $$.LocalCache;
});
