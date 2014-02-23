(function(){
  window.Backbone.UI.CollectionView = Backbone.UI.BaseView.extend({
    options : {
      // The Backbone.Collection instance the view is bound to
      model : null,

      // The Backbone.View class responsible for rendering a single item 
      // in the collection. For simple use cases, you can pass a String instead 
      // which will be interpreted as the property of the model to display.
      itemView : null,
      
      // Options to pass into the Backbone.View responsible for rendering the single item
      itemViewOptions : null,

      // A string, element, or function describing what should be displayed
      // when the list is empty.
      emptyContent : null,

      // A callback to invoke when a row is clicked.  The associated model will be
      // passed as the first argument.
      onItemClick : Backbone.UI.noop,

      // The maximum height in pixels that this table show grow to.  If the
      // content exceeds this height, it will become scrollable.
      maxHeight : null,
      
      // Render the the collection view on change in model
      renderOnChange : true
    },

    itemViews : {},

    _emptyContent : null,

    // must be over-ridden to describe how an item is rendered
    _renderItem : Backbone.UI.noop,

    initialize : function(options) {
      Backbone.UI.BaseView.prototype.initialize.call(this, options);
      if(this.model) {
        this.model.bind('add', _.bind(this._onItemAdded, this));
        if(this.options.renderOnChange){
          this.model.bind('change', _.bind(this._onItemChanged, this));
        }  
        this.model.bind('remove', _.bind(this._onItemRemoved, this));
        this.model.bind('refresh', _.bind(this.render, this));
        this.model.bind('reset', _.bind(this.render, this));
      }
    },

    _onItemAdded : function(model, list, options) {

      // first ensure that our collection element has been initialized,
      // and we haven't already rendered an item for this model
      if(!this.collectionEl || !!this.itemViews[model.cid]) {
        return;
      }

      // remove empty content if it exists
      if(!!this._emptyContent) {
        if(!!this._emptyContent.parentNode) this._emptyContent.parentNode.removeChild(this._emptyContent);
        this._emptyContent = null;
      }
       
      // render the new item
      var properIndex = list.indexOf(model);
      var el = this._renderItem(model, properIndex);

      // insert it into the DOM position that matches it's position in the model
      var anchorNode = this.collectionEl.childNodes[properIndex];
      this.collectionEl.insertBefore(el, _(anchorNode).isUndefined() ? null : anchorNode);

      // update the first / last class names
      this._updateClassNames();
    },

    _onItemChanged : function(model) {
      // ensure our collection element has been initialized
      if(!this.collectionEl) return;

      var view = this.itemViews[model.cid];
      // re-render the individual item view if it's a backbone view
      if(!!view && view.el && view.el.parentNode) {
        this._ensureProperPosition(view);
        view.render();
      }

      // otherwise, we re-render the entire collection
      else {
        this.render();
      }
    },

    _onItemRemoved : function(model) {
      // ensure our collection element has been initialized
      if(!this.collectionEl) return;

      var view = this.itemViews[model.cid];
      var liOrTrElement = view.el.parentNode;
      if(!!view && !!liOrTrElement && !!liOrTrElement.parentNode) {
        liOrTrElement.parentNode.removeChild(liOrTrElement);
      }
      delete(this.itemViews[model.cid]);

      // update the first / last class names
      this._updateClassNames();
    },

    _updateClassNames : function() {
      var children = this.collectionEl.childNodes;
      if(children.length > 0) {
        _(children).each(function(child, index) {
          $(child).removeClass('first');
          $(child).removeClass('last');
          $(child).addClass(index % 2 === 0 ? 'even' : 'odd');
        });
        $(children[0]).addClass('first');
        $(children[children.length - 1]).addClass('last');
      }
    },

    _ensureProperPosition : function(view) {
      if(_(this.model.comparator).isFunction()) {
        this.model.sort({silent : true});
        var itemEl = view.el.parentNode;
        var currentIndex = _(this.collectionEl.childNodes).indexOf(itemEl, true);
        var properIndex = this.model.indexOf(view.model);
        if(currentIndex !== properIndex) {
          itemEl.parentNode.removeChild(itemEl);
          var refNode = this.collectionEl.childNodes[properIndex];
          if(refNode) {
            this.collectionEl.insertBefore(itemEl, refNode);
          }
          else {
            this.collectionEl.appendChild(itemEl);
          }
        }
      }
    }
  });
}());

