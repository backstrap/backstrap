(function(){
  window.Backbone.UI.TimePicker = Backbone.UI.BaseView.extend({

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
      Backbone.UI.BaseView.prototype.initialize.call(this, options);
      this.mixin([Backbone.UI.HasModel, Backbone.UI.HasFormLabel, Backbone.UI.HasError]);
      $(this.el).addClass('time_picker');

      this._timeModel = {};
      this._menu = new Backbone.UI.Menu({
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

      this._textField = new Backbone.UI.TextField({
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

      this._menu.options.selectedValue = time;
      this._menu.render();
    },

    setEnabled : function(enabled) {
      this.options.disabled = !enabled;
      this._textField.setEnabled(enabled);
    },

    _collectTimes : function() {
      var collection = [];
      var d = moment().startOf('day');
      var day = d.date();

      while(d.date() === day) {
        collection.push({
          label : d.format(this.options.format),
          value : new Date(d)
        });

        d.add('minutes', this.options.interval);
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
      if(e && e.keyCode === Backbone.UI.KEYS.KEY_RETURN) this._timeEdited();
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
      if(!e || e.keyCode === Backbone.UI.KEYS.KEY_RETURN || e.type === 'blur') {
        var newValue = moment(newDate).format(this.options.format);
        this._textField.setValue(newValue);
        this._hideMenu();

        // update our bound model (but only the date portion)
        if(!!this.model && this.options.content) {
          var boundDate = this.resolveContent();
          var updatedDate = new Date(boundDate);
          // Ensure we are updating a valid Date object
          updatedDate = isNaN(updatedDate.getTime()) ? new Date() : updatedDate;
          updatedDate.setHours(newDate.hours());
          updatedDate.setMinutes(newDate.minutes());
          _(this.model).setProperty(this.options.content, updatedDate);
        }

        if(_(this.options.onChange).isFunction()) {
          this.options.onChange(newValue);
        }
      }
    }
    
  });
}());
