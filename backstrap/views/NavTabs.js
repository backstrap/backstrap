/**
 * A model-bound Bootstrap tabs nav object.
 *
 * @author Kevin Perry perry@princeton.edu
 * @license MIT
 */
define(
    'backstrap/views/NavTabs',
    ['../core', './List'],
    function ($$) {
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

        return ($$.NavTabs = $$.views.NavTabs = $$.List.extend({

            initialize: function (options) {
                this.options.itemView = ItemView;
                $$.List.prototype.initialize.call(this, options);
            },

            render: function () {
                $$.List.prototype.render.call(this);
                this.$('> ul').addClass('nav nav-tabs');
                return this;
            }
        }));
    }
);
