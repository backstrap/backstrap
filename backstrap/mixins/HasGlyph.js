/**
 * A mixin for dealing with glyphs in widgets 
 *
 * @author Kevin Perry perry@princeton.edu
 * @license MIT
 */
define("backstrap/mixins/HasGlyph", ["../core", "jquery", "underscore"], function ($$, $, _)
{
    return ($$.mixins.HasGlyph = $$.HasGlyph = {
        insertGlyphLayout: function(glyphLeft, glyphRight, content, parent) {
            if(glyphLeft) {
                $(parent).addClass('hasGlyphLeft').append(
                    $$.span({className: 'glyph left ' + glyphLeft})
                );
            }

            if (content) {
                parent.appendChild(content);
            }

            if(glyphRight) {
                $(parent).addClass('hasGlyphRight').append(
                    $$.span({className: 'glyph right ' + glyphRight})
                );
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
});
