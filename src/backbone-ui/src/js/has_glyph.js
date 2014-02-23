// A mixin for dealing with glyphs in widgets 
(function(){

  Backbone.UI.HasGlyph = {
    
    insertGlyphLayout : function(glyphLeftClassName, glyphRightClassName, content, parent) {

      // append left glyph
      if(glyphLeftClassName) {
        var glyphLeft = $.el.span({
          className : 'glyph left ' + glyphLeftClassName
        });
        parent.appendChild(glyphLeft);
        $(parent).addClass('hasGlyphLeft');
      }
      
      // append content
      if(content) {
        parent.appendChild(content);
      }
      
      // append right glyph
      if(glyphRightClassName) {
        var glyphRight = $.el.span({
          className : 'glyph right ' + glyphRightClassName
        });
        parent.appendChild(glyphRight);
        $(parent).addClass('hasGlyphRight');
      }
     
    },

    resolveGlyph : function(model, content) {
      if(content === null) return null;
      var glyph = null;
      if(_(model).exists() && _((model.attributes || model)[content]).exists()) {
        glyph = this.resolveContent(model, content);
      }
      return _(glyph).exists() ? glyph : content;
    }
  };
}());
