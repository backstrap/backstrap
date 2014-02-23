(function(){
  window.Backbone.UI.Button = Backbone.UI.BaseView.extend({
    options : {
      // true will disable the button
      // (muted non-clickable) 
      disabled : false,

      // true will activate the button
      // (depressed and non-clickable)
      active : false,

      // A callback to invoke when the button is clicked
      onClick : null,

      // renders this button as an input type=submit element as opposed to an anchor.
      isSubmit : false
    },
    
    tagName : 'button',

    initialize : function(options) {
      
      Backbone.UI.BaseView.prototype.initialize.call(this, options);
      
      this.mixin([Backbone.UI.HasModel, Backbone.UI.HasGlyph]);

      _(this).bindAll('render');

      $(this.el).addClass('button');

      $(this.el).bind('click', _(function(e) {
        if(!this.options.disabled && !this.options.active && this.options.onClick) {
          this.options.onClick(e); 
        }
        return false;
      }).bind(this));
    },

    render : function() {
      var labelText = this.resolveContent();

      this._observeModel(this.render);

      $(this.el).empty();

      if(this.options.isSubmit) {
        $(this.el).attr({
          type : 'submit', 
          value : ''
        });
      }

      var content = $.el.span(labelText);
      
      var glyphLeftClassName = this.resolveGlyph(this.model, this.options.glyphLeftClassName);
      var glyphRightClassName = this.resolveGlyph(this.model, this.options.glyphRightClassName);

      this.insertGlyphLayout(glyphLeftClassName, glyphRightClassName, content, this.el);

      // add appropriate class names
      this.setEnabled(!this.options.disabled);
      this.setActive(this.options.active);

      return this;
    },

    // sets the enabled state of the button
    setEnabled : function(enabled) {
      this.options.disabled = !enabled;
      $(this.el).toggleClass('disabled', !enabled);
      $(this.el).attr({'disabled' : !enabled});
    },

    // sets the active state of the button
    setActive : function(active) {
      this.options.active = active;
      $(this.el).toggleClass('active', active);
    }
  });
}());

