/**
 * A Backbone View that displays a model-bound anchor with Bootstrap decoration.
 *
 * @author Kevin Perry perry@princeton.edu
 * @license MIT
 */
define(
    'backstrap/views/A',
    ['../core', './AttributeView'],
    function ($$) {
        return ($$.A = $$.views.A = $$.AttributeView.extend({
            tagName: 'a',
            attribute: 'href'
        }));
    }
);
