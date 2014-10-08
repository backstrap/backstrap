/**
 * A Backbone View that displays a model-bound URL link.
 * Largely from Backbone-UI's Link class,
 * with Bootstrap decoration.
 * 
 * @author Kevin Perry perry@princeton.edu
 * @copyright 2014 The Trustees of Princeton University.
 * @license MIT
 */
(function(context, moduleName, requirements)
{
    var fn = function($$)
    {
        return ($$[moduleName] = $$.View.extend({
            options : {
                // disables the link (non-clickable) 
                disabled : false,

                // A callback to invoke when the link is clicked
                onClick : null,
                
                size: 'default',
                context: 'default'
            },

            tagName : 'a',

            initialize : function(options) {
                $$.View.prototype.initialize.call(this, options);
                this.mixin([$$.HasModel, $$.HasGlyph]);
                _(this).bindAll('render');
                this.$el.addClass('link text-' + $$._mapSize(this.options.size));
                if (this.options.size !== this.options.context) {
                    this.$el.addClass(' text-' + this.options.context);
                }
                this.$el.bind('click', _(function(e) {
                    return this.options.disabled ? false :
                        (this.options.onClick ? this.options.onClick(e) : true);
                }).bind(this));
            },

            render : function() {
                var labelText = this.resolveContent();

                this._observeModel(this.render);

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
            setEnabled : function(enabled) {
                if(enabled) {
                    this.el.href = '#';
                } else { 
                    this.el.removeAttribute('href');
                }
                this.options.disabled = !enabled;
                this.$el.toggleClass('disabled', !enabled);
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
}(this, 'Link', [ 'backstrap', 'backstrap/View', 'backstrap/HasModel', 'backstrap/HasGlyph' ]));
