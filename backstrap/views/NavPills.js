/**
 * A model-bound Bootstrap pills nav object.
 * 
 * @author Kevin Perry perry@princeton.edu
 * @license MIT
 */
define("backstrap/views/NavPills", ["../core", "./List"], function ($$)
{
    var ItemView = $$.View.extend({
        tagName: 'a',
        className: 'nav-item',
        
        render: function render() {
            this.$el.addClass('nav-item-' + this.model.get('name'))
                .attr('href', this.model.get('href'))
                .text(this.model.get('label'));
            return this;
        }
    });
    
    return ($$.NavPills = $$.views.NavPills = $$.List.extend({

        initialize: function (options) {
            this.options.itemView = ItemView;
            $$.List.prototype.initialize.call(this, options);
        },

        render: function () {
            $$.List.prototype.render.call(this);
            this.$('> ul').addClass('nav nav-pills');
            return this;
        }
    }));
});
