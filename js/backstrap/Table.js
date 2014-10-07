/**
 * A Backbone View that displays a model-bound table.
 * Largely from Backbone-UI's TableView class,
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
        var noop = function () {};
        
        return ($$[moduleName] = $$.CollectionView.extend({
            options: _($$.CollectionView.prototype.options).extend({
                // Each column should contain a <code>title</code> property to
                // describe the column's heading, a <code>content</code> property to
                // declare which property the cell is bound to, an optional two-argument
                // <code>comparator</code> with which to sort each column if the
                // table is sortable, and an optional <code>width</code> property to
                // declare the width of the column in pixels.
                columns: [],

                // A string, element, or function describing what should be displayed
                // when the table is empty.
                emptyContent: 'no entries',

                // An itemView that renders a table row.
                itemView: $$.View.extend({
                    tagName: 'tr',

                    render: function () {
                        
                        var row = this.el;

                        // TODO Need parent "this" for options.

                        // for each model, we walk through each column and generate the content
                        _(this.parentView.options.columns).each(function (column, index, list) {
                            var width = !!column.width ? parseInt(column.width, 10) + 5 : null;
                            var style = width ? 'width:' + width + 'px; max-width:' + width + 'px': null;
                            var content = this.resolveContent(this.model, column.content);
                            row.appendChild($$.td({
                                className: _(list).nameForIndex(index), 
                                style: style
                            }, $$.div({className: 'wrapper', style: style}, content)));
                        }, this);
        
                        // bind the item click callback if given
                        if (this.parentView.options.onItemClick) {
                            $(row).click(_(this.parentView.options.onItemClick).bind(this, this.model));
                        }

                        return this;
                    }
                }),

                // Clicking on the column headers will sort the table. See
                // <code>comparator</code> property description on columns.
                // The table is sorted by the first column by default.
                sortable: false,

                // A callback to invoke when the table is to be sorted and sortable is enabled. The callback will
                // be passed the <code>column</code> on which to sort.
                onSort: null,

                striped: false,
                bordered: false,
                hover: false,
                condensed: false,
                responsive: false
            }),

            initialize: function (options) {
                $$.CollectionView.prototype.initialize.call(this, options);
                this.options.itemViewOptions.columns = this.options.columns;
                $(this.el).addClass('table_view');
                this._sortState = {reverse: true};
            },

            render: function () {
                var table;
                var container = $$.div({
                        className: 'content' + (this.options.responsive ? ' table-responsive' : '')
                    },
                    table = $$.table({
                        className: 'table' +
                                (this.options.striped ? ' table-striped' : '') +
                                (this.options.bordered ? ' table-bordered' : '') +
                                (this.options.hover ? ' table-hover' : '') +
                                (this.options.condensed ? ' table-condensed' : ''),
                        cellPadding: '0',
                        cellSpacing: '0'
                    })
                );

                $(this.el).toggleClass('clickable', this.options.onItemClick !== noop);

                // generate a table row for our headings
                var headingRow = $$.tr();
                var sortFirstColumn = false;
                var firstHeading = null;
                _(this.options.columns).each(_(function (column, index, list) {
                    var label = _(column.title).isFunction() ? column.title() : column.title;
                    var width = !!column.width ? parseInt(column.width, 10) + 5 : null;
                    var style = width ? 'width:' + width + 'px; max-width:' + width + 'px; ' : '';
                    style += this.options.sortable ? 'cursor: pointer; ' : '';
                    column.comparator = _(column.comparator).isFunction() ? column.comparator : function (item1, item2) {
                        return item1.get(column.content) < item2.get(column.content) ? -1 :
                            item1.get(column.content) > item2.get(column.content) ? 1 : 0;
                    };

                    var firstSort = (sortFirstColumn && firstHeading === null);
                    var sortHeader = this._sortState.content === column.content || firstSort;
                    var sortClass = sortHeader ? (this._sortState.reverse && !firstSort ? ' asc' : ' desc') : '';
                    var sortLabel = $$.div({className: 'glyph'}, 
                        sortClass === ' asc' ? '\u25b2 ' : sortClass === ' desc' ? '\u25bc ' : '');

                    var onclick = this.options.sortable ? (_(this.options.onSort).isFunction() ?
                        _(function (e) { this.options.onSort(column); }).bind(this) :
                        _(function (e, silent) { this._sort(column, silent); }).bind(this)) : noop;

                    var th = $$.th({
                            className: _(list).nameForIndex(index) + (sortHeader ? ' sorted' : ''), 
                            style: style, 
                            onclick: onclick
                        }, 
                        $$.div({className: 'wrapper' + (sortHeader ? ' sorted': '')}, label),
                        sortHeader ? $$.div({className: 'sort_wrapper' + sortClass}, sortLabel) : null).appendTo(headingRow);

                    if (firstHeading === null) firstHeading = th;
                }).bind(this));
                if (sortFirstColumn && !!firstHeading) {
                    firstHeading.onclick(null, true);
                }

                // now we'll generate the body of the content table, with a row
                // for each model in the bound collection
                this.collectionEl = $$.tbody();
                table.appendChild(this.collectionEl);

                $$.CollectionView.prototype.render.call(this);

                // wrap the list in a scroller
                if (_(this.options.maxHeight).exists()) {
                    var style = 'overflow:auto; max-height:' + this.options.maxHeight + 'px';
                    container = $$.div({style: style}, container);
                }

                // Add the heading row to its very own table so we can allow the
                // actual table to scroll with a fixed heading.
                this.$el.append(
                    $$.table({
                            className: 'heading',
                            cellPadding: '0',
                            cellSpacing: '0'
                        },
                        $$.thead(headingRow)),
                    container
                );

                this.renderClassNames(this.collectionEl);

                return this;
            },

            placeItem: function (item) {
                $(this.collectionEl).append(item);
            },

            placeEmpty: function (content) {
                $(this.collectionEl).append($$.tr($$.td(content)));
            },

            _sort: function (column, silent) {
                this._sortState.reverse = !this._sortState.reverse;
                this._sortState.content = column.content;
                var comp = column.comparator;
                if (this._sortState.reverse) {
                    comp = function (item1, item2) {
                        return -column.comparator(item1, item2);
                    };
                }
                this.model.comparator = comp;
                this.model.reset(this.model.models, {silent: !!silent});
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
}(this, 'Table', [ 'backstrap', 'backstrap/CollectionView' ]));
