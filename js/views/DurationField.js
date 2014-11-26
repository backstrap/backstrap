/**
 * Model-bound Mobiscroll widget.
 *
 * options should look like this:
 * {
 *     model: new $$.Model(),
 *     content: 'fieldName',
 *     mobiscroll: { < mobiscroll options > }
 * }
 *
 * DurationField-specific mobiscroll options are:
 * min, max, and step for each of years, months, weeks, days, hours, minutes, seconds, milliseconds
 * (for example, maxYears, minSeconds, stepMinutes.)
 * wheelset, a string consisting of any set of characters from "ymwdhisu"
 *
 * @author Kevin Perry perry@princeton.edu
 * @license MIT
 * 
 */
(function(context, moduleName, requirements)
{
    var fn = function($$)
    {
        var param = {
            y: 'Year',
            m: 'Month',
            w: 'Week',
            d: 'Day',
            h: 'Hour',
            i: 'Minute',
            s: 'Second',
            u: 'Millisecond'
        };

        // NB: year and month assume canonical lengths of 365 and 30 days, respectively!
        var mods = { y: 31536000000, m: 2592000000, w: 604800000, d: 86400000, h: 3600000, i: 60000, s: 1000, u: 1 };

        var seps = { y: ' year', m: ' month', w: ' week', d: ' day', h: '', i: '', s: '', u: '' };
        var pres = { y: ', ', m: ', ', w: ', ', d: ', ', h: ':', i: ':', s: '.', u: '' };

        var refresh = function() {
            var newValue = this.resolveContent();
            var inst = this.$el.mobiscroll('getInst');
            if (inst.settings.toMillis(this.$el.mobiscroll('getValue')) !== newValue) {
                this.$el.mobiscroll('setValue', inst.settings.fromMillis(_(newValue).exists() ? newValue : 0, this), true);
            }
        };

        var onSelect = function (value, inst) {
            this.model.set(this.options.content, inst.settings.toMillis(this.$el.mobiscroll('getValue')));
            if (this.options.mobiscroll.onSelect) {
                this.options.mobiscroll.onSelect(value, inst);
            }
        };
        
        var units = { y: 0, m: 1, w: 2, d: 3, h: 4, i: 5, s: 6, u: 7 };
        
        var wheelsetSort = function (a, b) {
            return units[a] - units[b];
        };

        return ($$[moduleName] = $$.views[moduleName] = $$.View.extend({
            tagName: 'input',
            className: 'mobiscroll form-control form-control-default',
    
            initialize : function (options) {
                $$.View.prototype.initialize.call(this, options);
                this.mixin([$$.mixins.HasModel]);
                _(this).bindAll('render');
                this._observeModel(_.bind(refresh, this));
            },
    
            render : function () {
                var that = this;
                var wheelset = null;
                var inputOpts = _.extend(
                    // defaults
                    {
                        theme: 'mobiscroll',
                        millisText: 'Milliseconds',
                        secsText: 'Seconds',
                        minsText: 'Minutes',
                        hoursText: 'Hours',
                        daysText: 'Days',
                        weeksText: 'Weeks',
                        monthsText: 'Months',
                        yearsText: 'Years',
                        min: '00:00',
                        max: 31536000000, // ~ 1 year
                        wheelset: 'mdhi'
                    },
                    this.options.mobiscroll ? this.options.mobiscroll : { },
                    // overrides
                    {
                        onSelect: _.bind(onSelect, this),
                        parseValue: function(value, inst) {
                            var result = [];
                            var values = [ 0, 0, 0, 0, 0, 0, 0 ];
                            value.replace(/((\d+) years?, )?((\d+) months?, )?((\d+) weeks?, )?((\d+) days?, )?((\d+):)?((\d+):)?((\d+).)?(\d+)?/, function () {
                                var p = Array.prototype.slice.apply(arguments);
                                values = [ 0, 2, 4, 6, 8, 10, 12, 14 ].map(function (j) {
                                    return p[j] ? parseInt(p[j]) : 0;
                                });
                                return '';
                            });
                            inst.settings.wheelset.split('').forEach(function (w) {
                                if (param[w]) {
                                    result.push(values[units[w]]);
                                }
                            });
                            return result;
                        },
                        formatResult: function (data) {
                            var fallback = '0:00';
                            var n = 0;
                            var pre = '';
                            var result = '';
                            wheelset.split('').sort(wheelsetSort).forEach(function (w) {
                                if (param[w] && data[n] > 0) {
                                    var post = (w.match(/[ymwd]/) && data[n] > 1) ? 's' : '';
                                    result += pre + ((w.match(/[is]/) && data[n]<10) ? '0' : '') + data[n] + seps[w] + post;
                                    pre = pres[w];
                                    n += 1;
                                } else if (w.match(/[hu]/)) {
                                    result += pre + '0';
                                    pre = pres[w];
                                    n += 1;
                                } else if (w.match(/[is]/)) {
                                    result += pre + '00';
                                    pre = pres[w];
                                    n += 1;
                                } else {
                                    if (param[w]) {
                                        n += 1;
                                    }
                                    pre = '';
                                    fallback = '0 '+ seps[w] + 's';
                                }
                            });
                            return result || fallback;
                        },
                        fromMillis: function(value, inst) {
                            var result = [];
                            value = parseInt(value);
                            inst.settings.wheelset.split('').sort(wheelsetSort).forEach(function (w) {
                                if (param[w]) {
                                    result.push(Math.floor(value / mods[w]));
                                    value %= mods[w];
                                }
                            });
                            return result;
                        },
                        toMillis: function(data) {
                            var n = 0;
                            var result = 0;
                            wheelset.split('').forEach(function (w) {
                                if (param[w]) {
                                    result += data[n] * mods[w];
                                    n += 1;
                                }
                            });
                            return ''+result;
                        }/*,
                        validate: function (dw, i, time) {
                           var t = $('.dw-ul', dw);
                           $.each(that.options.mobiscroll.invalid, function (i, v) {
                               $('.dw-li[data-val="' + v + '"]', t).removeClass('dw-v');
                           });
                        }*/
                    }
                );

                wheelset = inputOpts.wheelset;
                inputOpts.wheels = inputOpts.wheels ? inputOpts.wheels : this.makewheels(inputOpts);

                this.$el.mobiscroll(inputOpts);
                var inst = this.$el.mobiscroll('getInst');
                this.$el.mobiscroll('setValue', inst.settings.fromMillis(this.resolveContent(), inst), true);

                return this;
            },

            makewheels: function (opts) {
                var group = [];
                var labels = {
                    y: opts.yearsText,
                    m: opts.monthsText,
                    w: opts.weeksText,
                    d: opts.daysText,
                    h: opts.hoursText,
                    i: opts.minsText,
                    s: opts.secsText,
                    u: opts.millisText
                };
                var maxs = { y: 100, m: 11, w: 4, d: 6, h: 23, i: 59, s: 59 };
                
                opts.wheelset.split('').forEach(function (w, n) {
                    if (param[w]) {
                        var values = [];
                        var max = opts['max'+param[w]+'s'] ? opts['max'+param[w]+'s'] : (n ? maxs[w] : 100);
                        var min = opts['min'+param[w]+'s'] ? opts['min'+param[w]+'s'] : 0;
                        var step = opts['step'+param[w]+'s'] ? opts['step'+param[w]+'s'] : 1;
                        for (var v = min; v <= max; v += step) {
                            values.push(v);
                        }
                        group.push({ values: values, label: labels[w] });
                    }
                });

                return [ group ];
            },
            
            mobiscroll: function () {
                var result = this.$el.mobiscroll.apply(this.$el, arguments);
                return (result === this.$el) ? this : result;
            }
        }));
    };

    if (typeof context.define === 'function'
        && context.define.amd
        && !context._$$_backstrap_built_flag
    ) {
        context.define('backstrap/views/' + moduleName, requirements, fn);
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
        fn(context.$$);
    }
}(this, 'DurationField', [ 'backstrap', 'backstrap/View', 'backstrap/mixins/HasModel' ]));
