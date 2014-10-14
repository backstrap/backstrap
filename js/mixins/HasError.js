/**
 * A mixin for dealing with errors in widgets 
 *
 * @author Kevin Perry perry@princeton.edu
 * @license MIT
 */
(function(context, moduleName, requirements)
{
    var fn = function($$)
    {
        return ($$.mixins[moduleName] = $$[moduleName] = {
            options : {
                // Can be inserted into the flow of the form as the type 'inform' or as
                // a flyover disclosing the error message as the type 'disclosure'
                errorType : 'inform',
                // Where the error message will be displayed.
                // Possible positions: 'right', 'below'
                errorPosition : 'below'
            },
            
            unsetError : function() {
                // remove error class
                $(this.el).removeClass('error');
                // remove error message if it exists
                $(this.errorMessage).remove();
                // remove disclosure if it exists
                $(this._disclosure).remove();     
                // remove event attached to the model regarding errors     
                if(_(this._unobserveModel).exists()) {
                    this._unobserveModel(_(this.unsetError).bind(this));
                }
            },
            
            setError : function(message) {
                
                // add event to model to unset error when on change
                if(_(this._observeModel).exists()) {
                    this._observeModel(_(this.unsetError).bind(this));
                }
                 
                // message will default to empty string
                message = (message === null || _(message).isUndefined()) ? "" : message;
                // clear existing error
                this.unsetError();
                // add error class
                $(this.el).addClass('error');
                
                // add error message if provided
                if(message.length > 0) {
                    
                    if(this.options.errorType !== "disclosure") {
                        this.errorMessage = $$.span({className : 'error_message ' + 
                            this.options.errorPosition}, message);
                    }
                    else {
                        this.errorMessage = $$.span({className : 'error_message right with_disclosure'}, "!");
                        
                        this._disclosure = $$.div({className : 'disclosure'},
                            this._disclosureOuter = $$.div({className: 'disclosure_outer'},
                                this._disclosureInner = $$.div({className: 'disclosure_inner'}, message),
                                    this._disclosureArrow = $$.div({className: 'disclosure_arrow'})));
                        
                        $(this.errorMessage).click(_(function(e) {
                            e.preventDefault();
                            this._showDisclosure();
                            return false;
                        }).bind(this));
                        
                        $(this.el).click(_(function() {
                            $(this._disclosure).remove();
                        }).bind(this));
                        
                    }
                    
                    this.el.childNodes[0].appendChild(this.errorMessage);
                    
                    if(this._disclosure) {
                        this._showDisclosure();
                    }
                    
                }
                
            },
            
            _showDisclosure : function(){
                // add the disclosure
                this.el.appendChild(this._disclosure);
                // set the position
                this.options.errorPosition === 'right' ? 
                    $(this._disclosure).alignTo(this.errorMessage, 'right', 10, 0, this.el) : 
                    $(this._disclosure).alignTo(this.errorMessage, 'center bottom', 0, 10, this.el);

                // add the appropriate class to disclosure arrow for correct sprite and styles
                $(this._disclosureOuter).addClass(this.options.errorPosition === 'right' ? 'arrow_left' : 'arrow_up');
                // set the disclosure arrow position
                var pos = this.options.errorPosition === 'right' ? (($(this._disclosure).height() / 2) - 10) : 
                    (($(this._disclosure).width() / 2) - 10);
                var cssTopOrLeft = this.options.errorPosition === 'right' ? 'top' : 'left';    
                $(this._disclosureArrow).css(cssTopOrLeft, pos + 'px');
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
}(this, 'HasError', [ 'backstrap' ]));
