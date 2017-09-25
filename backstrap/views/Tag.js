/**
 * A Backbone View that displays model-bound content with Bootstrap decoration.
 *
 * This also defines several subclasses of the generic Tag class,
 * which implement particular common tags.
 *
 * @author Kevin Perry perry@princeton.edu
 * @license MIT
 */
define(
    'backstrap/views/Tag',
    ['../core', 'underscore', '../View'],
    function ($$, _) {
        $$.Tag = $$.views.Tag = $$.View.extend({
            options: _.extend({}, $$.View.prototype.options, {
                context: 'default'
            }),

            initialize: function () {
                $$.View.prototype.initialize.apply(this, arguments);
                this.mixin([$$.mixins.HasModel]);
            },

            render: function () {
                $$.View.prototype.render.call(this);

                if (_(this.options.content).exists()) {
                    var content = this.resolveContent();

                    if (_.isString(content)) {
                        content = document.createTextNode(content);
                    }

                    this.$el.empty().append(content);
                    this.observeModel(_.bind(this.render, this), 'content');
                }

                return this;
            }
        });

        _.each([
            'Div', 'Form', 'H1', 'H2', 'H3', 'H4', 'Li',
            'Ol', 'P', 'Textarea', 'Ul'
        ], function (tag) {
            $$[tag] = $$.views[tag] = $$.Tag.extend({
                tagName: tag.toLowerCase()
            });
        });

        return $$.Tag;
    }
);
