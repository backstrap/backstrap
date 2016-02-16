/**
 * A 'tag' that defines a Bootstrap navbar content group.
 * The navbarForm is a $$.form(), so you should populate it
 * with $$.formGroups()'s and form items.
 *
 * @author Kevin Perry perry@princeton.edu
 */
define("backstrap/components/navbarForm", ["../core", "jquery"], function ($$, $)
{
    return($$.navbarForm = $$.components.navbarForm = function (attrs) {
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
        $(el).addClass('navbar-form navbar-' + align);

        return el;
    });
});
