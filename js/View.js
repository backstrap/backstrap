/**
 * The generic model-bound Bootstrap view object
 * from which all other views are extended.
 *
 * @author Kevin Perry perry@princeton.edu
 * @license MIT
 */
(function(context, moduleName, requirements)
{
    var fn = function($$, Backbone)
    {
        return ($$[moduleName] = Backbone.View.extend({
            initialize: function (options) {
                this.options = this.options ? _({}).extend(this.options, options) : options;
            },

            // resolves the appropriate content from the given choices
            resolveContent: function (model, content, defaultOption) {
                defaultOption = (defaultOption === null || _(defaultOption).isUndefined())
                    ? this.options.content : defaultOption;
                model = _(model).exists() ? model : this.model;
                content = _(content).exists() ? content : defaultOption;
                var hasModelProperty = _(model).exists() && _(content).exists();
                return _(content).isFunction()
                    ? content(model)
                    : hasModelProperty && _(model[content]).isFunction()
                        ? model[content]()
                        : hasModelProperty && _(_(model).resolveProperty(content)).isFunction()
                            ? _(model).resolveProperty(content)(model)
                            : hasModelProperty
                                ? _(model).resolveProperty(content)
                                : content;
            },

            mixin: function (objects) {
                var options = _(this.options).clone();

                _(objects).each(function (object) {
                    $.extend(true, this, object);
                }, this);

                $.extend(true, this.options, options);
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
        if (typeof context.Backbone.View !== 'function') {
            throw new Error('Backbone not loaded');
        }
        fn(context.$$, context.Backbone);
    }
}(this, 'View', [ 'backstrap', 'backbone' ]));
