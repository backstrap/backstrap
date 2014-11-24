/**
 * A Backbone View that displays a model-bound time picker.
 * Largely from Backbone-UI's TimePicker class,
 * with Bootstrap decoration.
 * 
 * @author Kevin Perry perry@princeton.edu
 * @license MIT
 */
(function(context, moduleName, requirements)
{
    var fn = function($$, moment)
    {
        var KEY_RETURN = 13;
        
        /**
         * momentFor() - Creates a moment object from any date/time value,
         * and accepts numbers as either seconds or milliseconds.
         * 
         * Takes a string, int, array of ints, Date, or plain-old object
         * and creates a moment out  of it (see momentjs.com docs for details).
         * For strings, an optional format string may be passed as the second
         * argument.  All processing is handled by moment.js, except that we
         * first apply the heuristic that if the value is numeric and less than
         * 31500000000, it gets treated as Unix seconds (valid for years <= 2967);
         * larger numbers get treated as milliseconds (valid for years >= 1971).
         * This allows you to pass either seconds or milliseconds for all
         * reasonable modern dates (1971 - 2967), without specifying a format.
         * With a numeric value, passing either 's' or 'u' in the format parameter
         * will force it to treat the number as seconds or milliseconds accordingly.
         */
        var momentFor = function (value, format) {
            if (typeof value === 'number' &&
                format !== 'u' &&
                (value < 31500000000 || format === 's')
            ) {
                moment.unix(value);
            } else {
                moment(value, format);
            }
        };

        return ($$[moduleName] = $$.views[moduleName] = $$.View.extend({
            options : {
                // a moment.js format : http://momentjs.com/docs/#/display/format
                format : 'hh:mm a',

                // minute interval to use for pulldown menu
                interval : 30,

                // the name given to the text field's input element
                name : null,

                // text field is disabled or enabled
                disabled : false
            },

            initialize : function(options) {
                $$.View.prototype.initialize.call(this, options);
                this.mixin([$$.mixins.HasModel, $$.mixins.HasFormLabel, $$.mixins.HasError]);
                this.$el.addClass('time_picker');

                this._timeModel = {};
                this._menu = new $$.Select({
                    className : 'time_picker_menu',
                    model : this._timeModel,
                    altLabelContent : 'label',
                    altValueContent : 'label',
                    content : 'value',
                    onChange : _(this._onSelectTimeItem).bind(this),
                    size : 10
                });
                $(this._menu.el).hide();
                $(this._menu.el).autohide({
                    ignoreInputs : true
                });
                document.body.appendChild(this._menu.el);

                // listen for model changes
                this._observeModel(_(this.render).bind(this));
            },

            render : function() {
                $(this.el).empty();

                this._textField = new $$.TextField({
                    name : this.options.name,
                    disabled : this.options.disabled, 
                    placeholder : this.options.placeholder,
                    glyphLeftClassName : this.options.glyphLeftClassName,
                    glyphRightClassName : this.options.glyphRightClassName
                }).render();
                $(this._textField.input).click(_(this._showMenu).bind(this));
                $(this._textField.input).blur(_(this._timeEdited).bind(this));
                $(this._textField.input).keyup(_(this._hideMenu).bind(this));
                this.el.appendChild(this.wrapWithFormLabel(this._textField.el));

                var date = this.resolveContent();

                if(!!date) {
                    var value = moment(date).format(this.options.format);
                    this._textField.setValue(value);
                    this._timeModel.value = value;
                    this._selectedTime = date;
                }

                this._menu.options.alternatives = this._collectTimes();
                this._menu.options.model = this._timeModel;
                this._menu.render();

                return this;
            },

            getValue : function() {
                return this._selectedTime;
            },

            setValue : function(time) {
                this._selectedTime = time;
                var timeString = moment(time).format(this.options.format);
                this._textField.setValue(timeString);
                this._timeEdited();

// options.selectedValue should match _collectTimes()
                this._menu.options.selectedValue = time;
                this._menu.render();
            },

            setEnabled : function(enabled) {
                this.options.disabled = !enabled;
                this._textField.setEnabled(enabled);
            },

            _collectTimes : function() {
                var collection;
                var d = moment().startOf('day');
                var day = d.date();
                
                collection = [];
                while(d.date() === day) {
                    collection.push({
                        label : d.format(this.options.format),
                        value : new Date(d) // storeFormat
                    });

                    d.add(this.options.interval, 'minutes');
                }

                return collection;
            },

            _showMenu : function() {
                if($(this._menu.el).is(':visible')) return;

                $(this._menu.el).alignTo(this._textField.el, 'bottom -left', 0, 2);
                $(this._menu.el).show();
                this._menu.scrollToSelectedItem();
            },

            _hideMenu : function(e) {
                if(e && e.keyCode === KEY_RETURN) this._timeEdited();
                $(this._menu.el).hide();
            },

            _onSelectTimeItem : function(item) {
                this._hideMenu();
                this._selectedTime = item.value;
                this._textField.setValue(moment(this._selectedTime).format(this.options.format));
                this._timeEdited();
            },

            _timeEdited : function(e) {
                var value = this._textField.getValue();
                if(!value) return;

                // if the event is a blur, we need to make sure that the menu is not
                // open, otherwise we'll squash that selection event
                if(e && e.type === 'blur' && $(this._menu.el).is(':visible')) return;

                var newDate = moment(value, this.options.format);

                // if the enter key was pressed or we've invoked this method manually, 
                // we hide the calendar and re-format our date
                if(!e || e.keyCode === KEY_RETURN || e.type === 'blur') {
                    var newValue = moment(newDate).format(this.options.format);
                    this._textField.setValue(newValue);
                    this._hideMenu();

                    // update our bound model (but only the date portion)
                    if(!!this.model && this.options.content) {
                        var boundDate = this.resolveContent();
                        var updatedDate = new Date(boundDate); // storeFormat? (via moment())
                        // Ensure we are updating a valid Date object
                        updatedDate = isNaN(updatedDate.getTime()) ? new Date() : updatedDate; // storeFormat
                        updatedDate.setHours(newDate.hours());
                        updatedDate.setMinutes(newDate.minutes());
                        _(this.model).setProperty(this.options.content, updatedDate); // storeFormat
                    }

                    if(_(this.options.onChange).isFunction()) {
                        this.options.onChange(newValue);
                    }
                }
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
        if (typeof context.moment !== 'function') {
            throw new Error('MomentJS not loaded');
        }
        fn(context.$$, context.moment);
    }
}(this, 'TimePicker', [
    'backstrap',
    'moment',
    'backstrap/View',
    'backstrap/mixins/HasError',
    'backstrap/mixins/HasFormLabel',
    'backstrap/mixins/HasModel',
    'backstrap/views/Select',
    'backstrap/views/TextField'
]));
