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

	// Hold onto $$ for noConflict() in case of overwrite.
	var _$$ = context.$$;

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
			'medium'       : 'md',  // for cols
			'md'           : 'md',  // for cols
			'small'        : 'sm',
			'sm'           : 'sm',
			'extra-small'  : 'xs',
			'xs'           : 'xs',
			'block'        : 'block' // for buttons only
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
	var backstrap = function backstrap(tag, bootstrapClass) {

		// handle Bootstrap special tags, context, and sizing.
		var size = null;
		var context = 'default';
		var fluid = false;
		var classlist = {};
		if (bootstrapClass) { classlist[bootstrapClass] = true; }
		
		// create a new element of the requested type
		var el = document.createElement(tag);

		// walk through the rest of the arguments
		for(var i=2; i<arguments.length; i++) {
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
			else if (i === 2 && typeof(arg) === 'object') {
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
										// use the cssText property.
										if (key === 'style' && el.style.setAttribute) {
											el.style.setAttribute('cssText', value);
										} else {
											el.setAttribute('style', value);
										}
										break;
	
									case 'className':
										value.split(" ").forEach(function (name) {
											classlist[name] = true;
										});
										break;
	
									case 'htmlFor':
										// if we're setting an attribute that's not properly supported,
										// then we apply the attribute directly to the element
										el.htmlFor = value;
										break;
	
									// The rest of the cases are for Bootstrap attributes.
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

									case 'fluid':
										fluid = !!value;
										break;
	
									// otherwise, we use the standard setAttribute
									default:
										el.setAttribute(key, value);
								}
							}
						}
					}
				}
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
		
		// A few special Bootstrap details
		classlist[(bootstrapClass !== null ? bootstrapClass : 'text') + '-' + context] = true;
		if (size != null) {
			classlist[(bootstrapClass !== null ? bootstrapClass : 'text') + '-' + size] = true;
		}
		if (bootstrapClass === 'btn-toolbar') {
			el.setAttribute('role', 'toolbar');
		}
		if (bootstrapClass === 'container' && fluid) {
			classlist['container-fluid'] = true;
		}
		if (bootstrapClass === 'input') {
			classlist['form-control'] = true;
		}
		
		// Set className from classlist.
		el.className = Object.keys(classlist).join(' ');

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
			var cell = layout[c];
			var cellClass;
			var content = ('content' in cell) ? cell.content : '';
			if (cell !== null && typeof cell === 'object') {
				cellClass = parseCellSpec(cell);
			} else {
				cellClass = 'col col-md-' + cell;
			}
			rowdiv.append(backstrap.div({className: cellClass}, content));
		}
	};

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
	            'ul', 'var', 'video', 'wbr'].concat(deprecatedTags);

	// Bootstrap component pseudo-tags
	var bootstrapComponents = ['alert', 'badge', 'breadcrumb', 'button', 'buttonGroup', 'buttonToolbar',
	                           'container', 'input', 'inputGroup', 'jumbotron', 'label',
	                           'linkList', 'linkListItem', 'list', 'listItem',
	                           'pageHeader', 'pagination', 'spanLabel', 'well'];
	
	// HTML tags for Bootstrap components
	var bootstrapTags = {
			alert: 'div',
			badge: 'span',
			breadcrumb: 'ol',
			buttonGroup: 'div',
			buttonToolbar: 'div',
			container: 'div',
			inputGroup: 'div',
			jumbotron: 'div',
			linkList: 'div',
			linkListItem: 'a',
			list: 'ul',
			listItem: 'li',
			pageHeader: 'div',
			pagination: 'ul',
			spanLabel: 'span',
			well: 'div'
	};

	// HTML class names for Bootstrap components
	var bootstrapClasses = {
			button: 'btn',
			buttonGroup: 'btn-group',
			buttonToolbar: 'btn-toolbar',
			input: 'form-control',
			inputGroup: 'input-group',
			linkList: 'list-group',
			linkListItem: 'list-group-item',
			list: 'list-group',
			listItem: 'list-group-item',
			pageHeader: 'page-header',
			spanLabel: 'label'
	};

	// add our tag methods to the backstrap object
	var makeApply = function(tagName, bootstrapClass) {
		return function() {
			return backstrap.apply(this,
					[tagName, bootstrapClass].concat(Array.prototype.slice.call(arguments)));
		};
	};

	for(var i=0; i<tags.length; i++) {
		backstrap[tags[i]] = makeApply(tags[i], null);
	}
	
	// Save all tag methods as properties of $$.html (also a tag factory method)
	// so we can access them even after we overwrite some with Bootstrap functionality.
	for(var i=0; i<tags.length; i++) {
		backstrap.html[tags[i]] = backstrap[tags[i]];
	}

	// special tags for Bootstrap support.
	// note that some of these override regular HTML tags.
	// Use $$.html.* for the vanilla HTML versions.
	for(var i=0; i<bootstrapComponents.length; i++) {
		var name = bootstrapComponents[i];
		backstrap[name] = makeApply(
				(bootstrapTags[name] ? bootstrapTags[name] : name),
				(bootstrapClasses[name] ? bootstrapClasses[name] : name)
		);
	}
	
	// shortcut for creating CSS stylesheet links.
	backstrap.css = function (href) {
		return backstrap.html.link({href: href, rel: "stylesheet", type: "text/css"});
	};

	// shortcut for creating glyphicons.
	backstrap.glyph = function (name) {
		return backstrap.html.span({className: 'glyphicon glyphicon-' + name});
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
			return $('> *:nth-child('+row+') ', el);
		};
		el.getCell = function (row, col) {
			return $('> *:nth-child('+row+') > *:nth-child(' + cell + ') ', el);
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

	// Reset context.$$ and return a reference to backstrap.
	backstrap.noConflict = function() {
		if ( context.$$ === backstrap ) {
			context.$$ = _$$;
		}
		return backstrap;
	};

	// If we're in an AMD environment, we register as a named AMD module.
	if (typeof define === "function" && define.amd) {
		define("backstrap", ["jquery", "bootstrap", "backbone"], function() {
			return backstrap;
		});
	}

	// If we're in a CommonJS environment, we export ourself.
	// Otherwise, we attach ourself to the top level $$ namespace.
	// Call "var altName = $$.noConflict();" to revert definition of $$.
	if (typeof module === "object" && typeof module.exports === "object") {
		module.exports = backstrap;
	} else {
		context.$$ = backstrap;
	}

}(this));

