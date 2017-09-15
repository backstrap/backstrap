/**
 * A basic model-bound Bootstrap navbar object.
 *
 * @author Kevin Perry perry@princeton.edu
 * @license MIT
 */
define(
    'backstrap/views/BasicNavbar',
    ['../core', 'jquery', './CollectionView'],
    function ($$, $) {
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

            initialize : function (options) {
                $$.CollectionView.prototype.initialize.call(this, options);
                $(this.el).addClass('list');
                this.collectionEl = $$.ul({className: 'nav navbar-nav'});
            },


            render: function () {
                $(this.collectionEl).empty();

                $$.CollectionView.prototype.render.call(this);

                this.renderClassNames(this.collectionEl);
                this.$el.append(this.collectionEl);

                return this;
            },

            // Renders an item for the given model, at the given index.
            placeItem: function (content, model, index) {
                var li = $$.li({className: 'list-group-item'}, content);
                this.collectionEl.appendChild(li);
                return li;
            },

            placeEmpty: function (content) {
                this.collectionEl.appendChild($$.li(content));
            },

            onItemAdded: function () {
                this.renderClassNames(this.collectionEl);
            },

            onItemRemoved: function () {
                this.renderClassNames(this.collectionEl);
            }
        });

        return ($$.BasicNavbar = $$.views.BasicNavbar = $$.View.extend({
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
    }
);
