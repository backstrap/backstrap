/**
 * A 'tag' that defines a menu item.
 * 
 * Given a label (string or DOM object) and an href (string),
 * this method manufactures an 'a' tag inside an 'li' tag.
 * The 'a' tag has attributes class="menuitem", role="menuitem", tabindex="-1".
 *
 * @author Kevin Perry perry@princeton.edu
 */
(function(context, moduleName, requirements)
{
    var fn = function($$)
    {
        return($$[moduleName] = $$.components[moduleName] = function (label, href, shortcut) {
            return $$.li($$.a({href: href, className: 'menuitem', role: 'menuitem', tabindex: -1},
                label,
                shortcut ? $$.span({className: 'shortcut'}, shortcut) : ''
            ));
        });
    };

    if (typeof context.define === 'function'
        && context.define.amd
        && !context._$$_backstrap_built_flag
    ) {
        context.define('backstrap/components/' + moduleName, requirements, fn);
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
}(this, 'menuItem', [ 'backstrap' ]));
