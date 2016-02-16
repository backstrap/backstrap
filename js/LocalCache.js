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
     function extend(obj, props) {
       for (var key in props) obj[key] = props[key];
       return obj;
     }

    // Our Store is represented by a single JS object in *localStorage*.
    // Create it with a meaningful name.
    $$.LocalCache = function(name, serializer) {
        if ( !this.localStorage ) {
            throw 'LocalCache: Environment does not support localStorage.';
        }
        this.name = name;
        this.serializer = serializer || {
            serialize: function(item) {
              return JSON.stringify(item);
            },
            deserialize: function (data) {
              return data ? JSON.parse(data) : null;
            }
        };
    };

    extend($$.LocalCache.prototype, {
        localStorage: function () {
            return localStorage;
        },

        attach: function(obj) {
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

        saveAttach: function(obj) {
            this.save(obj);
            obj._$$sync = obj.sync;
            obj.sync = this.getSync();
        },

        detach: function(obj) {
            if (obj._$$sync) {
                obj.sync = obj._$$sync;
                delete(obj._$$sync);
            }
        },

        // Save the object to localStorage.
        save: function (obj) {
            this.localStorage().setItem(this.name, this.serializer.serialize(obj));
        },

        // Return the data currently in localStorage.
        load: function () {
            return this.serializer.deserialize(this.localStorage().getItem(this.name));
        },

        getSync: function () {
            var localCache = this;
            return function(method, obj, options) {
                if (method == 'read') {
                    options = options ? _.clone(options) : {};
                    var success = options.success;
                    options.success = function (resp) {
                        if (success) success(resp);
                        localCache.save(obj);
                    };
                }
                return (this._$$sync ? this._$$sync : Backbone.sync).call(this, method, this, options);
            };
        }
    });

    return $$.LocalCache;
});
