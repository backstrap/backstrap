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
                var offset = 1;
                var options = attrs;
                if (typeof attrs !== 'object' || attrs.nodeType === 1) {
                    options = {};
                    offset = 0;
                }
                
                var obj = $$.ul.apply($$,
                    [
                        options,
                        $$.li({className: 'header'}, options.label)
                    ].concat(
                        Array.prototype.slice.call(arguments, offset)
                    ));
                $(obj).addClass('dropdown-menu dropdown-menu-group');
                
                return $$.li(obj);
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
