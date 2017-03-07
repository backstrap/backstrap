/**
 * A Backbone View that displays a model-bound label
 * with Bootstrap decoration.
 * 
 * @author Kevin Perry perry@princeton.edu
 * @license MIT
 */
define("backstrap/views/Label", ["../core", "underscore"], function ($$, _)
{
    return ($$.Label = $$.views.Label = $$.View.extend({

        options : {
            emptyContent : '',
            size: 'default',
            context: 'default'
        },
        
        tagName : 'label',

        initialize : function(options) {
            $$.View.prototype.initialize.call(this, options);
            this.mixin([$$.mixins.HasModel]);
            _(this).bindAll('render');
            this.$el.addClass('label label-' + $$._mapSize(this.options.size));
            if (this.options.size !== this.options.context) {
                this.$el.addClass(' label-' + this.options.context);
            }
            if(this.options.name){
                this.$el.addClass(this.options.name);
            }

        },

        render : function() {
            var labelText = this.resolveContent(this.model, this.options.labelContent) || this.options.labelContent;
            // if the label is undefined use the emptyContent option
            if(labelText === undefined){
                labelText = this.options.emptyContent;
            }
            this._observeModel(this.render);

            this.$el.empty();
            
            // insert label
            this.el.appendChild(document.createTextNode(labelText));

            return this;
        }
    }));
});
