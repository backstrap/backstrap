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
define(
    "backstrap/views/DateTime",
    [
        "../core", "underscore", "moment", "../View", "../mixins/HasModel"
    ], function ($$, _, moment)
{
    // These two functions use the special format values:
    // '' for ISO-8601 string; 'millis' for milliseconds; 'seconds' for Unix seconds; and 'date' for Date.
    // Other formats will be interpreted by moment(string, format) for string IO.
    // The object defaults to ISO-8601 format.
    var dateForValue = function (value, format) {
        if (!_(value).exists()) {
            return new Date();
        } else if (format === '') {
            return moment(value).toDate();
        } else if (format === 'millis') {
            return new Date(value);
        } else if (format === 'seconds') {
            return new Date(value * 1000);
        } else if (format === 'date') {
            return value;
        } else {
            return moment(value, format).toDate();
        }
    };
    
    var valueForDate = function (obj) {
        var dt = obj.$el.mobiscroll('getDate');
        var format = obj.options.contentFormat;
        if (format === '') {
            return moment(dt).format();
        } else if (format === 'millis') {
            return dt.valueOf();
        } else if (format === 'seconds') {
            return dt.valueOf() / 1000;
        } else if (format === 'date') {
            return dt;
        } else {
            return moment(dt).format(format);
        }
    };

    var updateFromContent = function (obj, value) {
        var val = dateForValue(value, obj.options.contentFormat);
        obj.$el.mobiscroll('setDate', val, true);
    };
    
    var refresh = function() {
        var newValue = this.resolveContent();
        if (valueForDate(this) !== newValue) {
            updateFromContent(this, newValue);
        }
    };

    var onSelect = function (value, inst) {
        this.model.set(this.options.content, valueForDate(this));
        if (this.options.mobiscroll && this.options.mobiscroll.onSelect) {
            this.options.mobiscroll.onSelect(value, inst);
        }
    };

    return ($$.DateTime = $$.views.DateTime = $$.View.extend({
        tagName: 'input',
        className: 'mobiscroll form-control form-control-default',
        initialize : function (options) {
            $$.View.prototype.initialize.call(this, options);
            this.options.contentFormat = this.options.contentFormat ? this.options.contentFormat : '';
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
            updateFromContent(this, this.resolveContent());

            return this;
        },
        
        mobiscroll: function () {
            var result = this.$el.mobiscroll.apply(this.$el, arguments);
            return (result === this.$el) ? this : result;
        }
    }));
});
