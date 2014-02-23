(function(){
  window.Backbone.UI.Label = Backbone.UI.BaseView.extend({
    
    options : {
      emptyContent : ''
    },
    
    tagName : 'label',

    initialize : function(options) {
      Backbone.UI.BaseView.prototype.initialize.call(this, options);
      this.mixin([Backbone.UI.HasModel]);

      _(this).bindAll('render');

      if(this.options.name){
        $(this.el).addClass(this.options.name);
      }

    },

    render : function() {
      var labelText = this.resolveContent(this.model, this.options.labelContent) || this.options.labelContent;
      // if the label is undefined use the emptyContent option
      if(labelText === undefined){
        labelText = this.options.emptyContent;
      }
      this._observeModel(this.render);

      $(this.el).empty();
      
      // insert label
      this.el.appendChild(document.createTextNode(labelText));

      return this;
    }
    
  });
}());

