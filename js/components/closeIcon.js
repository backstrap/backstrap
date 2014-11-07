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
        return($$[moduleName] = $$.components[moduleName] = function ()
            {
                return $$.plain.button({className: 'close', type: 'button'},
                        $$.span({'aria-hidden': true}, String.fromCharCode(215)),
                        $$.span({className: 'sr-only'}, 'Close')
                );
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
}(this, 'closeIcon', [ 'backstrap' ]));
