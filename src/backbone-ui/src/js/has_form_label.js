// A mixin for dealing with glyphs in widgets 
(function(){

  Backbone.UI.HasFormLabel = {
    
    wrapWithFormLabel : function(content) {
      var wrapped = $.el.label();
      
      var formLabelText = this.options.formLabelContent ? 
        this.resolveContent(this.model, this.options.formLabelContent, 
          this.options.formLabelContent) || this.options.formLabelContent : null;
      if(formLabelText) {
        wrapped.appendChild($.el.span({className : 'form_label'}, formLabelText));
      }
      wrapped.appendChild(content);
      return wrapped;  
    }  

  };
}());
