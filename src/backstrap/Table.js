/**
 * A model-bound Bootstrap table object.
 * 
 * @author Kevin Perry perry@princeton.edu
 * @copyright 2014 The Trustees of Princeton University.
 * @license MIT
 * 
 */
(function()
{
	$$.Table = Backbone.UI.TableView.extend({
		options: {
			tagName: 'table',
			striped: false,
			bordered: false,
			hover: false,
			condensed: false,
			responsive: false // NB: needs a wrapping div!
		},
		
		render: function() {
			Backbone.UI.TableView.prototype.render.apply(this, arguments);
			this.$('table').addClass('table');
			return this;
		}
	});
	
	return $$.Table;
})();
