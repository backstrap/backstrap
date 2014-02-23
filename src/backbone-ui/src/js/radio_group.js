(function(){
  window.Backbone.UI.RadioGroup = Backbone.UI.BaseView.extend({

    options : {
      // used to group the radio inputs
      content : 'group',

      // enables / disables the radiogroup
      disabled : false,

      // A callback to invoke with the selected item whenever the selection changes
      onChange : Backbone.UI.noop
    },

    initialize : function(options) {
      Backbone.UI.BaseView.prototype.initialize.call(this, options);
      this.mixin([Backbone.UI.HasModel, 
        Backbone.UI.HasAlternativeProperty, Backbone.UI.HasGlyph, 
        Backbone.UI.HasFormLabel, Backbone.UI.HasError]);
      _(this).bindAll('render');
      
      $(this.el).addClass('radio_group');
      if(this.options.name){
        $(this.el).addClass(this.options.name);
      }
    },

    // public accessors
    selectedItem : null,

    render : function() {

      $(this.el).empty();

      this._observeModel(this.render);
      this._observeCollection(this.render);

      this.selectedItem = this._determineSelectedItem() || this.selectedItem;
      
      var selectedValue = this._valueForItem(this.selectedItem);
      
      this.group = $.el.div({className : 'radio_group_wrapper'});
      
      _(this._collectionArray()).each(function(item, idx) {

        var val = this._valueForItem(item);
        var selected = selectedValue === val;
        var label = this.resolveContent(item, this.options.altLabelContent);
        
        var input = $.el.input();
        $(input).attr({ 
          type : 'radio',
          name : this.options.content,
          value : val,
          checked : selected
        });
        
        // setup events for each input in collection
        $(input).change(_(this._updateModel).bind(this, item));
        $(input).click(_(this._updateModel).bind(this, item));
        
        // resolve left and right glyphs
        var parent = $.el.div({className : 'radio_group_wrapper'});
        var content = $.el.span(label);
        var glyphLeftClassName = this.resolveGlyph(item, this.options.altGlyphLeftClassName);
        glyphLeftClassName = (glyphLeftClassName && (glyphLeftClassName !== this.options.altGlyphLeftClassName)) ? glyphLeftClassName : 
          this.resolveGlyph(null, this.options.glyphLeftClassName);
        var glyphRightClassName = this.resolveGlyph(item, this.options.altGlyphRightClassName);
        glyphRightClassName = (glyphRightClassName && (glyphRightClassName !== this.options.altGlyphRightClassName)) ? 
          glyphRightClassName : this.resolveGlyph(null, this.options.glyphRightClassName);
        this.insertGlyphLayout(glyphLeftClassName, glyphRightClassName, content, parent);
        
        // create a new label/input pair and insert into the group
        this.group.appendChild(
          $.el.label({className : _(this._collectionArray()).nameForIndex(idx++) + 
            ' ' + (idx % 2 === 0 ? 'even' : 'odd')}, input, parent));
        
      }, this);
      
      this.el.appendChild(this.wrapWithFormLabel(this.group));

      this.setEnabled(!this.options.disabled);

      return this;
    },
    
    _updateModel : function(item) {
      // check if item selected actually changed
      var changed = this.selectedItem !== item;
      this._setSelectedItem(item);
      // if onChange function exists call it
      if(_(this.options.onChange).isFunction() && changed) {
        this.options.onChange(item);
      }  
    },

    // sets the enabled state
    setEnabled : function(enabled) {
      if(enabled) { 
        $(this.el).removeClass('disabled');
      } else {
        $(this.el).addClass('disabled');
      }
    }
    
  });
}());
