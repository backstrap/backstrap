/**
 * A 'tag' that defines a toggleable  menu item.
 * 
 * Adds a toggleable checkbox to a menuItem.
 *
 * @author Kevin Perry perry@princeton.edu
 */
define("backstrap/components/menuToggle", ["../core", "jquery"], function ($$, $) {
    return($$.menuToggle = $$.components.menuToggle = function (label, href, shortcut) {
        var input = $$.plain.input({type: 'checkbox', className: 'menu-toggle'});
        var item = $$.li($$.a({href: href, className: 'menuitem', role: 'menuitem', tabindex: -1},
            input,
            label,
            shortcut ? $$.span({className: 'shortcut'}, shortcut) : ''
        ));
        $(item).on('click', function () {
            $(input).prop('checked', function(i, value) {
                return !value; 
            });
        });
        return item;
    });
});
