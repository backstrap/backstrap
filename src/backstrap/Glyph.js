/**
 * A model-bound Bootstrap Glyphicon object.
 * 
 * @author Kevin Perry perry@princeton.edu
 * @copyright 2014 The Trustees of Princeton University.
 * @license MIT
 * 
 */
(function ()
{
	$$.Glyph = Backbone.View.extend({
		options : {
			tagName : 'span',
		},

		initialize : function(options) {
			this.options = _.extend({}, this.options, options);
			this.mixin([Backbone.UI.HasModel]);

			_(this).bindAll('render');

			$(this.el).addClass('glyphicon');
		},

		render : function() {
			var glyph = this.resolveContent();

			this._observeModel(this.render);

			$(this.el).empty();
			$(this.el).addClass('glyphicon-' + glyph);
			
			return this;
		}
	});
	
	return $$.Glyph;
})();
