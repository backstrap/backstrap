/**
 * The generic model-bound Bootstrap view object
 * from which all other views are extended.
 *
 * @author Kevin Perry perry@princeton.edu
 * @license MIT
 */
define(
    ['./core', 'jquery', 'underscore', 'backbone'],
    function ($$, $, _, Backbone)
    {
        var dummyContext = {options: null};

        return ($$.View = Backbone.View.extend({
            initialize: function (options) {
                this.options = this.options ? _({}).extend(this.options, options) : options;
                this.allSubViews = _([]);
            },

            // resolves the appropriate content from the given choices
            resolveContent: function (model, content, defaultOption) {
                defaultOption = (defaultOption === null || _(defaultOption).isUndefined())
                    ? this.options.content : defaultOption;
                model = _(model).exists() ? model : this.model;
                content = _(content).exists() ? content : defaultOption;
                var hasModelProperty = _(model).exists() && _(content).exists();
                return _(content).isArray() && this !== dummyContext
                    // Allow only shallow application to arrays.
                    ? _(content).map(_.bind(this.resolveContent, dummyContext, model))
                    : _(content).isFunction()
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
                view.$el.appendTo(el||this.el);
                this.allSubViews.push(view);
            },

            appendViews: function (views, el) {
                _(views).each(function (view) {
                    this.appendView(view, el);
                }, this);
            },

            removeView: function (view) {
                var index = this.allSubViews.indexOf(view);
                if (index >= 0) {
                    view.remove();
                    this.allSubViews.splice(index, 1);
                }
            },

            emptyViews: function () {
                this.allSubViews.each(function (view) {
                    view.remove();
                });
                this.allSubViews.length = 0;
            },

            render: function () {
                this.allSubViews.invoke('render');
                return this;
            }
        }));
    }
);
