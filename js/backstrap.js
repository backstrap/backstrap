/**
 * The core Backstrap object. Provides various tag and object factory methods.
 * 
 * This is based heavily on Joe Stelmach's nifty laconic.js
 * https://github.com/joestelmach/laconic
 * 
 * It also uses Backbone-UI
 * https://github.com/perka/backbone-ui
 * 
 * It enhances the laconic tag generator and Backbone-UI components
 * with an awareness of Bootstrap class decoration.
 * 
 * Both those packages are under the MIT license:
 * https://github.com/joestelmach/laconic/blob/master/LICENSE
 * https://github.com/perka/backbone-ui/blob/master/LICENSE
 *
 * I've added a natural syntax for making Bootstrap-enabled objects.
 *
 * Suggested use:
 *   require(['backstrap/backstrap'], function($$) {
 *     $$.panel(
 *         $$.alert({context: 'danger'},
 *             'Uh-oh! ',
 *             $$.glyph('star')
 *         ),
 *         $$.button({size: 'large'}, 'OK')
 *     );
 *   }
 *
 * @license MIT
 **/
(function (context) {
  var fn = function (context) {

	var $ = context.$,
		BBView = context.Backbone.View;

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
			'default'      : 'default',
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
	var backstrap = function $$(tag, bootstrapClass) {

		// handle Bootstrap special attributes
		var bootstrap = {
			context: 'default'
		};
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
											bootstrap.size = sizeMap[value];
										} else {
											el.setAttribute('size', value);
										}
										break;

									case 'bgcontext':
										classlist['bg-' + value] = true;
										break;

									case 'context':
									case 'fluid':
									case 'footer':
									case 'heading':
									case 'inline':
									case 'media':
									case 'pull':
									case 'striped':
									case 'bordered':
									case 'hover':
									case 'condensed':
										bootstrap[key] = value;
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
		
		// handle the Bootstrap details
		classlist[(bootstrapClass !== null ? bootstrapClass : 'text') + '-' + bootstrap.context] = true;
		if (bootstrap.size != null) {
			classlist[(bootstrapClass !== null ? bootstrapClass : 'text') + '-' + bootstrap.size] = true;
		}
		switch (bootstrapClass) {
			case 'btn-toolbar':
				el.setAttribute('role', 'toolbar');
				break;
			case 'form':
				el.setAttribute('role', 'form');
				if (bootstrap.inline) {
					classlist['form-inline'] = true;
				}
				break;
			case 'container':
				if (bootstrap.fluid) {
					classlist['container-fluid'] = true;
				}
				break;
			case 'input':
				classlist['form-control'] = true;
				break;
			case 'panel':
				var content = $('> *', el);
				var body = $$.div({className: 'panel-body'});
				
				$(body).append(content);
				if (bootstrap.heading && bootstrap.heading.nodeType === 1) {
					el.appendChild($$.div({className: 'panel-heading'}, bootstrap.heading));
				}
				el.appendChild(body);
				if (bootstrap.footer && bootstrap.footer.nodeType === 1) {
					el.appendChild($$.div({className: 'panel-footer'}, bootstrap.footer));
				}
				break;
			case 'media':
				if (bootstrap.media && bootstrap.media.nodeType === 1) {
					var content = $('> *', el);
					var body = $$.div({className: 'media-body'});
					var pullClass = 'pull-' + (bootstrap.pull === 'right' ? 'right' : 'left');
					
					$(body).append(content);
					el.appendChild($$.span({className: pullClass}, bootstrap.media));
					el.appendChild(body);
				}
				break;
			case 'table':
				if (bootstrap.striped) {
					classlist['table-striped'] = true;
				}
				if (bootstrap.bordered) {
					classlist['table-bordered'] = true;
				}
				if (bootstrap.hover) {
					classlist['table-hover'] = true;
				}
				if (bootstrap.condensed) {
					classlist['table-condensed'] = true;
				}
				break;
		}
		
		// Set className from classlist.
		el.className = Object.keys(classlist).join(' ');

		// Add an appendTo method to the newly created element, which will allow
		// the DOM insertion to be method chained to the creation. For example:
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
            if (prop === 'className') {
                str += ' ' + spec[prop];
            }
		}
		return str;
	};

	var appendGridRow = function (layout) {
		var rowdiv = backstrap.div({className: 'row'});
		$(this).append(rowdiv);
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
			$(rowdiv).append(backstrap.div({className: cellClass}, content));
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
	                           'container', 'form', 'formGroup', 'input', 'inputGroup', 'inputGroupAddon', 'jumbotron', 'label',
	                           'linkList', 'linkListItem', 'list', 'listItem', 'media',
	                           'pageHeader', 'pagination', 'panel', 'spanLabel', 'table', 'thumbnail', 'well'];
	
	// HTML tags for Bootstrap components
	var bootstrapTags = {
			alert: 'div',
			badge: 'span',
			breadcrumb: 'ol',
			buttonGroup: 'div',
			buttonToolbar: 'div',
			container: 'div',
			formGroup: 'div',
			inputGroup: 'div',
			inputGroupAddon: 'span',
			jumbotron: 'div',
			linkList: 'div',
			linkListItem: 'a',
			list: 'ul',
			listItem: 'li',
			media: 'div',
			pageHeader: 'div',
			pagination: 'ul',
			panel: 'div',
			spanLabel: 'span',
			thumbnail: 'div',
			well: 'div'
	};

	// HTML class names for Bootstrap components
	var bootstrapClasses = {
			button: 'btn',
			buttonGroup: 'btn-group',
			buttonToolbar: 'btn-toolbar',
			formGroup: 'form-group',
			input: 'form-control',
			inputGroup: 'input-group',
			inputGroupAddon: 'input-group-addon',
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

	backstrap.plain = {};

	// Save all tag methods as properties of $$.plain
	// so we can access them even if we overwrite some with Bootstrap functionality.
	for(var i=0; i<tags.length; i++) {
		backstrap.plain[tags[i]] = backstrap[tags[i]] = makeApply(tags[i], null);
	}

	// Special tags for Bootstrap support.
	// Note that some of these will overwrite regular HTML tags.
	// Use $$.plain.* for the vanilla HTML versions.
	for(var i=0; i<bootstrapComponents.length; i++) {
		var name = bootstrapComponents[i];
		backstrap[name] = makeApply(
				(bootstrapTags[name] ? bootstrapTags[name] : name),
				(bootstrapClasses[name] ? bootstrapClasses[name] : name)
		);
	}
	
	// shortcut for creating CSS stylesheet links.
	backstrap.css = function (href) {
		return backstrap.plain.link({href: href, rel: "stylesheet", type: "text/css"});
	};

	// shortcut for creating glyphicons.
	backstrap.glyph = function (name) {
		return backstrap.plain.span({className: 'glyphicon glyphicon-' + name});
	};

	// shortcut for creating Bootstrap grids.
	backstrap.grid = function () {
		var cn = 'container';
		var layout = [[ 12 ]];
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
				['div', null].concat(Array.prototype.slice.call(arguments)));
		$(el).addClass(cn);
		el.appendRows = appendGridRows;
		el.appendRow = appendGridRow;
		el.getRow = function () {
			return $('> *:nth-child('+row+') ', el);
		};
		el.getCell = function (row, col) {
			return $('> *:nth-child('+row+') > *:nth-child(' + col + ') ', el);
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
	
	backstrap._mapSize = function (value)
	{
		return sizeMap[value];
	};

	/******** Backbone-UI stuff ****************/
	
	// Don't need this. Just hold them here as documentation.
	/*
	backstrap.KEYS = {
		KEY_BACKSPACE: 8,
		KEY_TAB:       9,
		KEY_RETURN:   13,
		KEY_ESC:      27,
		KEY_LEFT:     37,
		KEY_UP:       38,
		KEY_RIGHT:    39,
		KEY_DOWN:     40,
		KEY_DELETE:   46,
		KEY_HOME:     36,
		KEY_END:      35,
		KEY_PAGEUP:   33,
		KEY_PAGEDOWN: 34,
		KEY_INSERT:   45
	};
	*/

	backstrap.BaseView = BBView.extend({
		initialize : function(options) {
			this.options = this.options ? _({}).extend(this.options, options) : options;
		}
	});

	/************* Add some utility methods to Backbone.View **********/

	_(BBView.prototype).extend({
	  
	  // resolves the appropriate content from the given choices
	  resolveContent : function(model, content, defaultOption) {
	    defaultOption = (defaultOption === null || _(defaultOption).isUndefined()) ? 
	      this.options.content : defaultOption;
	    model = _(model).exists() ? model : this.model;
	    content = _(content).exists() ? content : defaultOption;
	    var hasModelProperty = _(model).exists() && _(content).exists();
	    return _(content).isFunction() ? content(model) : 
	      hasModelProperty && _(model[content]).isFunction() ? model[content]() : 
	      hasModelProperty && _(_(model).resolveProperty(content)).isFunction() ? _(model).resolveProperty(content)(model) : 
	      hasModelProperty ? _(model).resolveProperty(content) : content;
	  },

	  mixin : function(objects) {
	    var options = _(this.options).clone();

	    _(objects).each(function(object) {
	      $.extend(true, this, object);
	    }, this);

	    $.extend(true, this.options, options);
	  }
	});

	/************* Add some utility methods to underscore **********/
	
	_.mixin({
	  // produces a natural language description of the given
	  // index in the given list
	  nameForIndex : function(list, index) {
	    return list.length === 1 ? 'first last' : 
	      index === 0 ? 'first' : 
	      index === list.length - 1 ? 
	      'last' : 'middle';
	  },

	  exists : function(object) {
	    return !_(object).isNull() && !_(object).isUndefined();
	  },
	  
	  // resolves the value of the given property on the given 
	  // object.
	  resolveProperty : function(object, property) {
	    var result = null;
	    if(_(property).exists() && _(property).isString()) {
	      var parts = property.split('.');
	      _(parts).each(function(part) {
	        if(_(object).exists()) {
	          var target = result || object;
	          result = _(target.get).isFunction() ? target.get(part) : target[part];
	        }
	      });
	    }

	    return result;
	  },

	  // sets the given value for the given property on the given 
	  // object.
	  setProperty : function(object, property, value, silent) {
	    if(!property) return;

	    var parts = property.split('.');
	    _(parts.slice(0, parts.length - 2)).each(function(part) {
	      if(!_(object).isNull() && !_(object).isUndefined()){ 
	        object = _(object.get).isFunction() ? object.get(part) : object[part];
	      }
	    });

	    if(!!object) {
	      if(_(object.set).isFunction()) {
	        var attributes = {};
	        attributes[property] = value;
	        object.set(attributes, {silent : silent});
	      }
	      else {
	        object[property] = value;
	      }
	    }
	  }
	});

	var _alignCoords = function(el, anchor, pos, xFudge, yFudge) {
	  el = $(el);
	  anchor = $(anchor);
	  pos = pos || '';

	  // Get anchor bounds (document relative)
	  var bOffset = anchor.offset();
	  var bDim = {width : anchor.width(), height : anchor.height()};

	  // Get element dimensions
	  //var elbOffset = el.offset();
	  var elbDim = {width : el.width(), height : el.height()};

	  // Determine align coords (document-relative)
	  var x,y;
	  if (pos.indexOf('-left') >= 0) {
	    x = bOffset.left;
	  } else if (pos.indexOf('left') >= 0) {
	    x = bOffset.left - elbDim.width;
	  } else if (pos.indexOf('-right') >= 0) {
	    x = (bOffset.left + bDim.width) - elbDim.width;
	  } else if (pos.indexOf('right') >= 0) {
	    x = bOffset.left + bDim.width;
	  } else { // Default = centered
	    x = bOffset.left + (bDim.width - elbDim.width)/2;
	  }

	  if (pos.indexOf('-top') >= 0) {
	    y = bOffset.top;
	  } else if (pos.indexOf('top') >= 0) {
	    y = bOffset.top - elbDim.height;
	  } else if (pos.indexOf('-bottom') >= 0) {
	    y = (bOffset.top + bDim.height) - elbDim.height;
	  } else if (pos.indexOf('bottom') >= 0) {
	    y = bOffset.top + bDim.height;
	  } else { // Default = centered
	    y = bOffset.top + (bDim.height - elbDim.height)/2;
	  }
	  
	  // Check for constrainment (default true)
	  //var constraint = true;
	  //if (pos.indexOf('no-constraint') >= 0) constraint = false;

	  // Add fudge factors
	  x += xFudge || 0;
	  y += yFudge || 0;

	  // Create bounds rect/constrain to viewport
	  //var nb = new zen.util.Rect(x,y,elb.width,elb.height);
	  //if (constraint) nb = nb.constrainTo(zen.util.Dom.getViewport());

	  // Convert to offsetParent coordinates
	  //if(el.offsetParent()) {
	    //var ob = $(el.offsetParent).getOffset();
	    //nb.translate(-ob.left, -ob.top);
	  //}

	  // Return rect, constrained to viewport
	  return {x : x, y : y};
	};

	/************* Add some utility methods to JQuery **********/
	
	_($.fn).extend({
	  // aligns each element relative to the given anchor
	  /**
	  * <p>
	  * Align an element relative to another element (which can be absolute or
	  * inline).  This forces the target element to be absolutely positioned
	  * (which it probably should be anyway, to insure it's width/height don't
	  * change when converting to absolute positioning.)</p>
	  *
	  * @function alignTo
	  * @param {Element} anchor element to position relative to
	  * @param pos A string consists of one or two words that describe where the
	  * target element is positioned relative to the anchor element.
	  * <dl>
	  *   <dt>center</dt>
	  *     <dd>The default alignment, centers the element along either the
	  *     vertical or horizontal axis.</dd>
	  *   <dt>top</dt>    
	  *     <dd>places target element above the anchor</dd>
	  *   <dt>bottom</dt> 
	  *     <dd>places target element below the anchor</dd>
	  *   <dt>left</dt>   
	  *     <dd>places target element to the left of the anchor</dd>
	  *   <dt>right</dt>  
	  *     <dd>places target element to the right of the anchor</dd>
	  *   <dt>-top</dt>   
	  *     <dd>aligns top edge of target with top of anchor</dd>
	  *   <dt>-bottom</dt>
	  *     <dd>aligns bottom edge of target with bottom of anchor</dd>
	  *   <dt>-left</dt>  
	  *     <dd>aligns left edge of target with left of anchor</dd>
	  *   <dt>-right</dt> 
	  *     <dd>aligns right edge of target with right of anchor</dd>
	  *   <dt>no-constraint</dt> 
	  *     <dd>
	  *      By default, the target is constrained to the viewport.
	  *      This allows you to let it overflow the page.
	  *     </dd>
	  *   </dl>
	  *
	  * For example...
	  * <ul>
	  *   <li>"top" - element is above anchor, centered horizontally</li>
	  *   <li>"bottom left" - element is placed below and to left of anchor</li>
	  *   <li>"-left bottom" - element will be below anchor, aligned along left
	  *   edge.</li>
	  *   <li>(This is the recommended position for drop-down selection
	  *   lists)</li>
	  * </ul>
	  * @param {int} xFudge Optional x offset to add (may be negative)
	  * @param {int} yFudge Optional y offset to add (may be negative)
	  */
	  alignTo : function(anchor, pos, xFudge, yFudge, container) {
	    _.each(this, function(el) {
	      var rehide = false;
	      // in order for alignTo to work properly the element needs to be visible
	      // if it's hidden show it off screen so it can be positioned
	      if(el.style.display === 'none') {
	        rehide=true;
	        $(el).css({position:'absolute',top:'-10000px', left:'-10000px', display:'block'});
	      }

	      var o = _alignCoords(el, anchor, pos, xFudge, yFudge);
	      
	      // if a container is passed in adjust position
	      // for the offset of the containing element
	      if(_(container).isElement()) {
	        var c = $(container).offset();
	        o.x = o.x - c.left;
	        o.y = o.y - c.top;
	      }
	      
	      $(el).css({
	        position:'absolute',
	        left: Math.round(o.x) + 'px',
	        top: Math.round(o.y) + 'px'
	      });

	      if(rehide) $(el).hide();
	    });
	  },

	  // Hides each element the next time the user clicks the mouse or presses a
	  // key.  This is a one-shot action - once the element is hidden, all
	  // related event handlers are removed.
	  autohide : function(options) {
	    _.each(this, function(el) {
	      options = _.extend({
	        onEvent : 'click', //click or mouseover
	        leaveOpen : false,
	        hideCallback : false,
	        ignoreInputs: false,
	        ignoreKeys : [],
	        leaveOpenTargets : []
	      }, options || {});
	      
	      el._autoignore = true;
	      setTimeout(function() {
	        el._autoignore = false; $(el).removeAttr('_autoignore'); 
	      }, 0);

	      if (!el._autohider) {
	        el._autohider = _.bind(function(e) {

	          var target = e.target;
	          if(!$(el).is(':visible')) return;

	          if (options.ignoreInputs && (/input|textarea|select|option/i).test(target.nodeName)) return;
	          //if (el._autoignore || (options.leaveOpen && Element.partOf(e.target, el)))
	          if(el._autoignore) return;
	          // pass in a list of keys to ignore as autohide triggers
	          if(e.type && e.type.match(/keypress/) && _.include(options.ignoreKeys, e.keyCode)) return;
	          
	          // allows you to provide an array of elements that should not trigger autohiding.
	          // This is useful for doing thigns like a flyout menu from a pulldown
	          if(options.leaveOpenTargets) {
	            var ancestor = _(options.leaveOpenTargets).find(function(t) {
	              return e.target === t || $(e.target).closest($(t)).length > 0;
	            });
	            if(!!ancestor) return;
	          }
	          
	          var proceed = (options.hideCallback) ? options.hideCallback(el) : true;
	          if (!proceed) return;

	          $(el).hide();
	          $(document).bind(options.onEvent, el._autohider);
	          $(document).bind('keypress', el._autohider);
	          el._autohider = null;
	        }, this);

	        $(document).bind(options.onEvent, el._autohider);
	        $(document).bind('keypress', el._autohider);
	      }
	    });
	  }
	});

	/******** End of Backbone-UI stuff ****************/
	
	return backstrap;
  };

  // If we're in an AMD environment, we register as a named AMD module.
  // If this looks like AMD, but it's really backstrap-built.js, then
  // we temporarily attach ourself to the top level $$ namespace;
  // _cleanup.js will remove that temporary defn and run the AMD define().
  // If we're in a CommonJS environment, we export ourself.
  // Otherwise, we attach ourself to the top level $$ namespace, in which case
  // you can call "var altName = $$.noConflict();" to revert definition of $$.
  if (typeof context.define === "function" && context.define.amd) {
	  if (context._$$_backstrap_built_flag) {
			if(typeof context.$ === 'undefined') throw new Error('jQuery environment not loaded');
			if(typeof context.Backbone.View === 'undefined') throw new Error('Backbone environment not loaded');

			var _$$ = context.$$;
			var backstrap = fn(context);
			
			backstrap.noConflict = function() {
				if ( context.$$ === backstrap ) { context.$$ = _$$; }
				return backstrap;
			};
			
			context.$$ = backstrap;
	  } else {
		context.define("backstrap", ["jquery", "backbone", "bootstrap"], function($, Backbone) {
			return fn({$: $, Backbone: Backbone});
		});
	  }
	} else if (typeof context.module === "object" && typeof context.module.exports === "object") {
		require("bootstrap");
		context.module.exports = fn({$: require("jquery"), Backbone: require("backbone")});
	} else {
		if(typeof context.$ === 'undefined') throw new Error('jQuery environment not loaded');
		if(typeof context.Backbone.View === 'undefined') throw new Error('Backbone environment not loaded');

		var _$$ = context.$$;
		var backstrap = fn(context);
		
		backstrap.noConflict = function() {
			if ( context.$$ === backstrap ) { context.$$ = _$$; }
			return backstrap;
		};
		
		context.$$ = backstrap;
	}
})(this);
