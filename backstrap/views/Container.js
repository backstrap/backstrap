/**
 * A Backbone View that displays a Bootstrap container div.
 * 
 * @author Kevin Perry perry@princeton.edu
 * @license MIT
 */
define("backstrap/views/Container", ["../core", "../View"], function ($$)
{
    return ($$.Container = $$.views.Container = $$.View.extend({
        initialize : function(options) {
            $$.View.prototype.initialize.call(this, options);
            this.$el.addClass('container');
        }
    }));
});
