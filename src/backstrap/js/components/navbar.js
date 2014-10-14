/**
 * A 'tag' that defines a Bootstrap navbar component.
 *
 * Options:
 *     brandContent: '' - Branding visual (a DOM object).
 *     brandUrl: '#' - URL for brand href.
 *     position: '' - Allowed: 'fixed-top', 'fixed-bottom' or 'static-top'.
 *     inverse: false - Invert color scheme
 *     toggleContent: Alternate visual for navbar collapse toggle (a DOM object; defaults to a 3-bar hamburger).
 *     sr_toggle_text: 'Toggle navigation' - For screen-readers
 *     role: 'navigation' - For accessibility
 *
 * @author Kevin Perry perry@princeton.edu
 */
(function(context, moduleName, requirements)
{
    var fn = function($$)
    {
        return($$[moduleName] = $$.components[moduleName] = function (attrs)
            {
                var el, content, collapser, toggleContent = '';
                var offset = 1;
                var brandContent = '';
                var brandUrl = '#';
                var className = 'navbar-default';
                var sr_toggle_text = 'Toggle navigation';
                var collapserId = _.uniqueId('Bkp');

                if (typeof attrs !== 'object' || attrs.nodeType === 1) {
                    attrs = {};
                    offset = 0;
                } else {
                    if ('brandContent' in attrs) {
                        brandContent = attrs.brandContent;
                        delete(attrs.brandContent);
                    }
                    if ('brandUrl' in attrs) {
                        brandUrl = attrs.brandUrl;
                        delete(attrs.brandUrl);
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
                    if ('toggleContent' in attrs) {
                        toggleContent = attrs.toggleContent;
                        delete(attrs.toggleContent);
                    } else {
                        toggleContent = $$.span(
                            $$.span({className: 'icon-bar'}),
                            $$.span({className: 'icon-bar'}),
                            $$.span({className: 'icon-bar'})
                        );
                    }
                    if ('sr_toggle_text' in attrs) {
                        sr_toggle_text = attrs.sr_toggle_text;
                        delete(attrs.sr_toggle_text);
                    }
                }
                if (!('role' in attrs)) {
                    attrs.role = 'navigation';
                }

                el = $$.nav(attrs);
                content = Array.prototype.slice.call(arguments, offset);
                collapser = $$.div({className: 'collapse navbar-collapse', id: collapserId});
                $(collapser).append.apply($(collapser), content);

                $(el).addClass('navbar ' + className).append(
                    $$.div({className: 'container container-fluid'},
                        $$.div({className: 'navbar-header'},
                            $$.button({
                                    type: 'button',
                                    className: 'navbar-toggle collapsed',
                                    'data-toggle': 'collapse',
                                    'data-target': '#' + collapserId
                                },
                                $$.span({className: 'sr-only'}, sr_toggle_text),
                                toggleContent
                            ),
                            $$.a({
                                    className: 'navbar-brand',
                                    href: brandUrl
                                }, brandContent
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
}(this, 'navbar', [ 'backstrap' ]));
