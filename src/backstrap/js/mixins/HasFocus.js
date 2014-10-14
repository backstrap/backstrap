/**
 * A mixin for dealing with focus in / focus out
 *
 * @author Kevin Perry perry@princeton.edu
 * @license MIT
 */
(function(context, moduleName, requirements)
{
    var fn = function($$)
    {
        return ($$.mixins[moduleName] = $$[moduleName] = {
            setupFocus : function(el, parent) {
            
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
    };

    if (typeof context.define === 'function'
        && context.define.amd
        && !context._$$_backstrap_built_flag
    ) {
        context.define('backstrap/mixins' + moduleName, requirements, fn);
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
}(this, 'HasFocus', [ 'backstrap' ]));
