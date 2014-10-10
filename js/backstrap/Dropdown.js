/**
 * A Backbone View that displays a model-bound dropdown list.
 * Largely from Backbone-UI's Pulldown class,
 * with Bootstrap decoration.
 * 
 * @author Kevin Perry perry@princeton.edu
 * @copyright 2014 The Trustees of Princeton University.
 * @license MIT
 */
(function(context, moduleName, requirements)
{
    var fn = function($$)
    {
        var ItemView = $$.View.extend({
            tagName: function () {
                var elem = this.model.get('element');
                return (elem === 'divider' || elem === 'separator' || elem === 'header') ? 'span' : 'a';
            },
    
            initialize: function render() {
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
                return this;
            }
        });
        
    
        return ($$[moduleName] = $$.List.extend({
            className: 'dropdown',
    
            initialize: function (options) {
                this.options.itemView = ItemView;
                $$.List.prototype.initialize.call(this, options);

                this.button = $$.button({
                        className: 'dropdown-toggle',
                        context: this.options.context,
                        id: _.uniqueId('Bkp'),
                        type: 'button',
                        'data-toggle': 'dropdown'
                    },
                    String.fromCharCode(160), // &nbsp; to get proper height.
                    $$.caret()
                );
                // allow bubble-up to Bootstrap's Dropdown event handler
                $(this.button).on('click', function () { return true; });
                
                if (this.options.split) {
                    this.$el.addClass('btn-group');
                    this.labelButton = $$.button({
                            context: this.options.context,
                            type: 'button'
                        },
                        this.options.buttonLabel
                    );
                    $(this.button).append($$.span({className: 'sr-only'}, 'Toggle Dropdown'));
                } else {
                    $(this.button).prepend(this.options.buttonLabel);
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
                this.$el.prepend(this.labelButton);
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
    };

    if (typeof context.define === 'function'
        && context.define.amd
        && !context._$$_backstrap_built_flag
    ) {
        context.define('backstrap/' + moduleName, requirements, fn);
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
}(this, 'Dropdown', [ 'backstrap', 'backstrap/List', 'backstrap/Button' ]));
