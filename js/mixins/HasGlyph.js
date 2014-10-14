/**
 * A mixin for dealing with glyphs in widgets 
 *
 * @author Kevin Perry perry@princeton.edu
 * @license MIT
 */
(function(context, moduleName, requirements)
{
    var fn = function($$)
    {
        return ($$.mixins[moduleName] = $$[moduleName] = {
            insertGlyphLayout : function(glyphLeftClassName, glyphRightClassName, content, parent) {

                // append left glyph
                if(glyphLeftClassName) {
                    var glyphLeft = $$.span({
                        className : 'glyph left ' + glyphLeftClassName
                    });
                    parent.appendChild(glyphLeft);
                    $(parent).addClass('hasGlyphLeft');
                }

                // append content
                if(content) {
                    parent.appendChild(content);
                }

                // append right glyph
                if(glyphRightClassName) {
                    var glyphRight = $$.span({
                        className : 'glyph right ' + glyphRightClassName
                    });
                    parent.appendChild(glyphRight);
                    $(parent).addClass('hasGlyphRight');
                }
             
            },

            resolveGlyph : function(model, content) {
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
        if (typeof context.$$ !== 'function') {
            throw new Error('Backstrap not loaded');
        }
        fn(context.$$);
    }
}(this, 'HasGlyph', [ 'backstrap' ]));
