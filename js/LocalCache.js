/**
 * Stores a copy of Collection data in localStorage without interrupting the normal sync().
 * 
 * To cache data in the localCache object,
 * the Collection should set its sync() method to
 * the function returned by localCache.getSync().
 * On initialization, the Collection may pre-load the saved data
 * from a previous incarnation using
 * collection.reset(collection.localCache.load()) 
 * All the above may be accomplished by calling localCache.attach().
 * 
 * @author Kevin Perry perry@princeton.edu
 */
(function(context, moduleName, requirements)
{
    var fn = function($$, Backbone)
    {
         function extend(obj, props) {
           for (var key in props) obj[key] = props[key];
           return obj;
         }

        // Our Store is represented by a single JS object in *localStorage*.
        // Create it with a meaningful name.
        $$[moduleName] = function(name, serializer) {
            if ( !this.localStorage ) {
                throw moduleName + ': Environment does not support localStorage.';
            }
            this.name = name;
            this.serializer = serializer || {
                serialize: function(item) {
                  return JSON.stringify(item);
                },
                deserialize: function (data) {
                  return data ? JSON.parse(data) : [];
                }
            };
        };

        extend($$[moduleName].prototype, {
            localStorage: function () {
                return localStorage;
            },

            attach: function(collection) {
                collection.reset(this.load());
                collection._$$sync = collection.sync;
                console.log('attaching');
                collection.sync = this.getSync();
            },

            detach: function(collection) {
                if (collection._$$sync) {
                    collection.sync = collection._$$sync;
                    delete(collection._$$sync);
                }
            },

            // Save the array of models to localStorage.
            save: function (models) {
                console.log('save');
                console.log(models);
                this.localStorage().setItem(this.name, this.serializer.serialize(models));
            },

            // Return the array of models currently in localStorage.
            load: function () {
                console.log(this.name);
                return this.serializer.deserialize(this.localStorage().getItem(this.name));
            },

            getSync: function () {
                var localCache = this;
                return function(method, collection, options) {
                    console.log('sync: ' + method);
                    if (method == 'read') {
                        options = options ? _.clone(options) : {};
                        var success = options.success;
                        options.success = function (resp) {
                            if (success) success(resp);
                            localCache.save(collection.models);
                        };
                    }
                    return (this._$$sync ? this._$$sync : Backbone.sync).call(this, method, this, options);
                };
            }
        });

        return $$[moduleName];
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
}(this, 'LocalCache', [ 'backstrap', 'backbone' ]));
