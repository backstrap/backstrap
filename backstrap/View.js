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
        var dummyContext = {options: {}};

        return ($$.View = Backbone.View.extend({
            initialize: function (options) {
                this.options = this.options ? _({}).extend(this.options, options) : options;
                this.allSubViews = _([]);
            },

            // resolves the appropriate content from the given choices
            resolveContent: function resolveContent(model, content, defaultOption) {
                defaultOption = (defaultOption === null || _(defaultOption).isUndefined())
                    ? this.options.content : defaultOption;
                model = _(model).exists() ? model : this.model;
                content = _(content).exists() ? content : defaultOption;
                var hasModelProperty = _(model).exists() && _(content).exists();
                return _(content).isArray() && this !== dummyContext
                    // Allow only shallow application to arrays.
                    ? _(content).map(_.bind(resolveContent, dummyContext, model))
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
                return this;
            },

            appendViews: function (views, el) {
                _(views).each(function (view) {
                    this.appendView(view, el);
                }, this);
                return this;
            },

            removeView: function (view) {
                var index = this.allSubViews.indexOf(view);
                if (index >= 0) {
                    view.remove();
                    this.allSubViews.splice(index, 1);
                }
                return this;
            },

            emptyViews: function () {
                this.allSubViews.each(function (view) {
                    view.remove();
                });
                this.allSubViews.length = 0;
                return this;
            },

            render: function () {
                this.allSubViews.invoke('render');
                return this;
            },

            append: function append() {
                for (var i=0; i<arguments.length; i++) {
                    var child = arguments[i];

                    if (child === null || typeof child === 'undefined') {
                        // If the argument is empty, do nothing.
                    } else if (child.nodeType) {
                        // If the argument is a DOM element node or text node,
                        // we simply append it.  Don't append other DOM constructs.
                        if (child.nodeType === 1 || child.nodeType === 3) {
                            this.el.appendChild(child);
                        }
                    } else if (child.jquery) {
                        // If the argument is a jQuery object, append its elements.
                        child.appendTo(this.el);
                    } else if (child instanceof Backbone.View) {
                        // If the argument is a Backbone View, append its root element.
                        this.el.appendChild(child.el);
                        this.allSubViews.push(child);
                    } else if (
                        (!!(child === '' || (child && child.charCodeAt && child.substr))) ||
                        (!!(child === 0  || (child && child.toExponential && child.toFixed)))
                    ) {
                        // If the argument is a string or number, append it as a new text node.
                        this.el.appendChild(document.createTextNode(child));
                    } else if (Object.prototype.toString.call(child) === '[object Array]') {
                        // If the argument is an array, we append each element.
                        this.append.apply(this, child);
                    }
                }

                return this;
            }
        }));
    }
);
