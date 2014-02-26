(function(context){
	var fn = function($$){
	
	  return ($$.UIButton = $$.BaseView.extend({
	    options : {
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
	    
	    tagName : 'button',
	
	    initialize : function(options) {
	      
	    	$$.BaseView.prototype.initialize.call(this, options);
	      
	      this.mixin([$$.HasModel, $$.HasGlyph]);
	
	      _(this).bindAll('render');
	
	      $(this.el).addClass('button');
	
	      $(this.el).bind('click', _(function(e) {
	        return (this.options.disabled || this.options.active) ? false :
	          (this.options.onClick ? this.options.onClick(e) : true);
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

	if (typeof context.define === "function" && context.define.amd &&
			typeof context._$$_backstrap_built_flag === 'undefined') {
		define("backstrap/UIButton", ["backstrap"], function ($$) {
			return fn($$);
		});
	} else if (typeof context.module === "object" && typeof context.module.exports === "object") {
		module.exports = fn(require("backstrap"));
	} else {
		if (typeof context.$$ !== 'function') throw new Error('Backstrap environment not loaded');
		fn(context.$$);
	}
}(this));
