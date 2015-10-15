/**
 * A Backbone CollectionView that displays a list of menuItems.
 * 
 * @author Kevin Perry perry@princeton.edu
 * @license MIT
 */
(function(context, moduleName, requirements)
{
    var fn = function($$)
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
    
        return ($$[moduleName] = $$.views[moduleName] = $$.CollectionView.extend({
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
    };

    if (typeof context.define === 'function'
        && context.define.amd
        && !context._$$_backstrap_built_flag
    ) {
        context.define('backstrap/views/' + moduleName, requirements, fn);
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
}(this, 'DropdownGroup', [ 'backstrap', 'backstrap/views/List' ]));
