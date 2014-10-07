/**
 * A 'tag' that defines a Bootstrap navbar component.
 *
 * Options:
 *     brand: '' - Branding for left-hand icon.
 *     position: '' - Allowed: 'fixed-top', 'fixed-bottom' or 'static-top'.
 *     inverse: false - Invert color scheme
 *     sr_toggle_text: 'Toggle navigation' - For screen-readers
 *     role: 'navigation' - For accessibility
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
                var el, content, collapser;
                var offset = 0;
                var brand = '';
                var className = 'navbar-default';
                var sr_toggle_text = 'Toggle navigation';

                if (typeof attrs !== 'object' || attrs.nodeType === 1) {
                    attrs = {};
                } else {
                    offset = 1;
                    if ('brand' in attrs) {
                        brand = attrs.brand;
                        delete(attrs.brand);
                    }
                    if ('inverse' in attrs) {
                        className = attrs.inverse ? 'navbar-inverse' : 'navbar-default';
                        delete(attrs.inverse);
                    }
                    if ('position' in attrs) {
                        if (attrs.position === 'fixed-bottom'
                            || attrs.position === 'fixed-top'
                            || attrs.position === 'static-top'
                        ) {
                            className += ' navbar-' + attrs.position;
                        }
                        delete(attrs.position);
                    }
                    if ('sr_toggle_text' in attrs) {
                        sr_toggle_text = attrs.sr_toggle_text;
                        delete(attrs.sr_toggle_text);
                    }
                }
                if (!('role' in attrs)) {
                    attrs.role = 'navigation';
                }

                el = $$.apply(this, ['nav', 'navbar', attrs]);
                content = Array.prototype.slice.call(arguments, offset);
                collapser = $$.div({className: 'collapse navbar-collapse', id: _.uniqueId('$$')}, content);

                $(el).addClass(className).append(
                    $$.div({className: 'container container-fluid'},
                        $$.div({className: 'navbar-header'},
                            $$.button({
                                    type: 'button',
                                    className: 'navbar-toggle collapsed',
                                    'data-toggle': 'collapse',
                                    'data-target': '#' + $(collapser).attr('id')
                                },
                                $$.span({className: 'sr-only'}, sr_toggle_text),
                                $$.span({className: 'icon-bar'}),
                                $$.span({className: 'icon-bar'}),
                                $$.span({className: 'icon-bar'})
                            ),
                            $$.a({
                                    className: 'navbar-brand',
                                    href: '#'
                                }, brand
                            )
                        ),
                        collapser
                    )
                );

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
}(this, 'navbar', [ 'backstrap' ]));
