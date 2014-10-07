/**
 * A basic model-bound Bootstrap navbar object.
 * 
 * @author Kevin Perry perry@princeton.edu
 * @copyright 2014 The Trustees of Princeton University.
 * @license MIT
 */
(function(context, moduleName, requirements) {
{
    var fn = function($$)
    {
        var ItemView = $$.View.extend({
            tagName: 'a',
            className: 'nav-item',
            
            render: function render() {
                this.$el.addClass('nav-item-' + this.model.get('name'))
                    .attr('href', this.model.get('href'))
                    .text(this.model.get('label'));
                return this;
            }
        });

        var NavList = $$.CollectionView.extend({
            className: 'navbar-collapse collapse',
            
            initialize : function(options) {
                $$.CollectionView.prototype.initialize.call(this, options);
                $(this.el).addClass('list');
                _(this).bindAll('render');
            },
            
            render : function() {
                $(this.el).empty();
                this.itemViews = {};

                this.collectionEl = $$.ul({className: 'nav navbar-nav'});

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
        });
    
        return ($$[moduleName] = $$.View.extend({
            className: 'navbar navbar-default',
            brand: '',
    
            initialize: function (options) {
                $$.View.prototype.initialize.apply(this, arguments);
                if ('navbarType' in options) {
                    this.$el.addClass('navbar-'+options.navbarType);
                }
                if ('brand' in options) {
                    this.brand = options.brand;
                }
                this.navList = new NavList({ model: options.model, itemView: ItemView });
            },
    
            render: function () {
                this.$el.empty();
                this.$el.append(
                    $$.div({ className: 'container' },
                        $$.div({ className: 'navbar-header' },
                            $$.button({
                                    type: 'button',
                                    className: 'navbar-toggle',
                                    'data-toggle': 'collapse',
                                    'data-target': '.navbar-collapse'
                                },
                                $$.span({ className: 'sr-only' }, 'Toggle navigation'),
                                $$.span({ className: 'icon-bar' }),
                                $$.span({ className: 'icon-bar' }),
                                $$.span({ className: 'icon-bar' })
                            ),
                            $$.a({ className: 'navbar-brand', href: '#' }, this.brand)
                        ),
                        this.navList.render().el
                    )
                ).attr('role', 'navigation');
                return this;
            }
        }));
    };

    if (typeof context.define === 'function' && context.define.amd
            && !context._$$_backstrap_built_flag) {
        context.define('backstrap/' + moduleName, requirements, fn);
    } else if (typeof context.module === 'object'
            && typeof context.module.exports === 'object') {
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
}(this, 'BasicNavbar', [ 'backstrap', 'backstrap/CollectionView' ]));
 
