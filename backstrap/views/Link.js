/**
 * A Backbone View that displays a model-bound URL link.
 * Largely from Backbone-UI's Link class,
 * with Bootstrap decoration.
 *
 * @author Kevin Perry perry@princeton.edu
 * @license MIT
 */
define(
    'backstrap/views/Link',
    ['../core', 'underscore', '../View', '../mixins/HasGlyph', '../mixins/HasModel'],
    function ($$, _) {
        return ($$.Link = $$.views.Link = $$.View.extend({
            options : {
                // disables the link (non-clickable)
                disabled : false,

                // A callback to invoke when the link is clicked
                onClick : null
            },

            tagName : 'a',

            initialize : function (options) {
                $$.View.prototype.initialize.call(this, options);
                this.mixin([$$.mixins.HasModel, $$.mixins.HasGlyph]);

                this.$el.addClass('link');
                this.$el.bind('click', _(function(e) {
                    return this.options.disabled ? false :
                        (this.options.onClick ? this.options.onClick(e) : true);
                }).bind(this));
            },

            render : function () {
                var labelText = this.resolveContent();

                this._observeModel(_.bind(this.render, this));

                this.$el.empty();

                var content = $$.span(labelText);

                var glyphLeftClassName = this.resolveGlyph(this.model, this.options.glyphLeftClassName);
                var glyphRightClassName = this.resolveGlyph(this.model, this.options.glyphRightClassName);

                this.insertGlyphLayout(glyphLeftClassName, glyphRightClassName, content, this.el);

                // add appropriate class names
                this.setEnabled(!this.options.disabled);

                return this;
            },

            // sets the enabled state of the button
            setEnabled : function (enabled) {
                if(enabled) {
                    this.el.href = '#';
                } else {
                    this.el.removeAttribute('href');
                }
                this.options.disabled = !enabled;
                this.$el.toggleClass('disabled', !enabled);
            }
        }));
    }
);
