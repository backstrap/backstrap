/**
 * A 'tag' that defines a Bootstrap navbar content group.
 * The navbarGroup is a $$.ul(), so you should populate it with $$.li()'s.
 *
 * @author Kevin Perry perry@princeton.edu
 */
define(
    'backstrap/components/navbarGroup',
    ['../core', 'jquery'],
    function ($$, $) {
        return($$.navbarGroup = $$.components.navbarGroup = function (attrs) {
            var el;
            var align = 'left';

            if (typeof attrs === 'object' && attrs.nodeType !== 1) {
                if ('align' in attrs) {
                    if (attrs.align === 'right') {
                        align = attrs.align;
                    }
                    delete(attrs.align);
                }
            }

            el = $$.ul.apply($$, arguments);
            $(el).addClass('nav navbar-nav navbar-' + align);

            return el;
        });
    }
);
