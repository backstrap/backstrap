/**
 * A model-bound Bootstrap contextually-colored object.
 * 
 * @author Kevin Perry perry@princeton.edu
 * @copyright 2014 The Trustees of Princeton University.
 * @license MIT
 * 
 */
(function ()
{
	$$.Context = Backbone.View.extend({
		options : {
			tagName : 'span',
			background: false
		},
		context: null,

		initialize : function(options) {
			this.options = _.extend({}, this.options, options);
			this.mixin([Backbone.UI.HasModel]);
			this.prefix = this.options.background ? 'bg-' : 'text-';
			_(this).bindAll('render');
		},

		render : function() {
			var context = this.resolveContent();
			this._observeModel(this.render);
			$(this.el).removeClass(this.prefix + this.context).addClass(this.prefix + context);
			this.context = context;
			return this;
		}
	});
	
	return $$.Context;
})();
