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
 * @copyright 2014 The Trustees of Princeton University.
 */
(function (context, moduleName, requirements)
{
    var fn = function ($$)
    {
        return ($$[moduleName] = $$.View.extend({
            options: {
                // The Model instance the view is bound to.
                model: null,

                // Whether to render the model view on change in model.
                // Can also take the name of a property, or an array of property names.
                renderOnChange: true
            },

            initialize: function(options) {
                $$.View.prototype.initialize.call(this, options);
                if (this.model) {
                    var renderOnChange = this.options.renderOnChange;
                    if (renderOnChange) {
                        if (is_array(renderOnChange)) {
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
}(this, 'ModelView', [ 'backstrap', 'backstrap/View' ]));
