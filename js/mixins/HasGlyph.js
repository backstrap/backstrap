/**
 * A mixin for dealing with glyphs in widgets 
 *
 * @author Kevin Perry perry@princeton.edu
 * @license MIT
 */
(function(context, moduleName, requirements)
{
    var fn = function($, $$)
    {
        return ($$.mixins[moduleName] = $$[moduleName] = {
            insertGlyphLayout: function(glyphLeft, glyphRight, content, parent) {
                if(glyphLeftClassName) {
                    var glyphLeft = $$.span({className: 'glyph left ' + glyphLeftClassName});
                    parent.appendChild(glyphLeft);
                    $(parent).addClass('hasGlyphLeft');
                }

                if (content) {
                    parent.appendChild(content);
                }

                if(glyphRightClassName) {
                    var glyphRight = $$.span({className: 'glyph right ' + glyphRightClassName});
                    parent.appendChild(glyphRight);
                    $(parent).addClass('hasGlyphRight');
                }
            },

            wrapWithGlyphs: function (content) {
                var glyphLeft = this.resolveGlyph(this.model, this.options.glyphLeftClassname);
                var glyphRight = this.resolveGlyph(this.model, this.options.glyphRightClassName);
                var $content = $(content);
                if (glyphLeft) {
                    $content.before($$.span({className: 'glyph left ' + glyphLeft}));
                    $content.parent().addClass('hasGlyphLeft');
                }
                if (glyphRight) {
                    $content.after($$.span({className: 'glyph right ' + glyphRight}));
                    $content.parent().addClass('hasGlyphRight');
                }
            },

            resolveGlyph: function(model, content) {
                if(content === null) return null;
                var glyph = null;
                if(_(model).exists() && _((model.attributes || model)[content]).exists()) {
                    glyph = this.resolveContent(model, content);
                }
                return _(glyph).exists() ? glyph : content;
            }
        });
    };

    if (typeof context.define === 'function'
        && context.define.amd
        && !context._$$_backstrap_built_flag
    ) {
        context.define('backstrap/mixins' + moduleName, requirements, fn);
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
        if (typeof context.$ !== 'function') {
            throw new Error('jQuery not loaded');
        }
        if (typeof context.$$ !== 'function') {
            throw new Error('Backstrap not loaded');
        }
        fn(context.$, context.$$);
    }
}(this, 'HasGlyph', ['jquery', 'backstrap']));
