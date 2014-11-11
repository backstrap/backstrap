/**
 * Model-bound Mobiscroll widgets.
 *
 * options should look like this:
 * {
 *     model: new $$.Model(),
 *     content: 'fieldName',
 *     format: 'MM-DD-YYYY hh:mm a', // date display format (?)
 *     mobiscroll: { < mobiscroll options > }
 * }
 * 
 * @author Kevin Perry perry@princeton.edu
 * @license MIT
 * 
 */
(function(context, moduleName, requirements)
{
    var fn = function($$)
    {
        // These two functions use special formats 'u' for milliseconds, 'U' for Unix seconds, and 'T' for Date.
        // Other formats will be interpreted by moment() for string IO.
        var millisForValue = function (value, format) {
            if (typeof value === 'number' ) {
                if (format !== 'u' && (value < 31500000000 || format === 'U')) {
                    return value * 1000;
                } else {
                    return value;
                }
            } else {
                return moment(value, format).valueOf();
            }
        };
        
        var valueForMillis = function (millis, format) {
            if (format === 'u') {
                return millis;
            } else if (format === 'U') {
                return millis / 1000;
            } else if (format === 'T') {
                return new Date(millis);
            } else {
                return moment(millis).format(format);
            }
        };
        
        var refresh = function() {
            var newValue = this.resolveContent();
            if (valueForMillis(this.$el.mobiscroll('getDate').valueOf(), this.options.format) !== newValue) {
                this.$el.mobiscroll('setDate', _(newValue).exists() ?
                    new Date(millisForValue(newValue, this.options.format)) :
                    new Date(), true);
            }
        };

        var onSelect = function (value, inst) {
            _(this.model).setProperty(
                this.options.content,
                valueForMillis(this.$el.mobiscroll('getDate').valueOf(), this.options.format)
            );
            if (this.options.mobiscroll.onSelect) {
                this.options.mobiscroll.onSelect(value, inst);
            }
        };

        return ($$[moduleName] = $$.views[moduleName] = $$.View.extend({
            el: $$.input(),
    
            initialize : function(options) {
                $$.View.prototype.initialize.call(this, options);
                this.options.format = this.options.format ? this.options.format : 'U';
                this.mixin([$$.mixins.HasModel]);
                _(this).bindAll('render');
                this._observeModel(_.bind(refresh, this));
            },
    
            render : function() {
                var content = this.resolveContent();
                var inputOpts = _.extend(
                    { preset: 'datetime', theme: 'mobiscroll' }, // defaults
                    this.options.mobiscroll ? this.options.mobiscroll : { },
                    { onSelect: _.bind(onSelect, this) } // overrides
                );
console.log(inputOpts);
                this.$el.mobiscroll(inputOpts);
                this.$el.mobiscroll('setDate', new Date(millisForValue(this.resolveContent(), this.options.format)), true);

                return this;
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
}(this, 'DateTime', [ 'backstrap', 'backstrap/View', 'backstrap/mixins/HasModel' ]));
