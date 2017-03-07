/**
 * A 'tag' that defines a Bootstrap nav - a navigation group.
 *
 * The nav is a $$.ul(), so you should populate it with $$.li()'s.
 * You should provide a type, either "type: 'tabs'" or "type: 'pills'".
 * You can also specify attributes "justified: true" for justified tabs or pills,
 * and "stacked: true" for stacked pills.
 *
 * @author Kevin Perry perry@princeton.edu
 */
define("backstrap/components/nav", ["../core", "jquery"], function ($$, $)
{
    return($$.nav = $$.components.nav = function (attrs) {
        var el;
        var type = '';

        if (typeof attrs === 'object' && attrs.nodeType !== 1) {
            if ('type' in attrs) {
                if (attrs.type === 'tabs' && !('role' in attrs)) {
                    attrs.role = 'tablist';
                }
                if (attrs.type === 'tabs' || attrs.type === 'pills') {
                    type = ' nav-' + attrs.type;
                }
                delete(attrs.type);
            }
            if ('justified' in attrs) {
                if (attrs.justified) {
                    type += ' nav-justified';
                }
                delete(attrs.justified);
            }
            if ('stacked' in attrs) {
                if (attrs.stacked) {
                    type += ' nav-stacked';
                }
                delete(attrs.stacked);
            }
        }

        el = $$.ul.apply($$, arguments);
        $(el).addClass('nav' + type);
        el.clearActive = function () {
            $('> *', this).removeClass('active');
            return this;
        };

        return el;
    });
});
