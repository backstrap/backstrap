/**
 * A 'tag' that defines a menu item.
 * 
 * Given a label (string or DOM object) and an href (string),
 * this method manufactures an 'a' tag inside an 'li' tag.
 * The 'a' tag has attributes class="menuitem", role="menuitem", tabindex="-1".
 *
 * @author Kevin Perry perry@princeton.edu
 */
define("backstrap/components/menuItem", ["../core"], function ($$)
{
    return($$.menuItem = $$.components.menuItem = function (label, href, shortcut) {
        return $$.li($$.a({href: href, className: 'menuitem', role: 'menuitem', tabindex: -1},
            label,
            shortcut ? $$.span({className: 'shortcut'}, shortcut) : ''
        ));
    });
});
