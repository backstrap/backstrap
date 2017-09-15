/**
 * A Bootstrap dropdown menu tag set.
 *
 * @author Kevin Perry perry@princeton.edu
 * @license MIT
 */
define(
    'backstrap/components/dropdownGroup',
    ['../core', 'jquery'],
    function ($$, $) {
        return ($$.dropdownGroup = $$.components.dropdownGroup = function (attrs) {
            var offset = 0;
            var argsHead = new Array();

            if (typeof attrs === 'object' && attrs.nodeType !== 1) {
                argsHead.push(attrs);
                offset = 1;
                if (attrs.labelContent) {
                    argsHead.push($$.li({className: 'header'}, attrs.labelContent));
                    delete(attrs.labelContent);
                }
            }

            return $$.li(
                $($$.ul.apply($$, argsHead.concat(
                    Array.prototype.slice.call(arguments, offset)
                ))).addClass('dropdown-menu dropdown-menu-group')
            );
        });
    }
);
