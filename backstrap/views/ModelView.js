/**
 * A generic Backbone View for displaying data from a single Model object.
 *
 * Sets up needed bindings to re-render the view
 * when the Model data changes. Set renderOnChange=true
 * to render when any property changes; or to the name of a particular
 * property or an array of property names, to only re-render when the
 * named properties change; or false to do nothing.
 *
 * @author Kevin Perry, perry@princeton.edu
 */
define(
    'backstrap/views/ModelView',
    ['../core', 'underscore', '../View'],
    function ($$, _) {
        return ($$.ModelView = $$.views.ModelView = $$.View.extend({
            options: {
                // The Model instance the view is bound to.
                model: null,

                // Whether to render the model view on change in model.
                // Can also take the name of a property, or an array of property names.
                renderOnChange: true
            },

            initialize: function (options) {
                $$.View.prototype.initialize.call(this, options);

                if (this.model) {
                    var renderOnChange = this.options.renderOnChange;
                    if (renderOnChange) {
                        if (_(renderOnChange).isArray()) {
                            renderOnChange.forEach(function (property) {
                                this.model.on('change:' + property, this.render, this);
                            }, this);
                        } else if (renderOnChange === true) {
                            this.model.on('change', this.render, this);
                        } else { // Assume string
                            this.model.on('change:' + renderOnChange, this.render, this);
                        }
                    }
                }
            }
        }));
    }
);
