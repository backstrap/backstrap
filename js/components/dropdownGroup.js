/**
 * A Bootstrap dropdown menu tag set.
 * 
 * @author Kevin Perry perry@princeton.edu
 * @license MIT
 */
(function(context, moduleName, requirements)
{
    var fn = function($$)
    {
        return ($$[moduleName] = $$.components[moduleName] = function (attrs)
            {
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
                
                var list = $$.ul.apply($$, argsHead.concat(
                    Array.prototype.slice.call(arguments, offset)
                ));
                $(list).addClass('dropdown-menu dropdown-menu-group');
                
                return $$.li(list);
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
}(this, 'dropdownGroup', [ 'backstrap' ]));
