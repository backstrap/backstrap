/**
 * A Backbone View that displays a model-bound button.
 * Largely from Backbone-UI's Button class,
 * with Bootstrap decoration.
 * 
 * @author Kevin Perry perry@princeton.edu
 * @license MIT
 */
define("backstrap/views/Button", ["../core"], function ($$)
{
    return ($$.Button = $$.views.Button = $$.View.extend({
        options : {
            tagName : 'button',
            size    : 'default', // added.
            context : 'default', // added.
            // true will disable the button
            // (muted non-clickable) 
            disabled : false,

            // true will activate the button
            // (depressed and non-clickable)
            active : false,

            // A callback to invoke when the button is clicked
            onClick : null,

            // renders this button as an input type=submit element as opposed to an anchor.
            isSubmit : false
        },

        initialize : function(options) {
            $$.View.prototype.initialize.call(this, options);
            this.mixin([$$.mixins.HasModel, $$.mixins.HasGlyph]);
            _(this).bindAll('render');

            this.$el.addClass('button btn btn-' + $$._mapSize(this.options.size));
            if (this.options.size !== this.options.context) {
                this.$el.addClass(' btn-' + this.options.context);
            }

            this.$el.bind('click', _(function(e) {
                return (this.options.disabled || this.options.active) ? false :
                    (this.options.onClick ? this.options.onClick(e) : true);
            }).bind(this));
        },

        render : function() {
            var labelText = this.resolveContent();

            this._observeModel(this.render);

            this.$el.empty();

            if(this.options.isSubmit) {
                this.$el.attr({
                    type : 'submit',
                    value : ''
                });
            } else {
                this.$el.attr({type: 'button'});
            }

            var content = $$.span(labelText);

            // TODO Should use/allow bootstrap glyphicons here!
            var glyphLeftClassName = this.resolveGlyph(this.model, this.options.glyphLeftClassName);
            var glyphRightClassName = this.resolveGlyph(this.model, this.options.glyphRightClassName);

            this.insertGlyphLayout(glyphLeftClassName, glyphRightClassName, content, this.el);

            // add appropriate class names
            this.setEnabled(!this.options.disabled);
            this.setActive(this.options.active);

            return this;
        },

        // sets the enabled state of the button
        setEnabled : function(enabled) {
            this.options.disabled = !enabled;
            this.$el.toggleClass('disabled', !enabled);
            this.$el.attr({'disabled' : !enabled});
        },

        // sets the active state of the button
        setActive : function(active) {
            this.options.active = active;
            this.$el.toggleClass('active', active);
        }
    }));
});
