/**
 * The generic model-bound Bootstrap view object
 * from which all other views are extended.
 *
 * @author Kevin Perry perry@princeton.edu
 * @license MIT
 */
define("backstrap/View", ["./core", "jquery", "underscore", "backbone"], function ($$, $, _, Backbone)
{
    return ($$.View = Backbone.View.extend({
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
        },
        
        appendView: function (view, el) {
            view.$el.appendTo(el ? el : this.el);
            if (this.allSubViews) {
                this.allSubViews.push(view);
            } else {
                this.allSubViews = _([view]);
            }
        },
        
        render: function () {
            if (this.allSubViews) {
                this.allSubViews.each(function (view) { view.render(); });
            }
            return this;
        }
    }));
});
