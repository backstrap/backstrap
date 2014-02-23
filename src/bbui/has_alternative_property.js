 // A mixin for dealing with collection alternatives
(function(){
  Backbone.UI.HasAlternativeProperty = {
    options : {
      // The collection of items representing alternative choices
      alternatives : null,

      // The property of the individual choice represent the the label to be displayed
      altLabelContent : null,

      // The property of the individual choice that represents the value to be stored
      // in the bound model's property.  Omit this option if you'd like the choice 
      // object itself to represent the value.
      altValueContent : null,
      
      // If provided this content will wrap the component with additional label.
      formLabelContent : null,
      
      // The property of the individual choice representing CSS 
      // background rule for the left glyph 
      altGlyphLeftClassName : null,

      // The property of the individual choice representing CSS 
      // background rule for the right glyph 
      altGlyphRightClassName : null
    },

    _determineSelectedItem : function() {
      var item;

      // if a bound property has been given, we attempt to resolve it
      if(_(this.model).exists() && _(this.options.content).exists()) {
        item = _(this.model).resolveProperty(this.options.content);

        // if a value property is given, we further resolve our selected item
        if(_(this.options.altValueContent).exists()) {
          var otherItem = _(this._collectionArray()).detect(function(collectionItem) {
            return (collectionItem.attributes || collectionItem)[this.options.altValueContent] === item;
          }, this);
          if(!_(otherItem).isUndefined()) item = otherItem;
        }
      }

      return item || this.options.selectedItem;
    },

    _setSelectedItem : function(item, silent) {
      this.selectedValue = item;
      this.selectedItem = item;

      if(_(this.model).exists() && _(this.options.content).exists()) {
        this.selectedValue = this._valueForItem(item);
        _(this.model).setProperty(this.options.content, this.selectedValue, silent);
      }
    },

    _valueForItem : function(item) {
      return _(this.options.altValueContent).exists() ? 
        _(item).resolveProperty(this.options.altValueContent) :
        item;
    },

    _collectionArray : function() {
      return _(this.options.alternatives).exists() ?
        this.options.alternatives.models || this.options.alternatives : [];
    },

    _observeCollection : function(callback) {
      if(_(this.options.alternatives).exists() && _(this.options.alternatives.bind).exists()) {
        var key = 'change';
        this.options.alternatives.unbind(key, callback);
        this.options.alternatives.bind(key, callback);
      }
    }
  };
}());

