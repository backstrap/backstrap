/**
 * A Backbone View that displays a model-bound date picker.
 * Largely from Backbone-UI's DatePicker class,
 * with Bootstrap decoration.
 * 
 * Kevin Perry perry@princeton.edu
 * @copyright 2014 The Trustees of Princeton University.
 * @license MIT
 */
(function(context, moduleName, requirements) {
    var fn = function($$, moment)
    {
        var KEY_RETURN = 13;

        return ($$[moduleName] = $$.View.extend({

            options : {
                // a moment.js format : http://momentjs.com/docs/#/display/format
                format : 'MM/DD/YYYY',
                date : null,
                name : null,
                onChange : null,
                minDate : null,
                maxDate : null
            },

            initialize : function(options) {
                $$.View.prototype.initialize.call(this, options);
                this.mixin([$$.HasModel, $$.HasFormLabel, $$.HasError]);
                this.$el.addClass('date_picker');

                this._calendar = new $$.Calendar({
                    className : 'date_picker_calendar',
                    model : this.model,
                    content : this.options.content,
                    onSelect : _(this._selectDate).bind(this),
                    minDate : this.options.minDate,
                    maxDate : this.options.maxDate
                });
                $(this._calendar.el).hide();
                document.body.appendChild(this._calendar.el);

                $(this._calendar.el).autohide({
                    ignoreInputs : true,
                    leaveOpenTargets : [this._calendar.el]
                });

                // listen for model changes
                this._observeModel(_(this.render).bind(this));
            },

            render : function() {
                this.$el.empty();

                this._textField = new $$.TextField({
                    name : this.options.name,
                    placeholder : this.options.placeholder,
                    glyphLeftClassName : this.options.glyphLeftClassName,
                    glyphRightClassName : this.options.glyphRightClassName
                }).render();

                $(this._textField.input).click(_(this._showCalendar).bind(this));
                $(this._textField.input).blur(_(this._dateEdited).bind(this));
                $(this._textField.input).keyup(_(this._hideCalendar).bind(this));

                this.el.appendChild(this.wrapWithFormLabel(this._textField.el));

                this._selectedDate = (!!this.model && !!this.options.content) ? 
                    this.resolveContent() : this.options.date;

                if(!!this._selectedDate) {
                    this._calendar.options.date = this._selectedDate;
                    var dateString = moment(this._selectedDate).format(this.options.format);
                    this._textField.setValue(dateString);
                }
                this._calendar.render();

                return this;
            },

            setEnabled : function(enabled) {
                this._textField.setEnabled(enabled);
            },

            getValue : function() {
                return this._selectedDate;
            },

            setValue : function(date) {
                this._selectedDate = date;
                var dateString = moment(date).format(this.options.format);
                this._textField.setValue(dateString);
                this._dateEdited();
            },

            _showCalendar : function() {
                $(this._calendar.el).show();
                $(this._calendar.el).alignTo(this._textField.el, 'bottom -left');
                // TODO: First time, it mis-computes vertical position.
                $(this._calendar.el).alignTo(this._textField.el, 'bottom -left', 5, 2);
            },

            _hideCalendar : function(e) {
                if(e && e.keyCode === KEY_RETURN) this._dateEdited();
                $(this._calendar.el).hide();
            },

            _selectDate : function(date) {
                var month = date.getMonth() + 1;
                if(month < 10) month = '0' + month;

                var day = date.getDate();
                if(day < 10) day = '0' + day;

                var dateString = moment(date).format(this.options.format);
                this._textField.setValue(dateString);
                this._dateEdited();
                this._hideCalendar();

                return false;
            },

            _dateEdited : function(e) {

                var newDate = moment(this._textField.getValue(), this.options.format);
                this._selectedDate = newDate ? newDate.toDate() : null;

                // if the event is a blur, we need to make sure that the menu is not
                // open, otherwise we'll squash that selection event
                if(e && e.type === 'blur' && $(this._calendar.el).is(':visible')) return;

                // if the enter key was pressed or we've invoked this method manually, 
                // we hide the calendar and re-format our date
                if(!e || e.keyCode === KEY_RETURN || e.type === 'blur') {
                    var newValue = moment(newDate).format(this.options.format);
                    this._textField.setValue(newValue);
                    this._hideCalendar();

                    // update our bound model (but only the date portion)
                    if(!!this.model && this.options.content) {
                        var boundDate = this.resolveContent() || new Date();
                        var updatedDate = new Date(boundDate.getTime());
                        updatedDate.setMonth(newDate.month());
                        updatedDate.setDate(newDate.date());
                        updatedDate.setFullYear(newDate.year());
                        _(this.model).setProperty(this.options.content, updatedDate);
                    }
                    else {
                        this._calendar.date = this._selectedDate;
                        this._calendar.render();
                    }

                    if(_(this.options.onChange).isFunction()) {
                        this.options.onChange(newValue);
                    }
                }
            }
        }));
    };

    if (typeof context.define === 'function' && context.define.amd
            && !context._$$_backstrap_built_flag) {
        context.define('backstrap/' + moduleName, requirements, fn);
    } else if (typeof context.module === 'object'
            && typeof context.module.exports === 'object') {
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
        fn(context.$$, context.moment);
    }
}(this, 'DatePicker', [
    'backstrap',
    'moment',
    'backstrap/Calendar',
    'backstrap/HasError',
    'backstrap/HasFormLabel',
    'backstrap/HasModel',
    'backstrap/TextField',
    'backstrap/View'
]));
