/**
 * A 'tag' that defines a Bootstrap navbar content group.
 * The navgroup is a $$.ul(), so you should populate it with $$.li()'s.
 *
 * @author Kevin Perry perry@princeton.edu
 * @copyright 2014 The Trustees of Princeton University.
 */
(function(context, moduleName, requirements)
{
    var fn = function($$)
    {
        return($$[moduleName] = function (attrs)
            {
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
            }
        );
    };

    if (typeof context.define === 'function'
        && context.define.amd
        && !context._$$_backstrap_built_flag
    ) {
        context.define('backstrap/' + moduleName, requirements, fn);
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
}(this, 'navgroup', [ 'backstrap' ]));
