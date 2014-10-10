/**
 * A Backbone View that displays a model-bound list.
 * Based on Backbone-UI's ListView,
 * with Bootstrap decoration.
 * 
 * @author Kevin Perry perry@princeton.edu
 * @copyright 2014 The Trustees of Princeton University.
 * @license MIT
 */
(function (context, moduleName, requirements)
{
    var fn = function ($$)
    {
        var ensureProperPosition = function (model) {
            if (this.model.comparator) {
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
            this.renderClassNames(this.collectionEl);
        };

        return ($$[moduleName] = $$.CollectionView.extend({
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

                this.renderClassNames(this.collectionEl);
                this.$el.append(this.collectionEl);

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
                this.renderClassNames(this.collectionEl);
            },

            onItemRemoved: function () {
                this.renderClassNames(this.collectionEl);
            },

            onItemChanged: function (model) {
                ensureProperPosition.call(this, model);
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
}(this, 'List', [ 'backstrap', 'backstrap/CollectionView' ]));