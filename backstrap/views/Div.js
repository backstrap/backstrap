/**
 * A Backbone View that displays model-bound content with Bootstrap decoration.
 *
 * @author Kevin Perry perry@princeton.edu
 * @license MIT
 */
define(
    'backstrap/views/Div',
    ['../core', './ContentView'],
    function ($$) {
        return ($$.Div = $$.views.Div = $$.ContentView.extend({
            tagName: 'div'
        }));
    }
);
