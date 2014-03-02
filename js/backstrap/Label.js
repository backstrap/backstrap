/**
 * A Bootstrap View that displays a model-bound label
 * with Bootstrap decoration.
 * 
 * @author Kevin Perry perry@princeton.edu
 * @copyright 2014 The Trustees of Princeton University.
 * @license MIT
 * 
 */
(function(context) {
	var fn = function($$)
	{
		return ($$.Label = $$.BaseView.extend({
    
			options : {
				emptyContent : ''
			},
			
			tagName : 'label',

			initialize : function(options) {
				$$.BaseView.prototype.initialize.call(this, options);
				this.mixin([$$.HasModel]);

				_(this).bindAll('render');
				
				// TODO needs sizing, context.
				$(this.el).addClass('label label-default');

				if(this.options.name){
					$(this.el).addClass(this.options.name);
				}

			},

			render : function() {
				var labelText = this.resolveContent(this.model, this.options.labelContent) || this.options.labelContent;
				// if the label is undefined use the emptyContent option
				if(labelText === undefined){
					labelText = this.options.emptyContent;
				}
				this._observeModel(this.render);

				$(this.el).empty();
				
				// insert label
				this.el.appendChild(document.createTextNode(labelText));

				return this;
			}
		}));
	};
	
	if (typeof context.define === "function" && context.define.amd &&
			typeof context._$$_backstrap_built_flag === 'undefined') {
		context.define("backstrap/Label", ["backstrap", "backstrap/HasModel"], fn);
	} else if (typeof context.module === "object" && typeof context.module.exports === "object") {
		context.module.exports = fn(require("backstrap"));
	} else {
		if (typeof context.$$ !== 'function') throw new Error('Backstrap environment not loaded');
		fn(context.$$);
	}
}(this));
