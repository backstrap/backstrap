/**
 * A mixin for dealing with glyphs in widgets.
 * 
 * @author Kevin Perry perry@princeton.edu
 */
define("backstrap/mixins/HasFormLabel", ["../core"], function ($$)
{
    return($$.mixins.HasFormLabel = $$.HasFormLabel = {
        options: {
            // If provided this content will wrap the component with additional label.
            formLabelContent : null
        },

        getFormLabel : function() {
            var wrapped = $$.plain.label({'for': this.options.name});
            
            var formLabelText = this.options.formLabelContent ? 
                this.resolveContent(
                    this.model,
                    this.options.formLabelContent, 
                    this.options.formLabelContent
                ) || this.options.formLabelContent : null;
            
            if (formLabelText) {
                wrapped.appendChild($$.span({className : 'form_label'}, formLabelText));
            }
            
            return wrapped;    
        },

        wrapWithFormLabel : function(content) {
            var wrapped = this.getFormLabel();
            
            wrapped.appendChild(content);
            
            return wrapped;    
        }
    });
});
