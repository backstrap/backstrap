/**
 * A Backbone View that displays a tag with a model-bound attribute.
 *
 * This also defines several subclasses of the generic AttributeTag class,
 * which implement particular common tags with dynamic attributes.
 *
 * @author Kevin Perry perry@princeton.edu
 * @license MIT
 */
define(
    'backstrap/views/AttributeTag',
    ['../core', 'underscore', './Tag'],
    function ($$, _) {
        $$.AttributeTag = $$.views.AttributeTag = $$.Tag.extend({
            initialize: function () {
                $$.Tag.prototype.initialize.apply(this, arguments);
                _.extend(this, _.pick(this.options, 'attribute'));
            },

            render: function () {
                var attrProp = this.attribute + 'Content';

                $$.Tag.prototype.render.call(this);

                this.$el.attr(
                    this.attribute,
                    this.resolveContent(this.model, this.options[attrProp])
                );
                this.observeModel(_.bind(this.render, this), attrProp);

                return this;
            }
        });

        _.each({
            A: 'href',
            Img: 'src',
            Input: 'value'
        }, function (attr, tag) {
            $$[tag] = $$.views[tag] = $$.AttributeTag.extend({
                tagName: tag.toLowerCase(),
                attribute: attr
            });
        });

        return $$.AttributeTag;
    }
);
