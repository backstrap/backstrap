/**
 * A Backbone View that displays a model-bound text area.
 * Largely from Backbone-UI's TextArea class,
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
        var noop = function(){};

        return ($$[moduleName] = $$.View.extend({
            options : {
                className : 'text_area',

                // id to use on the actual textArea 
                textAreaId : null,

                // disables the text area
                disabled : false,

                tabIndex : null,

                // a callback to invoke when a key is pressed within the text field
                onKeyPress : noop,

                // if given, the text field will limit it's character count
                maxLength : null 
            },

            // public accessors
            textArea : null,

            initialize : function(options) {
                $$.View.prototype.initialize.call(this, options);
                this.mixin([$$.HasModel, $$.HasFormLabel,
                    $$.HasError, $$.HasFocus]);

                $(this.el).addClass('text_area');
                if(this.options.name){
                    $(this.el).addClass(this.options.name);
                }
            },

            render : function() {
                var value = (this.textArea && this.textArea.value.length) > 0 ? 
                    this.textArea.value : this.resolveContent();

                $(this.el).empty();

                this.textArea = $$.textarea({
                    id : this.options.textAreaId,
                    tabIndex : this.options.tabIndex, 
                    placeholder : this.options.placeholder,
                    maxLength : this.options.maxLength}, value);

                this._observeModel(_(this._refreshValue).bind(this));

                this._parent = $$.div({className : 'textarea_wrapper'}, this.textArea);

                this.el.appendChild(this.wrapWithFormLabel(this._parent));

                // add focusin / focusout
                this.setupFocus(this.textArea, this._parent);

                this.setEnabled(!this.options.disabled);

                $(this.textArea).keyup(_(function(e) {
                    _.defer(_(this._updateModel).bind(this));
                    if(_(this.options.onKeyPress).exists() && _(this.options.onKeyPress).isFunction()) {
                        this.options.onKeyPress(e, this);
                    }
                }).bind(this));

                return this;
            },

            getValue : function() {
                return this.textArea.value;
            },

            setValue : function(value) {
                $(this.textArea).empty();
                this.textArea.value = value;
                this._updateModel();
            },

            // sets the enabled state
            setEnabled : function(enabled) {
                if(enabled) {
                    $(this.el).removeClass('disabled');
                } else {
                    $(this.el).addClass('disabled');
                }
                this.textArea.disabled = !enabled;
            },

            _updateModel : function() {
                _(this.model).setProperty(this.options.content, this.textArea.value);
            },

            _refreshValue : function() {
                var newValue = this.resolveContent();
                if(this.textArea && this.textArea.value !== newValue) {
                    this.textArea.value = _(newValue).exists() ? newValue : null;
                }
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
}(this, 'TextArea', [
    'backstrap',
    'backstrap/View',
    'backstrap/HasError',
    'backstrap/HasFocus',
    'backstrap/HasFormLabel',
    'backstrap/HasModel'
]));
