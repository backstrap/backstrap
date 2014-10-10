/**
 * A generic Backbone View for displaying Collection data.
 * Based on Backbone-UI CollectionView.
 *
 * The view will start listening to add/remove/change events
 * on the Collection when it receives an 'attach' event,
 * and will suspend listening when it receives a 'detach' event.
 * 
 * @author Kevin Perry, perry@princeton.edu
 * @copyright 2014 The Trustees of Princeton University.
 * @license MIT
 */
(function (context, moduleName, requirements)
{
    var fn = function ($$)
    {
        /*
         * Render an item for the given model, at the given index.
         */
        var renderItem = function (model, index) {
            var content = null;
            if (_(this.options.itemView).exists()) {
                if (_(this.options.itemView).isString()) {
                    content = this.resolveContent(model, this.options.itemView);
                } else {
                    var view = new this.options.itemView(
                        _({ model: model, parentView: this }).extend(
                            this.options.itemViewOptions));
                    view.render();
                    this.itemViews[model.cid] = view;
                    content = view.el;
                }
            }

            // Bind the item click callback if given.
            if (this.options.onItemClick) {
                $(content).click(_(this.options.onItemClick).bind(this, model));
            }

            this.placeItem(content, model, index);
        };

        /*
         * Set up model change listeners.
         */
        var listenToModel = function (model, onOff) {
            if (model) {
                var actions = {
                    add:    onItemAdded,
                    remove: onItemRemoved,
                    reset:  this.render
                };

                if (this.options.renderOnChange) {
                    var props = this.options.renderOnChange;
                    if (props === true) {
                        actions.change = onItemChanged;
                    } else {
                        (_.isArray(props) ? props : [props]).forEach(function (prop) {
                            this['change:' + prop] = onItemChanged;
                        }, actions);
                    }
                }  

                (onOff ? model.on : model.off)(actions, this);
            }
        };

        var onItemAdded = function (model, list, options) {
            // First, ensure that we haven't already rendered an item for this model.
            if (this.itemViews[model.cid]) {
                return;
            }

            // Remove empty content if it exists.
            if (this._emptyContent) {
                if (this._emptyContent.parentNode) this._emptyContent.parentNode.removeChild(this._emptyContent);
                this._emptyContent = null;
            }
   
            // Render the new item.
            renderItem.call(this, model, list.indexOf(model));
            
            if (_.isFunction(this.onItemAdded)) {
                this.onItemAdded(model, list, options);
            }
        };

        var onItemChanged = function (model, options) {
            var view = this.itemViews[model.cid];
            // Re-render the individual item view if it's a backbone view.
            if (view && view.el && view.el.parentNode) {
                view.render();
            } else { // Otherwise, we re-render the entire collection.
                this.render();
            }

            if (_.isFunction(this.onItemChanged)) {
                this.onItemChanged(model, options);
            }
        };

        var onItemRemoved = function (model, list, options) {
            var view = this.itemViews[model.cid];
            var liOrTrElement = view.el.parentNode;
            if (view && liOrTrElement && liOrTrElement.parentNode) {
                liOrTrElement.parentNode.removeChild(liOrTrElement);
            }
            delete(this.itemViews[model.cid]);
            if (this.itemViews.length === 0) {
                // Need to render the empty content.
                this.render();
            }

            if (_.isFunction(this.onItemRemoved)) {
                this.onItemRemoved(model, list, options);
            }
        };
        
        return ($$[moduleName] = $$.View.extend({
            options: {
                // The Collection instance the view is bound to.
                model: null,

                // The View class responsible for rendering a single item 
                // in the collection. For simple use cases, you can pass a String instead 
                // which will be interpreted as the property of the model to display.
                itemView: null,
      
                // Options to pass into the View responsible for rendering the single item.
                itemViewOptions: {},

                // A string, element, or function describing what should be displayed
                // when the list is empty.
                emptyContent: null,

                // A callback to invoke when a row is clicked.  The associated model will be
                // passed as the first argument.
                onItemClick: function () {},

                // The maximum height in pixels that this table show grow to.  If the
                // content exceeds this height, it will become scrollable.
                maxHeight: null,
      
                // Render the the collection view on change in model.
                renderOnChange: true,
                
                // Whether to start listening to model events immediately or wait for 'attach'.
                attached: true,
                
                // Set this to true to generate first, last, even, and odd classnames on rows.
                generateRowClassNames: false
            },

            itemViews: {},

            _emptyContent: null,

            initialize: function (options) {
                $$.View.prototype.initialize.call(this, options);
                this.on('attach', _(this.listenToModel).bind(this, this.model, true));
                this.on('detach', _(this.listenToModel).bind(this, this.model, false));
                if (this.options.attached) {
                    listenToModel.call(this, this.model, true);
                }
            },

            render: function () {
                this.$el.empty();
                this.itemViews = {};

                if (this.options.emptyContent) {
                    this._emptyContent = _(this.options.emptyContent).isFunction() ? 
                        this.options.emptyContent() : this.options.emptyContent;
                }

                if (_(this.model).exists() && this.model.length > 0) {
                    _(this.model.models).each(renderItem, this);
                } else {
                    this.placeEmpty(this._emptyContent);
                }

                return this;
            },
            
            /**
             * Render first, last, even and odd classnames on row items.
             */
            renderClassNames: function (collectionEl) {
                if (this.options.generateRowClassNames) {
                    var children = (collectionEl ? collectionEl : this.el).childNodes;
                    if (children.length > 0) {
                        _(children).each(
                            function (child, index)
                            {
                                $(child).removeClass('first last')
                                        .addClass(index % 2 === 0 ? 'even' : 'odd');
                            });
                        $(children[0]).addClass('first');
                        $(children[children.length - 1]).addClass('last');
                    }
                }
            },

            /**
             * Place an individual item's view on the page.
             * 
             * Extensions of CollectionView may wish to override this method
             * to define how an item is put into the DOM.
             */
            placeItem: function (itemElement, model, index) {
                this.$el.append(itemElement);
            },
            
            /**
             * Place the "empty" content, if any, on the page.
             * 
             * Extensions of CollectionView may wish to override this method.
             */
            placeEmpty: function (emptyContent) {    
                // Render the empty content.
                if (emptyContent) {
                    this.$el.append(emptyContent);
                }
            }
        }));
    };

    if (typeof context.define === 'function'
        && context.define.amd
        && !context._$$_backstrap_built_flag
    ) {
        context.define('backstrap/' + moduleName, requirements, fn);
    } else if (typeof context.module === 'object'
        && typeof context.module.exports === 'object'
    ) {
        context.module.exports = fn.call(requirements.map(
            function (reqName)
            {
                return require(reqName);
            }
        ));
    } else {
        if (typeof context.$$ !== 'function') {
            throw new Error('Backstrap not loaded');
        }
        fn(context.$$);
    }
}(this, 'CollectionView', [ 'backstrap', 'backstrap/View' ]));
