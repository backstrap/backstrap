/**
 * A mixin for those views that are model bound.
 *
 * @author Kevin Perry perry@princeton.edu
 */
(function(context, moduleName, requirements)
{
    var fn = function($$)
    {
        return($$.mixins[moduleName] = $$[moduleName] = {
            options : {
                // The Model instance the view is bound to.
                model : null,

                // The property of the bound model this component should render / update.
                // If a function is given, it will be invoked with the model and will 
                // expect an element to be returned.    If no model is present, this 
                // property may be a string or function describing the content to be rendered.
                content : null,

                // If provided this content will wrap the component with additional label.
                // The text displayed by the label is determined the same way the content attribute.
                // For Checkbox and Label.
                labelContent : null,

                // If present, a square glyph area will be added to the left side of this 
                // component, and the given string will be used as the class name
                // property of that glyph area. This option is a no-op when applied 
                // to Calender and Menu components. 
                glyphLeftClassName : null,

                // Same as above, but on the right side.
                glyphRightClassName : null

            },

            _observeModel : function(callback) {
                if(_(this.model).exists() && _(this.model.off).isFunction()) {
                    _(['content', 'labelContent']).each(function(prop) {
                        var key = this.options[prop];
                        if(_(key).exists()) {
                            key = 'change:' + key;
                            this.model.off(key, callback);
                            this.model.on(key, callback);
                        }
                    }, this);
                }
            },

            _unobserveModel : function(callback) {
                if(_(this.model).exists() && _(this.model.off).isFunction()) {
                    _(['content', 'labelContent']).each(function(prop) {
                        var key = this.options[prop];
                        if(_(key).exists()) {
                            key = 'change:' + key;
                            this.model.off(key, callback);
                        }
                    }, this);
                }
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
}(this, 'HasModel', [ 'backstrap' ]));
