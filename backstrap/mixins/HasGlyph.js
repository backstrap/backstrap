/**
 * A mixin for dealing with glyphs in widgets
 *
 * @author Kevin Perry perry@princeton.edu
 * @license MIT
 */
define(
    'backstrap/mixins/HasGlyph',
    ['../core', 'jquery', 'underscore'],
    function ($$, $, _) {
        return ($$.mixins.HasGlyph = $$.HasGlyph = {
            insertGlyphLayout: function (glyphLeft, glyphRight, content, parent) {
                var parent = $(parent);

                if (glyphLeft) {
                    parent.addClass('hasGlyphLeft').append(
                        $$.span({className: 'glyph left ' + glyphLeft})
                    );
                }

                if (content) {
                    parent.append(content);
                }

                if (glyphRight) {
                    parent.addClass('hasGlyphRight').append(
                        $$.span({className: 'glyph right ' + glyphRight})
                    );
                }
            },

            wrapWithGlyphs: function (content) {
                var glyphLeft = this.resolveGlyph(this.model, this.options.glyphLeftClassname);
                var glyphRight = this.resolveGlyph(this.model, this.options.glyphRightClassName);
                var $content = $(content);

                if (glyphLeft) {
                    $content.first().before(
                        $$.span({className: 'glyph left ' + glyphLeft})
                    ).parent().addClass('hasGlyphLeft');
                }

                if (glyphRight) {
                    $content.last().after(
                        $$.span({className: 'glyph right ' + glyphRight})
                    ).parent().addClass('hasGlyphRight');
                }
            },

            resolveGlyph: function (model, content) {
                var glyph = null;

                if (content === null) {
                    return null;
                }

                if (_(model).exists() && _((model.attributes || model)[content]).exists()) {
                    glyph = this.resolveContent(model, content);
                }

                return (_(glyph).exists() ? glyph : content);
            }
        });
    }
);
