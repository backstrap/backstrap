/**
 * A Backbone View that displays a Bootstrap panel div.
 * 
 * @author Kevin Perry perry@princeton.edu
 * @license MIT
 */
define("backstrap/views/Panel", ["../core"], function ($$)
{
    return ($$.Panel = $$.views.Panel = $$.View.extend({
        initialize : function(options) {
            $$.View.prototype.initialize.call(this, options);
            this.$el.addClass('panel');
        }
    }));
});
