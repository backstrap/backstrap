/**
 * A Backbone View that displays a model-bound list.
 * Largely from Backbone-UI's ListView class,
 * with Bootstrap decoration.
 * 
 * @license MIT
 */
(function(context){
  var fn = function($$){
		
  return ($$.List = $$.CollectionView.extend({
  
    initialize : function(options) {
      $$.CollectionView.prototype.initialize.call(this, options);
      $(this.el).addClass('list');
    },

    render : function() {
      $(this.el).empty();
      this.itemViews = {};

      this.collectionEl = $$.ul({className: 'list-group'});

      // if the collection is empty, we render the empty content
      if((!_(this.model).exists()  || this.model.length === 0) && this.options.emptyContent) {
        this._emptyContent = _(this.options.emptyContent).isFunction() ? 
          this.options.emptyContent() : this.options.emptyContent;
        this._emptyContent = $$.li({className: 'list-group-item'}, this._emptyContent);

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

      var item = $$.li({className: 'list-group-item'}, content);

      // bind the item click callback if given
      if(this.options.onItemClick) {
        $(item).click(_(this.options.onItemClick).bind(this, model));
      }

      return item;
    }

  }));
  };
  
	if (typeof context.define === "function" && context.define.amd &&
			typeof context._$$_backstrap_built_flag === 'undefined') {
		define("backstrap/List", ["backstrap"], function ($$) {
			return fn($$);
		});
	} else if (typeof context.module === "object" && typeof context.module.exports === "object") {
		module.exports = fn(require("backstrap"));
	} else {
		if (typeof context.$$ !== 'function') throw new Error('Backstrap environment not loaded');
		fn(context.$$);
	}
}(this));
