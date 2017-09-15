/**
 * Creates a Bootstrap grid layout object.
 *
 * @author Kevin Perry perry@princeton.edu
 */
define(
    'backstrap/components/grid',
    ['../core', 'jquery'],
    function ($$, $) {
        var appendGridRows = function (layout) {
            for (var r=0; r<layout.length; r++) {
                this.appendRow(layout[r]);
            }
        };

        var parseCellSpec = function (spec) {
            var str = 'col';
            for (var prop in spec) {
                if (prop === 'className') {
                    str += ' ' + spec[prop];
                } else {
                    var sz = $$._mapSize(prop);
                    if (sz) {
                        str += ' col-' + sz + '-' + spec[prop];
                    }
                }
            }
            return str;
        };

        var appendGridRow = function (layout) {
            var rowdiv = $$.div({className: 'row'});
            $(this).append(rowdiv);
            for (var c=0; c<layout.length; c++) {
                var cell = layout[c];
                var cellClass;
                var content = '';
                if (cell !== null && typeof cell === 'object') {
                    cellClass = parseCellSpec(cell);
                    content = ('content' in cell) ? cell.content : '';
                } else {
                    cellClass = 'col col-md-' + cell;
                }
                $(rowdiv).append($$.div({className: cellClass}, content));
            }
        };

        return ($$.grid = $$.components.grid = function () {
            var layout;
            var cn = 'container';

            layout = [[12]];
            if (typeof(arguments[0]) === 'object') {
                if ('layout' in arguments[0]) {
                    layout = arguments[0].layout;
                    delete arguments[0].layout;
                }
                if ('fluid' in arguments[0]) {
                    cn = arguments[0].fluid ? 'container-fluid' : cn;
                    delete arguments[0].fluid;
                }
            }
            var el = $$.apply(this,
                ['div', null].concat(Array.prototype.slice.call(arguments)));
            $(el).addClass(cn);
            el.appendRows = appendGridRows;
            el.appendRow = appendGridRow;
            el.getRow = function () {
                return $('> *:nth-child('+row+') ', el);
            };
            el.getCell = function (row, col) {
                return $('> *:nth-child('+row+') > *:nth-child(' + col + ') ', el);
            };
            el.appendRows(layout);
            return el;
        });
    }
);
