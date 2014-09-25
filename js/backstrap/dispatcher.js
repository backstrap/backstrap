(function(context) {
    var fn = function($$, $)
    {
        var timeout = null;
        var activeInterval = 0;
        var lastRefresh = 99999999999;
        var touchTime = (new Date()).getTime();

        var touch = function () {
            console.log('touch');
            touchTime = (new Date()).getTime();
            if (touchTime - lastRefresh > dispatcher.minInterval) {
                activeInterval = dispatcher.minInterval;
                doRefresh();
            }
        };

        var doRefresh = function doRefresh() {
            var now = (new Date()).getTime();
            
            if (activeInterval < dispatcher.minInterval) {
                activeInterval = dispatcher.minInterval;
            }
            if (now - touchTime > activeInterval*dispatcher.decayFrequency && activeInterval < dispatcher.maxInterval) {
                activeInterval = Math.min(activeInterval*dispatcher.decayFactor, dispatcher.maxInterval);
            }
            if (timeout) {
                clearTimeout();
            }
            timeout = setTimeout(doRefresh, activeInterval*1000);
            lastRefresh = (new Date()).getTime();
            dispatcher.trigger('refresh');
        };

        var dispatcher = $$.dispatcher = _.extend({
            minInterval: 10,
            maxInterval: 1000,
            decayFrequency: 4,
            decayFactor: 2,

            refresh: function () {
                console.log('refresh!');
            },

            /* Not normally used, but can be called OOB. */
            refreshMe: function () {
                this.trigger('refresh');
            },

            startRefresh: function (model) {
                model.listenTo(this, 'refresh', model.refresh);
                if (!timeout) {
                    timeout = setTimeout(doRefresh, activeInterval*1000);
                }
            },

            stopRefresh: function (model) {
                model.stopListening(this, 'refresh', model.refresh);
            }
        }, $$.Events);

        $('html').on('click focus touchstart', function () {
            touch();
        });
        
        return dispatcher;
    };

    if (typeof context.define === 'function' && context.define.amd &&
            typeof context._$$_backstrap_built_flag === 'undefined') {
        context.define('backstrap/dispatcher', ['backstrap', 'backbone', 'jquery'], fn);
    } else if (typeof context.module === 'object' && typeof context.module.exports === 'object') {
        context.module.exports = fn(require('backstrap'), require('backbone'), require('jquery'));
    } else {
        if (typeof context.$$ !== 'function') throw new Error('Backstrap environment not loaded');
        if (typeof context.$ !== 'function') throw new Error('jQuery environment not loaded');
        fn(context.$$, context.$);
    }
}(this));
