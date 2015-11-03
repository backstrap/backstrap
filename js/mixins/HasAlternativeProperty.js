/**
 * A mixin for dealing with collection alternatives.
 * Based on Backbone-UI.
 * 
 * @author Kevin Perry perry@princeton.edu
 * @license MIT
 */
(function(context, moduleName, requirements)
{
    var fn = function($$)
    {
        return($$.mixins[moduleName] = $$[moduleName] = {
            options : {
                // The collection of items representing alternative choices
                alternatives : null,

                // The property of the individual choice represent the the label to be displayed
                altLabelContent : null,

                // The property of the individual choice that represents the value to be stored
                // in the bound model's property. Omit this option if you'd like the choice 
                // object itself to represent the value.
                altValueContent : null,
                
                // The property of the individual choice representing CSS 
                // background rule for the left glyph 
                altGlyphLeftClassName : null,

                // The property of the individual choice representing CSS 
                // background rule for the right glyph 
                altGlyphRightClassName : null
            },

            _determineSelectedItem : function() {
                var item = null;

                // if a bound property has been given, we attempt to resolve it
                if(_(this.model).exists() && _(this.options.content).exists()) {
                    item = this.resolveContent(this.model, this.options.content);
                    var comp = JSON.stringify(item);

                    // if a value property is given, we further resolve our selected item
                    if(_(this.options.altValueContent).exists()) {
                        var otherItem = _(this._collectionArray()).detect(function(collectionItem) {
                            return (JSON.stringify(this.resolveContent(collectionItem, this.options.altValueContent)) === comp);
                        }, this);
                        if(!_(otherItem).isUndefined()) item = otherItem;
                    }
                }

                return item || this.options.selectedItem;
            },

            _setSelectedItem : function(item, silent) {
                this.selectedValue = item;
                this.selectedItem = item;

                if(_(this.model).exists() && _(this.options.content).exists()) {
                    this.selectedValue = this._valueForItem(item);
                    _(this.model).setProperty(this.options.content, this.selectedValue, silent);
                }
            },

            _valueForItem : function(item) {
                return _(this.options.altValueContent).exists() ? 
                    _(item).resolveProperty(this.options.altValueContent) :
                    item;
            },

            _collectionArray : function() {
                return _(this.options.alternatives).exists() ?
                    this.options.alternatives.models || this.options.alternatives : [];
            },

            _observeCollection : function(callback) {
                if(_(this.options.alternatives).exists() && _(this.options.alternatives.bind).exists()) {
                    var key = 'change';
                    this.options.alternatives.unbind(key, callback);
                    this.options.alternatives.bind(key, callback);
                }
            }
        });
    };

    if (typeof context.define === 'function'
        && context.define.amd
        && !context._$$_backstrap_built_flag
    ) {
        context.define('backstrap/mixins/' + moduleName, requirements, fn);
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
}(this, 'HasAlternativeProperty', [ 'backstrap' ]));
