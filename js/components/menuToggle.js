/**
 * A 'tag' that defines a toggleable  menu item.
 * 
 * Adds a toggleable checkbox to a menuItem.
 *
 * @author Kevin Perry perry@princeton.edu
 */
(function(context, moduleName, requirements)
{
    var fn = function($$)
    {
        return($$[moduleName] = $$.components[moduleName] = function (label, href, shortcut)
            {
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
            }
        );
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
}(this, 'menuToggle', [ 'backstrap' ]));
