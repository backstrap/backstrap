// A mixin for dealing with focus in / focus out
(function(){

  Backbone.UI.HasFocus = {
    
    setupFocus : function(el, parent) {
    
      // add focusin 
      $(el).focusin(_(function(e) {
        $(parent).addClass('focused');
      }).bind(this));

      // add focusout
      $(el).focusout(_(function(e) {
        $(parent).removeClass('focused');
      }).bind(this));
      
    }
        
  };
}());
