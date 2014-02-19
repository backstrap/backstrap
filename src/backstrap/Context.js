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

		initialize : function(options) {
			this.options = _.extend({}, this.options, options);
			this.mixin([Backbone.UI.HasModel]);
			_(this).bindAll('render');
		},

		render : function() {
			var context = this.resolveContent();
			this._observeModel(this.render);
			if (this.options.background) {
				$(this.el).addClass('bg-' + context);
			} else {
				$(this.el).addClass('text-' + context);
			}
			return this;
		}
	});
	
	return $$.Context;
})();
