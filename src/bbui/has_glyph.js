// A mixin for dealing with glyphs in widgets 
(function(context){
  var fn = function(backbone_ui){
		
  return (backbone_ui.HasGlyph = {
    
    insertGlyphLayout : function(glyphLeftClassName, glyphRightClassName, content, parent) {

      // append left glyph
      if(glyphLeftClassName) {
        var glyphLeft = $$.span({
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
        var glyphRight = $$.span({
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
  });
  };
  
	if (typeof define === "function" && define.amd) {
		define(/* no-name, */["backstrap/backbone_ui"], function (bbui) {
			return fn(bbui);
		});
	}
	
	if (typeof module === "object" && typeof module.exports === "object") {
		module.exports = fn(require("backstrap/backbone_ui"));
	} else {
		fn(context.$$.backbone_ui);
	}
}(this));
