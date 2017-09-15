/**
 * A mixin for dealing with focus in / focus out
 *
 * @author Kevin Perry perry@princeton.edu
 * @license MIT
 */
define(
    'backstrap/mixins/HasFocus',
    ['../core', 'jquery', 'underscore'],
    function ($$, $, _) {
        return ($$.mixins.HasFocus = $$.HasFocus = {
            setupFocus : function (el, parent) {

                // add focusin
                $(el).focusin(_(function(e) {
                    $(parent).addClass('focused');
                }).bind(this));

                // add focusout
                $(el).focusout(_(function(e) {
                    $(parent).removeClass('focused');
                }).bind(this));
            }
        });
    }
);
