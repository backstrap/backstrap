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
                _(['content', 'labelContent']).each(_.bind(this.observeModel, this, callback));
            },

            _unobserveModel : function (callback) {
                _(['content', 'labelContent']).each(_.bind(this.unobserveModel, this, callback));
            },

            // TODO listenTo instead of on ???
            observeModel : function (callback, prop) {
                if(_(this.model).exists() && _(this.model.off).isFunction()) {
                    var key = this.options[prop||'content'];

                    if(_(key).isString()) {
                        if (key.indexOf('.') > 0) {
                            key = key.substr(0, key.indexOf('.'));
                        }
                        key = 'change:' + key;
                        this.model.off(key, callback);
                        this.model.on(key, callback);
                    } else if (_(key).isArray() && _(key).every(function (s) {
                        return (_.isString(s) && s.match(/^[a-z_.-]+$/));
                    })) {
                        if (_.isFunction(callback)) {
                            key = 'change:' + key.join(' change:');
                            this.model.off(key, callback);
                            this.model.on(key, callback);
                        } else if (_.isArray(callback)) {
                            key = _.object(_.map(key, function (k) { return 'change:' + k; }), callback);
                            this.model.off(key);
                            this.model.on(key);
                        }
                    } else if (_(key).exists()) {
                        this.model.off('change', callback);
                        this.model.on('change', callback);
                    }
                }
            },

            unobserveModel : function (callback, prop) {
                if(_(this.model).exists() && _(this.model.off).isFunction()) {
                    var key = this.options[prop||'content'];

                    if(_(key).isString()) {
                        if (key.indexOf('.') > 0) {
                            key = key.substr(0, key.indexOf('.'));
                        }
                        key = 'change:' + key;
                        this.model.off(key, callback);
                    } else if (_(key).isArray() && _(key).every(function (s) {
                        return (_.isString(s) && s.match(/^[a-z_.-]+$/));
                    })) {
                        if (_.isFunction(callback)) {
                            key = 'change:' + key.join(' change:');
                            this.model.off(key, callback);
                        } else if (_.isArray(callback)) {
                            key = _.object(_.map(key, function (k) { return 'change:' + k; }), callback);
                            this.model.off(key);
                        }
                    } else if (_(key).exists()) {
                        this.model.off('change', callback);
                    }
                }
            }
        });
    }
);
