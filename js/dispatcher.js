/**
 * Dispatcher extends Backbone.Events to provide
 * an automatic refresh service for Collections.
 * 
 * @author Kevin Perry perry@princeton.edu
 */
(function(context, moduleName, requirements)
{
    var fn = function($$, $)
    {
        var defaults = {
                minInterval: 10,
                maxInterval: 1000,
                decayFrequency: 6,
                decayFactor: 2
        };
        var dispatcher = defaults;
        var activeInterval = defaults.minInterval;
        var timeout = null;
        var lastRefresh = 99999999999999;
        var touchTime = (new Date()).getTime();

        var touch = function () {
            touchTime = (new Date()).getTime();
            if ((touchTime - lastRefresh)/1000 > dispatcher.minInterval) {
                activeInterval = dispatcher.minInterval;
                doRefresh();
            }
        };

        var doRefresh = null;
        
        doRefresh = function doRefresh() {
            if (!(dispatcher.minInterval > 0)) {
                console.log('$$.dispatcher.minInterval must be positive');
                return;
            }
            if (!(dispatcher.maxInterval >= dispatcher.minInterval)) {
                console.log('$$.dispatcher.maxInterval must be >= than minInterval');
                return;
            }
            if (!(dispatcher.decayFrequency >= 1 && dispatcher.decayFactor >= 1)) {
                console.log('$$.dispatcher decay parameters must be >= 1');
                return;
            }
            if (activeInterval < dispatcher.minInterval) {
                activeInterval = dispatcher.minInterval;
            }
            if (((new Date()).getTime() - touchTime)/1000 > activeInterval * dispatcher.decayFrequency
                    && activeInterval < dispatcher.maxInterval) {
                activeInterval = Math.min(activeInterval * dispatcher.decayFactor, dispatcher.maxInterval);
            }
            if (timeout) {
                clearTimeout(timeout);
            }
            timeout = setTimeout(doRefresh, activeInterval*1000);
            lastRefresh = (new Date()).getTime();
            dispatcher.trigger('refresh');
        };

        dispatcher = _.extend({
            minInterval: defaults.minInterval,
            maxInterval: defaults.maxInterval,
            decayFrequency: defaults.decayFrequency,
            decayFactor: defaults.decayFactor,

            refresh: function () {
                console.log('refresh!');
            },

            /* Not normally used, but can be called OOB. */
            refreshMe: function () {
                lastRefresh = (new Date()).getTime();
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

        return ($$[moduleName] = dispatcher);
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
        if (typeof context.$ !== 'function') {
            throw new Error('jQuery environment not loaded');
        }
        fn(context.$$, context.$);
    }
}(this, 'dispatcher', ['backstrap', 'jquery', 'backstrap/Events']));
