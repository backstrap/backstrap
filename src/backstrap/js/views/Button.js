/**
 * A Backbone View that displays a model-bound button.
 * Largely from Backbone-UI's Button class,
 * with Bootstrap decoration.
 * 
 * @author Kevin Perry perry@princeton.edu
 * @license MIT
 */
(function(context, moduleName, requirements)
{
    var fn = function($$)
    {
        return ($$[moduleName] = $$.views[moduleName] = $$.View.extend({
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
    };

    if (typeof context.define === 'function'
        && context.define.amd
        && !context._$$_backstrap_built_flag
    ) {
        context.define('backstrap/views/' + moduleName, requirements, fn);
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
}(this, 'Button', [
    'backstrap',
    'backstrap/View',
    'backstrap/mixins/HasModel',
    'backstrap/mixins/HasGlyph'
]));
