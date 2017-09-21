/**
 * A Backbone View that displays a model-bound image.
 *
 * @author Kevin Perry perry@princeton.edu
 * @license MIT
 */
define(
    'backstrap/views/Img',
    ['../core', './AttributeView'],
    function ($$) {
        return ($$.Img = $$.views.Img = $$.AttributeView.extend({
            tagName: 'img',
            attribute: 'src'
        }));
    }
);
