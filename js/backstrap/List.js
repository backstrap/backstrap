/**
 * A Backbone View that displays a model-bound list.
 * Based on Backbone-UI's ListView,
 * with Bootstrap decoration.
 * 
 * @license MIT
 */
(function (context)
{
    var fn = function ($$)
    {
        var updateClassNames = function () {
            if (this.options.generateRowClassNames) {
                var children = this.collectionEl.childNodes;
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
        };

        var ensureProperPosition = function (model) {
            if (_(this.model.comparator).isFunction()) {
                this.model.sort({silent: true});
                var itemEl = this.itemViews[model.cid].el.parentNode;
                var currentIndex = _(this.collectionEl.childNodes).indexOf(itemEl, true);
                var properIndex = this.model.indexOf(model);
                if (currentIndex !== properIndex) {
                    itemEl.parentNode.removeChild(itemEl);
                    var refNode = this.collectionEl.childNodes[properIndex];
                    if (refNode) {
                        this.collectionEl.insertBefore(itemEl, refNode);
                    } else {
                        this.collectionEl.appendChild(itemEl);
                    }
                }
            }
        };

        var ensureProperPositions = function (collection) {
            collection.models.forEach(function (model, index) {
                var itemEl = this.itemViews[model.cid].el.parentNode;
                itemEl.parentNode.removeChild(itemEl);
                var refNode = this.collectionEl.childNodes[index];
                if (refNode) {
                    this.collectionEl.insertBefore(itemEl, refNode);
                } else {
                    this.collectionEl.appendChild(itemEl);
                }
            }, this);
            updateClassNames.call(this);
        };

        return ($$.List = $$.CollectionView.extend({
            options: {
                // Set this to true to generate first, last, even, and odd classnames on rows.
                generateRowClassNames: false
            },
            
            initialize: function (options) {
                $$.CollectionView.prototype.initialize.call(this, options);

                if (this.model) {
                    this.model.bind('sort', ensureProperPositions, this);
                }

                $(this.el).addClass('list');
                this.collectionEl = $$.ul({className: 'list-group'});
            },

            render: function () {
                $(this.collectionEl).empty();

                $$.CollectionView.prototype.render.call(this);

                updateClassNames.call(this);
                this.el.appendChild(this.collectionEl);

                return this;
            },

            // Renders an item for the given model, at the given index.
            placeItem: function (content, model, index) {
                this.collectionEl.appendChild($$.li({className: 'list-group-item'}, content));
            },

            placeEmpty: function (content) {
                this.collectionEl.appendChild($$.li({className: 'list-group-item'}, content));
            },

            onItemAdded: function () {
                updateClassNames.call(this);
            },

            onItemRemoved: function () {
                updateClassNames.call(this);
            },

            onItemChanged: function () {
                ensureProperPosition.call(this);
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
