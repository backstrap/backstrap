/**
 * A model-bound Bootstrap progress bar.
 *
 * Use model and content options to set the percent-complete of the progress bar.
 * 
 * @author Kevin Perry perry@princeton.edu
 * @copyright 2014 The Trustees of Princeton University.
 * @license MIT
 */
(function(context) {
	var fn = function($$)
	{
		var ItemView = $$.View.extend({
			initialize: function () {
				$$.View.prototype.initialize.call(this, options);
				this.mixin([$$.HasModel]);
				_(this).bindAll('render');
				this.span = $$.span({className: this.model.labelled ? '' : 'sr-only'});
				$(this.el).addClass('progress-bar').
					attr('role', 'progressbar').
					append(this.span);
				if (this.model.context) {
					$(this.el).addClass(this.model.context);
				}
			},
			
			render: function () {
				var value = this.resolveContent();
				var min = this.resolveContent(this.model, 'min', 0);
				var max = this.resolveContent(this.model, 'max', 100);
				$(this.el).attr({
					role: 'progressbar',
					'aria-min': min,
					'aria-max': max,
					'aria-valuenow': value
				}).style('width', (value - min)/(max - min) + '%');
				// TODO Allow for "minutes left" style label (computed if flag set?)
				this.span.text(value + this.model.labelSuffix);
			}
		});
		
		return ($$.ProgressBar = $$.CollectionView.extend({
			options : {
				tagName : 'span',
				itemView: ItemView
			},
	
			initialize : function(options) {
				$$.View.prototype.initialize.call(this, options);
				this.mixin([$$.HasModel]);
				_(this).bindAll('render');
				$(this.el).addClass('progress');
				if (typeof this.model !== 'Collection') {
					this.model = new $$.Collection(this.model);	
				}
			},
	
			render : function() {
				var content = this.resolveContent();
				this._observeModel(this.render);
				$(this.el).text(content);
				return this;
			}
		}));
	};
	
	if (typeof context.define === "function" && context.define.amd &&
			typeof context._$$_backstrap_built_flag === 'undefined') {
		context.define("backstrap/ProgressBar", ["backstrap", "backstrap/HasModel"], fn);
	} else if (typeof context.module === "object" && typeof context.module.exports === "object") {
		context.module.exports = fn(require("backstrap"));
	} else {
		if (typeof context.$$ !== 'function') throw new Error('Backstrap environment not loaded');
		fn(context.$$);
	}
}(this));
