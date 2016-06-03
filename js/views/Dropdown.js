/**
 * A Backbone View that displays a model-bound dropdown list.
 * Largely from Backbone-UI's Pulldown class,
 * with Bootstrap decoration.
 * 
 * @author Kevin Perry perry@princeton.edu
 * @license MIT
 */
define("backstrap/views/Dropdown", ["../core", "jquery", "underscore"], function ($$, $, _)
{
    var ItemView = $$.View.extend({
        tagName: function () {
            var elem = this.model.get('element');
            return (elem === 'divider' || elem === 'separator' || elem === 'header') ? 'span' : 'a';
        },

        initialize: function (options) {
            $$.View.prototype.initialize.call(this, options);
            var elem = this.model.get('element');
            if (elem === 'header') {
                this.$el.text(this.model.get('label'));
            } else  if (elem !== 'divider' && elem !== 'separator') {
                this.$el.addClass('menuitem').attr({
                    role: 'menuitem',
                    tabindex: -1,
                    href: this.model.get('href')
                }).append(this.model.get('label'));
            }
        }
    });

    return ($$.Dropdown = $$.views.Dropdown = $$.List.extend({
        options: {
            type: 'plain', // also allowed: 'button' or 'split-button'.
            itemView: ItemView
        },
        
        initialize: function (options) {
            $$.List.prototype.initialize.call(this, options);

            var topTag = $$.a;
            var topAttrs = {
                className: 'dropdown-toggle',
                context: this.options.context,
                id: _.uniqueId('Bkp'),
                'data-toggle': 'dropdown'
            };

            if (this.options.type !== 'plain') {
                topAttrs['type'] = 'button';
                topTag = $$.button;
            }

            this.button = topTag.call($$,
                topAttrs,
                String.fromCharCode(160), // &nbsp; to get proper height and spacing.
                $$.caret()
            );

            // allow bubble-up to Bootstrap's Dropdown event handler
            $(this.button).on('click', function () { return true; });
            this.$el.addClass(this.options.dropup ? 'dropup' : 'dropdown');

            if (this.options.type === 'split-button') {
                this.$el.addClass('btn-group');
                this.labelButton = $$.button({
                        context: this.options.context,
                        type: 'button'
                    },
                    this.options.labelContent
                );
                $(this.button).append($$.span({className: 'sr-only'}, 'Toggle Dropdown'));
            } else {
                $(this.button).prepend(this.options.labelContent);
            }
            
            if ('align' in this.options) {
                $(this.collectionEl).addClass(this.options.align === 'right' ?
                    'dropdown-menu-right' :
                    'dropdown-menu-left'
                );
            }
            
            $(this.collectionEl).addClass('dropdown-menu').attr({
                role: 'menu',
                'aria-labelledby': this.button.id
            });
        },
        
        render: function () {
            $$.List.prototype.render.call(this);
            this.$el.prepend(this.button);
            if (this.labelButton) {
                this.$el.prepend(this.labelButton);
            }
            return this;
        },
        
        placeItem: function (content, model, index) {
            var elem = model.get('element');
            this.collectionEl.appendChild($$.li({
                role: 'presentation',
                className: (elem === 'divider' || elem === 'separator') ? 'divider' :
                    (elem === 'header') ? 'dropdown-header' : ''
            }, content));
        }
    }));
});
