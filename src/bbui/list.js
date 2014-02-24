(function(context){
  var fn = function(backbone_ui){
		
  return (backbone_ui.List = backbone_ui.CollectionView.extend({
  
    initialize : function(options) {
      backbone_ui.CollectionView.prototype.initialize.call(this, options);
      $(this.el).addClass('list');
    },

    render : function() {
      $(this.el).empty();
      this.itemViews = {};

      this.collectionEl = $$.ul();

      // if the collection is empty, we render the empty content
      if((!_(this.model).exists()  || this.model.length === 0) && this.options.emptyContent) {
        this._emptyContent = _(this.options.emptyContent).isFunction() ? 
          this.options.emptyContent() : this.options.emptyContent;
        this._emptyContent = $$.li(this._emptyContent);

        if(!!this._emptyContent) {
          this.collectionEl.appendChild(this._emptyContent);
        }
      }

      // otherwise, we render each row
      else {
        _(this.model.models).each(function(model, index) {
          var item = this._renderItem(model, index);
          this.collectionEl.appendChild(item);
        }, this);
      }

      this.el.appendChild(this.collectionEl);
      this._updateClassNames();

      return this;
    },

    // renders an item for the given model, at the given index
    _renderItem : function(model, index) {
      var content = null;
      if(_(this.options.itemView).exists()) {

        if(_(this.options.itemView).isString()) {
          content = this.resolveContent(model, this.options.itemView);
        }

        else {
          var view = new this.options.itemView(_({ model : model }).extend(
            this.options.itemViewOptions));
          view.render();
          this.itemViews[model.cid] = view;
          content = view.el;
        }
      }

      var item = $$.li(content);

      // bind the item click callback if given
      if(this.options.onItemClick) {
        $(item).click(_(this.options.onItemClick).bind(this, model));
      }

      return item;
    }

  }));
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
