/**
 * A Backbone View that displays a model-bound list.
 * Based on Backbone-UI's ListView,
 * with Bootstrap decoration.
 *
 * @author Kevin Perry perry@princeton.edu
 * @license MIT
 */
define(
    'backstrap/views/List',
    ['../core', 'jquery', 'underscore', './CollectionView'],
    function ($$, $, _) {
        var ensureProperPosition = function (model) {
            if (this.model.comparator) {
                this.model.sort({silent: true});
                var view = this.itemViews[model.cid];
                if (view) {
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
            }
        };

        var ensureProperPositions = function (collection) {
            collection.models.forEach(function (model, index) {
                if (this.itemViews[model.cid]) {
                    var itemEl = this.itemViews[model.cid].el.parentNode;
                    itemEl.parentNode.removeChild(itemEl);
                    var refNode = this.collectionEl.childNodes[index];
                    if (refNode) {
                        this.collectionEl.insertBefore(itemEl, refNode);
                    } else {
                        this.collectionEl.appendChild(itemEl);
                    }
                }
            }, this);
            this.renderClassNames(this.collectionEl);
        };

        var listenToSort = function (model, onOff) {
            if (model) {
                (onOff ? model.on : model.off).call(model, 'sort', ensureProperPositions, this);
            }
        };

        return ($$.List = $$.views.List = $$.CollectionView.extend({
            initialize: function (options) {
                $$.CollectionView.prototype.initialize.call(this, options);

                this.$el.addClass('list');
                this.collectionEl = $$.ul({className: 'list-group'});

                this.on('attach', _(listenToSort).bind(this, this.model, true));
                this.on('detach', _(listenToSort).bind(this, this.model, false));
                if (this.options.attached) {
                    listenToSort.call(this, this.model, true);
                }
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
                if (content) {
                    this.collectionEl.appendChild(this._emptyContent = $$.li({className: 'list-group-item'}, content));
                }
            },

            onItemAdded: function () {
                this.renderClassNames(this.collectionEl);
            },

            onItemRemoved: function () {
                this.renderClassNames(this.collectionEl);
            },

            onItemChanged: function (model) {
                ensureProperPosition.call(this, model);
            }
        }));
    }
);
