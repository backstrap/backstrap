/**
 * A mixin for those views that are model bound.
 *
 * @author Kevin Perry perry@princeton.edu
 */
define(
    'backstrap/mixins/HasModel',
    ['../core', 'underscore'],
    function ($$, _) {
        return($$.mixins.HasModel = $$.HasModel = {
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

            _observeModel : function (callback) {
                if(_(this.model).exists() && _(this.model.off).isFunction()) {
                    _(['content', 'labelContent']).each(function(prop) {
                        var key = this.options[prop];
                        if(_(key).isString()) {
                            if (key.indexOf('.') > 0) {
                                key = key.substr(0, key.indexOf('.'));
                            }
                            key = 'change:' + key;
                            this.model.off(key, callback);
                            this.model.on(key, callback);
                        } else if (_(key).exists()) {
                            this.model.off('change', callback);
                            this.model.on('change', callback);
                        }
                    }, this);
                }
            },

            _unobserveModel : function (callback) {
                if(_(this.model).exists() && _(this.model.off).isFunction()) {
                    _(['content', 'labelContent']).each(function(prop) {
                        var key = this.options[prop];
                        if(_(key).isString()) {
                            if (key.indexOf('.') > 0) {
                                key = key.substr(0, key.indexOf('.'));
                            }
                            key = 'change:' + key;
                            this.model.off(key, callback);
                        } else if (_(key).exists()) {
                            this.model.off('change', callback);
                        }
                    }, this);
                }
            }
        });
    }
);
