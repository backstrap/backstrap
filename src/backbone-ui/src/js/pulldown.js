(function(){
  window.Backbone.UI.Pulldown = Backbone.UI.BaseView.extend({
    options : {
      // text to place in the pulldown button before a
      // selection has been made
      placeholder : 'Select...',

      // enables / disables the pulldown
      disabled : false,

      // A callback to invoke with a particular item when that item is
      // selected from the pulldown menu.
      onChange : Backbone.UI.noop
    },

    initialize : function(options) {
      Backbone.UI.BaseView.prototype.initialize.call(this, options);
      this.mixin([Backbone.UI.HasModel, 
        Backbone.UI.HasAlternativeProperty, Backbone.UI.HasGlyph, 
        Backbone.UI.HasFormLabel, Backbone.UI.HasError, Backbone.UI.HasFocus]);
      _(this).bindAll('render');

      $(this.el).addClass('pulldown');
      if(this.options.name){
        $(this.el).addClass(this.options.name);
      }
      
    },

    render : function() {
      $(this.el).empty();
      
      this._menu = new Backbone.UI.Menu({
        model : this.model,
        content : this.options.content,
        alternatives : this.options.alternatives,
        altLabelContent : this.options.altLabelContent,
        altValueContent : this.options.altValueContent,
        onChange : this.options.onChange,
        placeholder : this.options.placeholder,
        emptyItem : this.options.emptyItem,
        size : 1,
        disabled : this.options.disabled
      }).render();
      
      this._parent = $.el.div({className : 'pulldown_wrapper'});
      var glyphLeftClassName = this.resolveGlyph(this.model, this.options.glyphLeftClassName);
      var glyphRightClassName = this.resolveGlyph(this.model, this.options.glyphRightClassName);
      this.insertGlyphLayout(glyphLeftClassName, glyphRightClassName, this._menu.el, this._parent);

      // add focusin / focusout
      this.setupFocus(this._menu.el, this._parent);      
      
      this.el.appendChild(this.wrapWithFormLabel(this._parent));
      
      return this;
    },

    // sets the enabled state
    setEnabled : function(enabled) {
      this.options.disabled = !enabled;
      this._menu.setEnabled(enabled);
    }
        
  });
}());
