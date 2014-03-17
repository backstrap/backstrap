/**
 * A Backbone View that displays a Bootstrap grid.
 * 
 * @author Kevin Perry perry@princeton.edu
 * @copyright 2014 The Trustees of Princeton University.
 * @license MIT
 * 
 */
(function(context) {
	var fn = function($$)
	{
		var parseCellSpec = function(spec) {
			var str = 'col';
			for (var prop in spec) {
				if (prop in sizeMap) {
					str += ' col-' + sizeMap[prop] + '-' + spec[prop];
				}
			}
			return str;
		};
		
		// Defaults to 1x1 non-fluid layout.
		return ($$.Grid = $$.BaseView.extend({
			fluid: false,
			layout: [[ 12 ]],

			initialize: function (options) {
				$$.BaseView.prototype.initialize.call(this, options);
				this.$el.addClass(this.options.fluid ? 'container-fluid' : 'container');
				this.appendRows(this.options.layout);
			},
			
			appendRows: function (layout) {
				for (var r=0; r<layout.length; r++) {
					this.appendRow(layout[r]);
				}
				return this;
			},
			
			appendRow: function (layout) {
				var row = $$.div({className: 'row'});
				this.$el.append(row);
				for (var c=0; c<layout.length; c++) {
					var cell = layout[c];
					var cellClass;
					var content = '';
					if (cell !== null && typeof cell === 'object') {
						cellClass = parseCellSpec(cell);
						content = ('content' in cell) ? cell.content : '';
					} else {
						cellClass = 'col col-md-' + cell;
					}
					$$.div({className: cellClass}, content).appendTo(row);
				}
				return this;
			},
			
			getRow: function () {
				return $('> *:nth-child('+row+') ', this.el);
			},
			
			getCell: function (row, col) {
				return $('> *:nth-child('+row+') > *:nth-child(' + col + ') ', this.el);
			}
		}));
	};
	
	if (typeof context.define === "function" && context.define.amd &&
			typeof context._$$_backstrap_built_flag === 'undefined') {
		define("backstrap/Grid", ["backstrap"], function ($$) {
			return fn($$);
		});
	} else if (typeof context.module === "object" && typeof context.module.exports === "object") {
		module.exports = fn(require("backstrap"));
	} else {
		if (typeof context.$$ !== 'function') throw new Error('Backstrap environment not loaded');
		fn(context.$$);
	}
}(this));
