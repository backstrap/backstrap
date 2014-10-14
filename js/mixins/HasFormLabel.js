/**
 * A mixin for dealing with glyphs in widgets.
 * 
 * @author Kevin Perry perry@princeton.edu
 */
(function(context, moduleName, requirements)
{
    var fn = function($$)
    {
        return($$.mixins[moduleName] = $$[moduleName] = {
            options: {
                // If provided this content will wrap the component with additional label.
                formLabelContent : null
            },

            wrapWithFormLabel : function(content) {
                var wrapped = $$.plain.label({'for': this.options.name});
                
                var formLabelText = this.options.formLabelContent ? 
                    this.resolveContent(this.model, this.options.formLabelContent, 
                        this.options.formLabelContent) || this.options.formLabelContent : null;
                if(formLabelText) {
                    wrapped.appendChild($$.span({className : 'form_label'}, formLabelText));
                }
                wrapped.appendChild(content);
                return wrapped;    
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
}(this, 'HasFormLabel', [ 'backstrap' ]));
