/**
 * A Bootstrap View that displays a model-bound calendar.
 * Largely from Backbone-UI's Calendar class,
 * with Bootstrap decoration.
 * 
 * @license MIT
 */
(function(context) {
	var fn = function($$)
	{
		var monthNames = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
		var dayNames   = ['s', 'm', 't', 'w', 't', 'f', 's'];

		var isLeapYear = function(year) {
			return ((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0);
		};

		var daysInMonth = function(date) {
			return [31, (isLeapYear(date.getYear()) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][date.getMonth()];
		};

		var formatDateHeading = function(date) {
			return monthNames[date.getMonth()] + ' ' + date.getFullYear();
		};

	var isSameMonth = function(date1, date2) {
		return date1.getFullYear() === date2.getFullYear() && 
			date1.getMonth() === date2.getMonth();
	};

	var isBeforeMinDate = function(minDate, date, day) {
		var compareDate = new Date(date);
		compareDate.setFullYear(date.getFullYear());
		compareDate.setMonth(date.getMonth());
		compareDate.setDate(day);
		return compareDate.getTime() < minDate.getTime();
	};
	
	var isAfterMaxDate = function(maxDate, date, day) {
		var compareDate = new Date(date);
		compareDate.setFullYear(date.getFullYear());
		compareDate.setMonth(date.getMonth());
		compareDate.setDate(day);
		return compareDate.getTime() > maxDate.getTime();
	};

	return ($$.Calendar = $$.BaseView.extend({
		options : {
			// the selected calendar date
			date : null, 

			// the week's start day (0 = Sunday, 1 = Monday, etc.)
			weekStart : 0,

			// a callback to invoke when a new date selection is made.
			// The selected date will be passed in as the first argument.
			onSelect : null,
			
			// all calendar days that are before the minimum date 
			// will be out of range and disabled
			minDate : null,
			
			// all calendar days that are after the maximum date 
			// will be out of range and disabled
			maxDate : null,
			
			// default to condensed but allow user to specify condensed: false
			condensed: true
		},

		date : null, 

		initialize : function(options) {
			$$.BaseView.prototype.initialize.call(this, options);
			this.$el.addClass('calendar calendar-default');
			_(this).bindAll('render');
		},

		render : function() {
			// binding content
			if(_(this.model).exists() && _(this.options.content).exists()) {
				this.date = this.resolveContent();
				if(!_(this.date).isDate()) {
					this.date = new Date();
				}
				var key = 'change:' + this.options.content;
				this.model.unbind(key, this.render);
				this.model.bind(key, this.render);
			}
			else {
				this.date = this.date || this.options.date || new Date();
			}
			// binding minDate
			if(_(this.model).exists() && _(this.options.minDate).exists()) {
				this.minDate = this.resolveContent(this.model, this.options.minDate);
				if(!_(this.minDate).isDate()) {
					this.minDate = new Date();
				}
				var minKey = 'change:' + this.options.minDate;
				this.model.unbind(minKey, this.render);
				this.model.bind(minKey, this.render);
			}
			else {
				this.minDate = null;
			}
			// binding maxDate
			if(_(this.model).exists() && _(this.options.maxDate).exists()) {
				this.maxDate = this.resolveContent(this.model, this.options.maxDate);
				if(!_(this.maxDate).isDate()) {
					this.maxDate = new Date();
				}
				var maxKey = 'change:' + this.options.maxDate;
				this.model.unbind(maxKey, this.render);
				this.model.bind(maxKey, this.render);
			}
			else {
				this.maxDate = null;
			}
			
			this._renderDate(this.date, this.minDate, this.maxDate);

			return this;
		},

		_selectDate : function(date) {
			this.date = date;
			if(_(this.model).exists() && _(this.options.content).exists()) {

				// we only want to set the bound property's date portion
				var boundDate = this.resolveContent();
				var updatedDate = _(boundDate).isDate() ? new Date(boundDate.getTime()) : new Date();
				updatedDate.setMonth(date.getMonth());
				updatedDate.setDate(date.getDate());
				updatedDate.setFullYear(date.getFullYear());

				_(this.model).setProperty(this.options.content, updatedDate);
			}
			this.render();
			if(_(this.options.onSelect).isFunction()) {
				this.options.onSelect(date);
			}
			return false;
		},

		_renderDate : function(date, minDate, maxDate, e) {
			if (e) e.stopPropagation();
			this.$el.empty();

			var startOfMinDay = minDate ? moment(minDate).startOf('day').toDate() : null;
			var endOfMaxDay = maxDate ? moment(maxDate).endOf('day').toDate() : null;
			var startOfDate = moment(date).startOf('day').toDate();
			var endOfDate = moment(date).endOf('day').toDate();

			var nextMonth = new Date(date.getFullYear(), date.getMonth() + 1);
			var lastMonth = new Date(date.getFullYear(), date.getMonth() - 1);
			var monthStartDay = (new Date(date.getFullYear(), date.getMonth(), 1).getDay());
			var inactiveBeforeDays = monthStartDay - this.options.weekStart - 1;
			var daysInThisMonth = daysInMonth(date);
			var today = new Date();
			var inCurrentMonth = isSameMonth(today, date);
			var inSelectedMonth = !!this.date && isSameMonth(this.date, date);

			var daysRow = $$.tr({className : 'row days'}); 
			var names = dayNames.slice(this.options.weekStart).concat(
				dayNames.slice(0, this.options.weekStart));
			for(var i=0; i<names.length; i++) {
				$$.td(names[i]).appendTo(daysRow);
			}

			var tbody, table = $$.table({
					bordered: true,
					condensed: this.options.condensed
				},
				$$.thead(
					$$.th({colspan: 2},
						$$.a({className : 'go_back', onclick : _(this._renderDate).bind(this, lastMonth, minDate, maxDate)}, '\u2039')),
					$$.th({className : 'title', colspan : 5},
						$$.div(formatDateHeading(date))),
					$$.th(
						$$.a({className : 'go_forward', onclick : _(this._renderDate).bind(this, nextMonth, minDate, maxDate)}, '\u203a'))),
				tbody = $$.tbody(daysRow));

			var day = inactiveBeforeDays >= 0 ? daysInMonth(lastMonth) - inactiveBeforeDays : 1;
			var daysRendered = 0;
			for(var rowIndex=0; rowIndex<6 ; rowIndex++) {

				var row = $$.tr({
					className : 'row' + (rowIndex === 0 ? ' first' : rowIndex === 4 ? ' last' : '')
				});

				for(var colIndex=0; colIndex<7; colIndex++) {
					var inactive = daysRendered <= inactiveBeforeDays || 
						daysRendered > inactiveBeforeDays + daysInThisMonth;
						
					var outOfRange = _(minDate).isDate() && isBeforeMinDate(startOfMinDay, startOfDate, day) ||
						_(maxDate).isDate() && isAfterMaxDate(endOfMaxDay, endOfDate, day);

					var callback = _(this._selectDate).bind(
						this, new Date(date.getFullYear(), date.getMonth(), day));

					var className = 'cell' + (inactive ? ' inactive' : '') + 
						(outOfRange ? ' out_of_range' : '') +
						(colIndex === 0 ? ' first' : colIndex === 6 ? ' last' : '') +
						(inCurrentMonth && !inactive && day === today.getDate() ? ' today' : '') +
						(inSelectedMonth && !inactive && day === this.date.getDate() ? ' selected' : '');

					$$.td({ className : className }, 
						inactive || outOfRange ? 
							$$.div({ className : 'day' }, day) : 
							$$.a({ className : 'day', onClick : callback }, day)).appendTo(row);

					day = (rowIndex === 0 && colIndex === inactiveBeforeDays) || 
						(rowIndex > 0 && day === daysInThisMonth) ? 1 : day + 1;

					daysRendered++;
				}

				row.appendTo(tbody);
			}

			this.el.appendChild(table);

			return false;
		}
	}));
	};
	
	if (typeof context.define === "function" && context.define.amd &&
			typeof context._$$_backstrap_built_flag === 'undefined') {
		context.define("backstrap/Calendar", ["backstrap"], fn);
	} else if (typeof context.module === "object" && typeof context.module.exports === "object") {
		context.module.exports = fn(require("backstrap"));
	} else {
		if (typeof context.$$ !== 'function') throw new Error('Backstrap environment not loaded');
		fn(context.$$);
	}
}(this));
