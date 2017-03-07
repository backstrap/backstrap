/**
 * A Bootstrap dropdown menu tag set.
 * 
 * @author Kevin Perry perry@princeton.edu
 * @license MIT
 */
define("backstrap/components/closeIcon", ["../core"], function ($$)
{
    return($$.closeIcon = $$.components.closeIcon = function () {
        return $$.plain.button({className: 'close', type: 'button'},
            $$.span({'aria-hidden': true}, String.fromCharCode(215)),
            $$.span({className: 'sr-only'}, 'Close')
        );
    });
});
