/**
 * A Backbone CollectionView that displays a list of menuItems.
 * 
 * @author Kevin Perry perry@princeton.edu
 * @license MIT
 */
define("backstrap/views/DropdownGroup", ["../core", "jquery"], function ($$, $)
{
    var ItemView = $$.View.extend({
        tagName: 'li',
        className: 'menuitem',

        render: function () {
            this.$el.empty().append($$.a({
                    className: 'menuitem',
                    role: 'menuitem',
                    tabindex: -1,
                    href: this.resolveContent(this.model, this.options.content, 'href')
                },
                this.resolveContent(this.model, this.options.labelContent, 'label')
            ));
            
            return this;
        }
    });

    return ($$.DropdownGroup = $$.views.DropdownGroup = $$.CollectionView.extend({
        tagName: 'li',
        options: {
            itemView: ItemView
        },
        
        initialize: function (options) {
            $$.CollectionView.prototype.initialize.call(this, options);
            this.list = $$.ul({className: 'dropdown-menu dropdown-menu-group'});
        },
        
        render: function () {
            $(this.list).empty();
            $$.CollectionView.prototype.render.call(this);
            this.$el.append(this.list);
            return this;
        },
        
        placeItem: function (content) {
            this.list.appendChild(content);
        }
    }));
});
