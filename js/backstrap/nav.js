/**
 * A 'tag' that defines a Bootstrap nav - a navigation group.
 *
 * The nav is a $$.ul(), so you should populate it with $$.li()'s.
 * You should provide a type, either "type: 'tabs'" or "type: 'pills'".
 * You can also specify attributes "justified: true" for justified tabs or pills,
 * and "stacked: true" for stacked pills.
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
                var type = '';

                if (typeof attrs === 'object' && attrs.nodeType !== 1) {
                    if ('type' in attrs) {
                        if (attrs.type === 'tabs' && !('role' in attrs)) {
                            attrs.role = 'tablist';
                        }
                        if (attrs.type === 'tabs' || attrs.type === 'pills') {
                            type = ' navbar-' + attrs.type;
                        }
                        delete(attrs.type);
                    }
                    if ('justified' in attrs) {
                        if (attrs.justified) {
                            type += ' navbar-justified';
                        }
                        delete(attrs.justified);
                    }
                    if ('stacked' in attrs) {
                        if (attrs.stacked) {
                            type += ' navbar-stacked';
                        }
                        delete(attrs.stacked);
                    }
                }

                el = $$.ul.apply($$, arguments);
                $(el).addClass('nav' + type);

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
}(this, 'nav', [ 'backstrap' ]));
