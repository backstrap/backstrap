/**
 * The core Backstrap object.  Provides various tag and object factory methods.
 * 
 * This is based heavily on Joe Stelmach's nifty laconic.js
 * https://github.com/joestelmach/laconic
 * Laconic simplifies the generation of DOM content.
 * As such, it is bound by his license:
 * https://github.com/joestelmach/laconic/blob/master/LICENSE
 *
 * I've made it follow the RequireJS protocol for async loading.
 *
 * I've added support for a natural syntax for making
 * Bootstrap-aware objects, including Bootstrap's
 * sizing, context, glyphicon, and button features.
 * More coming soon.
 *
 * Suggested use: require(['backstrap/backstrap'], function($$) {
 *     $$.div({},
 *         $$.span({context: 'danger'},
 *             'Uh-oh! ',
 *             $$.span({glyph: 'star'})
 *         ),
 *         $$.button({size: 'large'}, 'OK')
 *     );
 * }
 *
 * @author Kevin Perry perry@princeton.edu
 * @copyright 2014 The Trustees of Princeton University.
 * @license MIT
 *
 ************************************************************/
(function (context) {

	// properly-cased attribute names for IE setAttribute support
	var attributeMap = {
			'acceptcharset'     : 'acceptCharset',
			'accesskey'         : 'accessKey',
			'allowtransparency' : 'allowTransparency',
			'bgcolor'           : 'bgColor',
			'cellpadding'       : 'cellPadding',
			'cellspacing'       : 'cellSpacing',
			'class'             : 'className',
			'classname'         : 'className',
			'colspan'           : 'colSpan',
			'csstext'           : 'style',
			'defaultchecked'    : 'defaultChecked',
			'defaultselected'   : 'defaultSelected',
			'defaultvalue'      : 'defaultValue',
			'for'               : 'htmlFor',
			'frameborder'       : 'frameBorder',
			'hspace'            : 'hSpace',
			'htmlfor'           : 'htmlFor',
			'longdesc'          : 'longDesc',
			'maxlength'         : 'maxLength',
			'marginwidth'       : 'marginWidth',
			'marginheight'      : 'marginHeight',
			'noresize'          : 'noResize',
			'noshade'           : 'noShade',
			'readonly'          : 'readOnly',
			'rowspan'           : 'rowSpan',
			'tabindex'          : 'tabIndex',
			'valign'            : 'vAlign',
			'vspace'            : 'vSpace'
	};

	var sizeMap = {
			'large'        : 'lg',
			'lg'           : 'lg',
			'medium'       : 'md',
			'md'           : 'md',
			'small'        : 'sm',
			'sm'           : 'sm',
			'extra-small'  : 'xs',
			'xs'           : 'xs'
	};

	// The backstrap function serves as a generic method for generating
	// DOM content, and also as a placeholder for helper functions.
	//
	// The first parameter MUST be a string specifying the element's
	// tag name.
	// 
	// An optional object of element attributs may follow directly
	// after the tag name.
	// 
	// Additional arguments will be considered children of the new
	// element and may consist of elements, strings, or numbers.
	// 
	// for example:
	// backstrap('div', {'class' : 'foo'}, 'bar');
	var backstrap = function backstrap() {

		// handle Bootstrap special tags, context, and sizing.
		var tag = arguments[0];
		var size = null;
		var context = null;
		var type = 'text';
		var classlist = {};
		switch (arguments[0]) {
			case 'badge':
				tag = 'span';
				classlist['badge'] = true;
				break;
			case 'button':
				type = 'btn';
				classlist['btn'] = true;
				break;
			case 'label':
			case 'input':
				type = arguments[0];
				classlist[type] = true;
				break;
			case 'spanlabel':
				tag = type = 'label';
				classlist['label'] = true;
				break;
			case 'htmllabel':
				tag = 'label';
				break;
		}

		// create a new element of the requested type
		var el = document.createElement(tag);

		// walk through the rest of the arguments
		for(var i=1; i<arguments.length; i++) {
			var arg = arguments[i];
			if (arg === null || typeof arg === 'undefined') continue;

			// if the argument is a dom node, we simply append it
			if (arg.nodeType === 1) {
				el.appendChild(arg);
			}

			// if the argument is a string or a number, we append it as
			// a new text node
			else if (
					(!!(arg === '' || (arg && arg.charCodeAt && arg.substr))) ||
					(!!(arg === 0  || (arg && arg.toExponential && arg.toFixed)))) {

				el.appendChild(document.createTextNode(arg));
			}

			// if the argument is a plain-old object, and we're processing the first
			// argument, then we apply the object's values as element attributes
			else if (i === 1 && typeof(arg) === 'object') {
				for(var key in arg) {
					if (arg.hasOwnProperty(key)) {
						var value = arg[key];
						if (value !== null && typeof value !== 'undefined') {
							key = key.toLowerCase();
							key = attributeMap[key] || key;

							// if the key represents an event (onclick, onchange, etc)
							// we'll set the href to '#' if none is given, and we'll apply
							// the attribute directly to the element for IE7 support.
							if (key.substr(0, 2) === 'on') {
								if (!('href' in arg) && key === 'onclick') {
									el.setAttribute('href', '#');
								}
								el[key] = value;
							} else {
								switch (key) {
									case 'style':
										// if we're setting the style attribute, we may need to
										// use the cssText property
										if (key === 'style' && el.style.setAttribute) {
											el.style.setAttribute('cssText', value);
										} else {
											el.setAttribute('style', value);
										}
										break;
	
									case 'className':
										classlist[value] = true;
										break;
	
										// if we're setting an attribute that's not properly supported,
										// then we apply the attribute directly to the element
									case 'htmlFor':
										el.htmlFor = value;
										break;
	
										// The rest are special handling for Bootstrap keys
									case 'size':
										if (value in sizeMap) {
											size = sizeMap[value];
										} else {
											el.setAttribute('size', value);
										}
										break;
	
									case 'context':
										context = value;
										break;
	
									case 'bgcontext':
										classlist['bg-' + value] = true;
										break;
	
									case 'glyph':
										classlist['glyphicon'] = classlist['glyphicon-' + value] = true;
										break;
	
										// otherwise, we use the standard setAttribute
									default:
										el.setAttribute(key, value);
								}
							}
						}
					}
				}
				// Add classNames.
				if (size != null && size !== 'text') {
					classlist[type + '-' + size) = true;
				}
				if (context != null) {
					classlist[type + '-' + context) = true;
				}
				el.className = Object.keys(classlist).join(' ');
			}

			// if the argument is an array, we append each element
			else if (Object.prototype.toString.call(arg) === '[object Array]') {
				for(var j=0; j<arg.length; j++) {
					var child = arg[j];
					if (child.nodeType === 1) {
						el.appendChild(child);
					}
				}
			}
		}

		// Add an appendTo method to the newly created element, which will allow
		// the DOM insertion to be method chained to the creation.  For example:
		// $$.div('foo').appendTo(document.body);
		el.appendTo = function(parentNode) {
			if (parentNode.nodeType === 1 && this.nodeType === 1) {
				parentNode.appendChild(this);
			}
			return el;
		};

		return el;
	};

	// Grid helper functions.
	var appendGridRows = function (layout) {
		for (var r=0; r<layout.length; r++) {
			this.appendRow(layout[r]);
		}
	};

	var parseCellSpec = function(spec) {
		var str = 'col';
		for (var prop in spec) {
			if (prop in sizeMap) {
				str += ' col-' + sizeMap[prop] + '-' + spec[prop];
			}
		}
		return str;
	};

	var appendGridRow = function (layout) {
		var rowdiv = backstrap.div({className: 'row'});
		this.append(rowdiv);
		for (var c=0; c<layout.length; c++) {
			var size = 'md';
			var cell = layout[c];
			var cellclass;
			var content = ('content' in cell) ? cell.content : '';
			if (cell !== null && typeof cell === 'object') {
				cellClass = parseCellSpec(cell);
			} else {
				cellClass = 'col col-md-' + cell;
			}
			rowdiv.append(backstrap.div({className: cellClass}, content));
		});
	};

	// Some special tags for Bootstrap support.
	var bootstrapTags = ['badge', 'htmllabel', 'spanlabel'];

	// html 4 tags
	var deprecatedTags = ['acronym', 'applet', 'basefont', 'big', 'center', 'dir',
	                      'font', 'frame', 'frameset', 'noframes', 'strike', 'tt', 'u', 'xmp'];

	// html 5 tags
	var tags = ['a', 'abbr', 'address', 'area', 'article', 'aside', 'audio', 'b',
	            'base', 'bdo', 'blockquote', 'body', 'br', 'button', 'canvas', 'caption',
	            'cite', 'code', 'col', 'colgroup', 'command', 'datalist', 'dd', 'del',
	            'details', 'dfn', 'div', 'dl', 'dt', 'em', 'embed', 'fieldset',
	            'figcaption', 'figure', 'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5',
	            'h6', 'head', 'header', 'hgroup', 'hr', 'html', 'i', 'iframe', 'img',
	            'input', 'ins', 'keygen', 'kbd', 'label', 'legend', 'li', 'link', 'map',
	            'mark', 'menu', 'meta', 'meter', 'nav', 'noscript', 'object', 'ol',
	            'optgroup', 'option', 'output', 'p', 'param', 'pre', 'progress', 'q', 'rp',
	            'rt', 'ruby', 's', 'samp', 'script', 'section', 'select', 'small',
	            'source', 'span', 'strong', 'style', 'sub', 'summary', 'sup', 'table',
	            'tbody', 'td', 'textarea', 'tfoot', 'th', 'thead', 'time', 'title', 'tr',
	            'ul', 'var', 'video', 'wbr'].concat(deprecatedTags).concat(bootstrapTags);

	// add our tag methods to the backstrap object
	var makeApply = function(tagName) {
		return function() {
			return backstrap.apply(this,
					[tagName].concat(Array.prototype.slice.call(arguments)));
		};
	};

	for(var i=0; i<tags.length; i++) {
		backstrap[tags[i]] = makeApply(tags[i]);
	}

	// shortcut for creating glyphicons.
	backstrap.glyph = function(name) {
		return backstrap.span({glyph: name});
	};

	// shortcut for creating Bootstrap grids.
	backstrap.grid = function () {
		var cn = 'container';
		var layout = [];
		if (typeof(arguments[0]) === 'object') {
			if ('layout' in arguments[0]) {
				layout = arguments[0].layout;
				delete arguments[0].layout;
			}
			if ('fluid' in arguments[0]) {
				cn = arguments[0].fluid ? 'container-fluid' : cn;
				delete arguments[0].fluid;
			}
		}
		var el = backstrap.apply(this,
				['div'].concat(Array.prototype.slice.call(arguments)));
		$(el).addClass(cn);
		el.appendRows = appendGridRows;
		el.appendRow = appendGridRow;
		el.getRow = function () {
			return $('> *:nth-child('+row+')', el);
		};
		el.getCell = function (row, col) {
			return $('> *:nth-child('+row+') > *:nth-child(' + cell + ')', el);
		};
		el.appendRows(layout);
		return el;
	};

	// registers a new 'tag' that can be used to automate
	// the creation of a known element hierarchy
	backstrap.registerElement= function(name, renderer) {
		if (!backstrap[name]) {
			backstrap[name] = function() {
				var el = backstrap('div', {'class' : name});
				renderer.apply(el, Array.prototype.slice.call(arguments));
				return el;
			};
		}
	};

	// Make a global.
	context.$$ = context.Backstrap = backstrap;

	return backstrap;
})(this);
