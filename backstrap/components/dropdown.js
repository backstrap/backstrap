/**
 * A Bootstrap dropdown menu tag set.
 * 
 * @author Kevin Perry perry@princeton.edu
 * @license MIT
 */
define("backstrap/components/dropdown", ["../core", "jquery", "underscore"], function ($$, $, _)
{
    return ($$.dropdown = $$.components.dropdown = function (attrs){
        var options = attrs;
        var offset = 1;
        var el = $$.li();
        var $el = $(el);
        var topTag = $$.a;

        if (typeof attrs !== 'object' || attrs.nodeType === 1) {
            options = {context: 'default', labelContent: ''};
            offset = 0;
        }

        if (options.type === 'button' || options.type === 'split-button') {
            topTag = $$.button;
        }

        if (options.multiSelect) {
            // TODO how to keep it from closing so you can select many things??
            var isActive = $($(this).attr('data-target')).hasClass('open');
        }

        var button = topTag.call($$,
            {
                className: 'dropdown-toggle',
                context: options.context,
                id: _.uniqueId('Bkp'),
                'data-toggle': 'dropdown'
            },
            String.fromCharCode(160), // &nbsp; to get proper height and spacing.
            $$.caret()
        );

        // allow bubble-up to Bootstrap's Dropdown event handler
        $(button).on('click', function () { return true; });
        $el.addClass(options.dropup ? 'dropup' : 'dropdown');

        if (options.type === 'split-button') {
            $el.addClass('btn-group');
            $el.append($$.button({
                        context: options.context,
                        type: 'button'
                    },
                    options.labelContent
                ),
                button
            );
            $(button).append($$.span({className: 'sr-only'}, 'Toggle Dropdown'));
        } else {
            $el.append(button);
            $(button).prepend(options.labelContent);
        }
        
        var collectionEl;
        $el.append(collectionEl = $($$.ul(
            {
                className: 'dropdown-menu',
                role: 'menu',
                'aria-labelledby': button.id
            },
            Array.prototype.slice.call(arguments, offset)
        )));
        
        if (options.maxHeight) {
            collectionEl.css({maxHeight: options.maxHeight, overflowY: 'scroll'});
        }

        if ('align' in options) {
            collectionEl.addClass(options.align === 'right' ?
                'dropdown-menu-right' :
                'dropdown-menu-left'
            );
        }
        
        return el;
    });
});
