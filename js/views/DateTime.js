/**
 * Model-bound Mobiscroll widget.
 *
 * options should look like this:
 * {
 *     model: new $$.Model(),
 *     content: 'fieldName',
 *     contentFormat: 'seconds',
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
        // These two functions use special formats 'millis' for milliseconds, 'seconds' for Unix seconds, and 'date' for Date.
        // Other formats will be interpreted by moment() for string IO.
        var millisForValue = function (value, format) {
            if (format === 'millis') {
                return value;
            } else if (format === 'seconds') {
                return value * 1000;
            } else if (format === 'date') {
                return moment(value).valueOf();
            } else {
                return moment(value, format).valueOf();
            }
        };
        
        var valueForMillis = function (millis, format) {
            if (format === 'millis') {
                return millis;
            } else if (format === 'seconds') {
                return millis / 1000;
            } else if (format === 'date') {
                return new Date(millis);
            } else {
                return moment(millis).format(format);
            }
        };
        
        var refresh = function() {
            var newValue = this.resolveContent();
            if (valueForMillis(this.$el.mobiscroll('getDate').valueOf(), this.options.contentFormat) !== newValue) {
                this.$el.mobiscroll('setDate', _(newValue).exists() ?
                    new Date(millisForValue(newValue, this.options.contentFormat)) :
                    new Date(), true);
            }
        };

        var onSelect = function (value, inst) {
            _(this.model).setProperty(
                this.options.content,
                valueForMillis(this.$el.mobiscroll('getDate').valueOf(), this.options.contentFormat)
            );
            if (this.options.mobiscroll.onSelect) {
                this.options.mobiscroll.onSelect(value, inst);
            }
        };

        return ($$[moduleName] = $$.views[moduleName] = $$.View.extend({
            tagName: 'input',
            className: 'mobiscroll form-control form-control-default',
            initialize : function (options) {
                $$.View.prototype.initialize.call(this, options);
                this.options.contentFormat = this.options.contentFormat ? this.options.contentFormat : 'millis';
                this.mixin([$$.mixins.HasModel]);
                _(this).bindAll('render');
                this._observeModel(_.bind(refresh, this));
            },
    
            render : function () {
                var inputOpts = _.extend(
                    { preset: 'datetime', theme: 'mobiscroll' }, // defaults
                    this.options.mobiscroll ? this.options.mobiscroll : { },
                    { onSelect: _.bind(onSelect, this) } // overrides
                );

                this.$el.mobiscroll(inputOpts);
                this.$el.mobiscroll('setDate', new Date(millisForValue(this.resolveContent(), this.options.contentFormat)), true);

                return this;
            },
            
            mobiscroll: function () {
                var result = this.$el.mobiscroll(arguments);
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
}(this, 'DateTime', [ 'backstrap', 'backstrap/View', 'backstrap/mixins/HasModel' ]));
