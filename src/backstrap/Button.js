/**
 * A model-bound Bootstrap button object.
 * 
 * @author Kevin Perry perry@princeton.edu
 * @copyright 2014 The Trustees of Princeton University.
 * @license MIT
 * 
 */
(function(context) {
	var fn = function($$)
	{
		// TODO Extend BB.UI.Button instead of reproducing code? (opts & init() diff)
		return ($$.Button = Backbone.View.extend({
			options : {
				tagName : 'button',
				size    : 'default', // added.
				context : 'default', // added.
	
				// true will disable the button
				// (muted non-clickable) 
				disabled : false,
	
				// true will activate the button
				// (depressed and non-clickable)
				active : false,
	
				// A callback to invoke when the button is clicked
				onClick : null,
	
				// renders this button as an input type=submit element as opposed to an anchor.
				isSubmit : false
			},
	
			initialize : function(options) {
				this.options = _.extend({}, this.options, options);
				this.mixin([$$.backbone_ui.HasModel, $$.backbone_ui.HasGlyph]);
	
				_(this).bindAll('render');
	
				// Added/altered.
				$(this.el).addClass('button btn btn-' + this.options.size);
				if (this.options.size !== this.options.context) {
					$(this.el).addClass(' btn-' + this.options.context);
				}
	
				$(this.el).bind('click', _(function(e) {
					if(!this.options.disabled && !this.options.active && this.options.onClick) {
						return this.options.onClick(e); 
					}
					return false;
				}).bind(this));
			},
	
			render : function() {
				var labelText = this.resolveContent();
	
				this._observeModel(this.render);
	
				$(this.el).empty();
	
				if(this.options.isSubmit) {
					$(this.el).attr({
						type : 'submit', 
						value : ''
					});
				}
	
				var content = $$.span(labelText);
				
				// TODO Should use/allow bootstrap glyphicons here!
				var glyphLeftClassName = this.resolveGlyph(this.model, this.options.glyphLeftClassName);
				var glyphRightClassName = this.resolveGlyph(this.model, this.options.glyphRightClassName);
	
				this.insertGlyphLayout(glyphLeftClassName, glyphRightClassName, content, this.el);
	
				// add appropriate class names
				this.setEnabled(!this.options.disabled);
				this.setActive(this.options.active);
	
				return this;
			},
	
			// sets the enabled state of the button
			setEnabled : function(enabled) {
				this.options.disabled = !enabled;
				$(this.el).toggleClass('disabled', !enabled);
				$(this.el).attr({'disabled' : !enabled});
			},
	
			// sets the active state of the button
			setActive : function(active) {
				this.options.active = active;
				$(this.el).toggleClass('active', active);
			}
		}));
	};
	
	// If we're in an AMD environment, register it as a named AMD module.
	if (typeof define === "function" && define.amd) {
		define("backstrap/Badge", ["backstrap"], function($$) {
			return fn($$);
		});
	}
	
	// If we're in a CommonJS environment, export the object;
	// otherwise put it in the $$ namespace.
	if ( typeof module === "object" && typeof module.exports === "object" ) {
		module.exports = fn(require("backstrap"));
	} else {
		if (typeof context.$$ !== "function") {
			throw new Error("$$ is not set - include backstrap.js before Button.js.");
		}
		fn(context.$$);
	}
	
}(this));
