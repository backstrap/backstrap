/**
 * This is a bit of a kluge.  We need to differentiate between
 * the case where we're loading from the Composer component-builder
 * components/backstrap/backstrap-built.js (which has an AMD define()
 * function defined) and the case where we're loading individual files
 * on demand via some other AMD loader.  So we set a temporary global function,
 * _$$_backstrap_built_flag, for the duration of backstrap-built.js.
 * We test for its existence within the module scripts, and then at the end
 * (see _cleanup.js), we execute the _$$_backstrap_built_flag function
 * causing it to remove itself from our global context.
 * 
 * @author Kevin Perry perry@princeton.edu
 */
(function (context)
{
	if (typeof context.define === "function" && context.define.amd) {
		var saved = context._$$_backstrap_built_flag;
		context._$$_backstrap_built_flag = function _built_flag() {
			if ( context._$$_backstrap_built_flag === _built_flag ) { context._$$_backstrap_built_flag = saved; }
		};
	}
}(this));

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
 *   require(['backstrap/backstrap'], function ($$) {
 *     $$.panel(
 *         $$.alert({context: 'danger'},
 *             'Uh-oh! ',
 *             $$.glyph('star')
 *         ),
 *         $$.button({size: 'large'}, 'OK')
 *     );
 *   }
 *
 * @author Kevin Perry perry@princeton.edu
 * @license MIT
 **/
(function (context)
{
    var fn = function (context)
    {

        var $ = context.$;

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
        // The second parameter MUST be a string specifying the element's
        // bootstrap class name.
        // 
        // An optional object of element attributes may follow directly
        // after the tag and class names.
        // 
        // Additional arguments will be considered children of the new
        // element and may consist of elements, strings, or numbers.
        // 
        // for example:
        // backstrap('div', 'btn', {'class' : 'foo'}, 'bar');
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
            for (var i=2; i<arguments.length; i++) {
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
                    for (var key in arg) {
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
                    for (var j=0; j<arg.length; j++) {
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
            el.appendTo = function (parentNode) {
                if (parentNode.nodeType === 1 && this.nodeType === 1) {
                    parentNode.appendChild(this);
                }
                return el;
            };

            return el;
        };

        // html 4 tags
        var deprecatedTags = ['acronym', 'applet', 'basefont', 'big', 'center',
                    'dir', 'font', 'frame', 'frameset', 'noframes',
                    'strike', 'tt', 'xmp'];

        // html 5 tags
        var tags = ['a', 'abbr', 'address', 'area', 'article', 'aside', 'audio',
                    'b', 'base', 'bdi', 'bdo', 'blockquote', 'body', 'br', 'button',
                    'canvas', 'caption', 'cite', 'code', 'col', 'colgroup',
                    'datalist', 'dd', 'del', 'details',
                    'dfn', 'dialog', 'div', 'dl', 'dt',
                    'em', 'embed', 'fieldset', 'figcaption', 'figure', 'footer', 'form',
                    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
                    'head', 'header', 'hgroup', 'hr', 'html',
                    'i', 'iframe', 'img', 'input', 'ins', 'kbd', 'keygen',
                    'label', 'legend', 'li', 'link',
                    'main', 'map', 'mark', 'menu', 'menuItem', 'meta', 'meter',
                    'nav', 'noscript', 'object', 'ol', 'optgroup', 'option', 'output',
                    'p', 'param', 'pre', 'progress', 'q', 'rp', 'rt', 'ruby',
                    's', 'samp', 'script', 'section', 'select', 'small', 'source',
                    'span', 'strong', 'style', 'sub', 'summary', 'sup',
                    'table', 'tbody', 'td', 'textarea', 'tfoot', 'th',
                    'thead', 'time', 'title', 'tr', 'track',
                    'u', 'ul', 'var', 'video', 'wbr'].concat(deprecatedTags);

        // Bootstrap component pseudo-tags
        var bootstrapComponents = ['alert', 'badge', 'breadcrumb', 'button',
                    'buttonGroup', 'buttonToolbar', 'caret', 'container',
                    'form', 'formGroup', 'input', 'inputGroup', 'inputGroupAddon',
                    'jumbotron', 'label', 'linkList', 'linkListItem', 'list',
                    'listItem', 'media', 'pageHeader', 'pagination', 'panel',
                    'spanLabel', 'table', 'thumbnail', 'well'];

        // HTML tags for Bootstrap components
        var bootstrapTags = {
                alert: 'div',
                badge: 'span',
                breadcrumb: 'ol',
                buttonGroup: 'div',
                buttonToolbar: 'div',
                caret: 'span',
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
        var makeApply = function (tagName, bootstrapClass) {
            return function () {
                return backstrap.apply(this,
                        [tagName, bootstrapClass].concat(Array.prototype.slice.call(arguments)));
            };
        };

        backstrap.plain = {};

        // Save all tag methods as properties of $$.plain
        // so we can access them even if we overwrite some with Bootstrap functionality.
        for (var i=0; i<tags.length; i++) {
            backstrap.plain[tags[i]] = backstrap[tags[i]] = makeApply(tags[i], null);
        }

        // Special tags for Bootstrap support.
        // Note that some of these will overwrite regular HTML tags.
        // Use $$.plain.* for the vanilla HTML versions.
        for (var i=0; i<bootstrapComponents.length; i++) {
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

        // registers a new 'tag' that can be used to automate
        // the creation of a known element hierarchy
        backstrap.registerElement= function (name, renderer) {
            if (!backstrap[name]) {
                backstrap[name] = function () {
                    var el = backstrap('div', {'class' : name});
                    renderer.apply(el, Array.prototype.slice.call(arguments));
                    return el;
                };
            }
        };
        
        backstrap._mapSize = function (value) {
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

        backstrap.View = context.Backbone.View.extend({
            initialize : function (options) {
                this.options = this.options ? _({}).extend(this.options, options) : options;
            }
        });

        backstrap.Events = _.extend({}, Backbone.Events);

        backstrap.Router = Backbone.Router.extend({});

        backstrap.history = Backbone.history;

        /************* Add some utility methods to $$.View **********/

        _(backstrap.View.prototype).extend({
            // resolves the appropriate content from the given choices
            resolveContent : function (model, content, defaultOption) {
                defaultOption = (defaultOption === null || _(defaultOption).isUndefined())
                    ? this.options.content : defaultOption;
                model = _(model).exists() ? model : this.model;
                content = _(content).exists() ? content : defaultOption;
                var hasModelProperty = _(model).exists() && _(content).exists();
                return _(content).isFunction()
                    ? content(model)
                    : hasModelProperty && _(model[content]).isFunction()
                        ? model[content]()
                        : hasModelProperty && _(_(model).resolveProperty(content)).isFunction()
                            ? _(model).resolveProperty(content)(model)
                            : hasModelProperty
                                ? _(model).resolveProperty(content)
                                : content;
            },

            mixin : function (objects) {
                var options = _(this.options).clone();

                _(objects).each(function (object) {
                    $.extend(true, this, object);
                }, this);

                $.extend(true, this.options, options);
            }
        });

        /************* Add some utility methods to underscore **********/
        
        _.mixin({
            // produces a natural language description of the given
            // index in the given list
            nameForIndex : function (list, index) {
                return list.length === 1 ? 'first last' : 
                    index === 0 ? 'first' : 
                        index === list.length - 1 ? 
                            'last' : 'middle';
            },
    
            exists : function (object) {
                return !_(object).isNull() && !_(object).isUndefined();
            },
              
            // resolves the value of the given property on the given 
            // object.
            resolveProperty : function (object, property) {
                var result = null;
                if (_(property).exists() && _(property).isString()) {
                    var parts = property.split('.');
                    _(parts).each(function (part) {
                        if (_(object).exists()) {
                            var target = result || object;
                            result = _(target.get).isFunction() ? target.get(part) : target[part];
                        }
                    });
                }
    
                return result;
            },
    
            // sets the given value for the given property on the given 
            // object.
            setProperty : function (object, property, value, silent) {
                if (!property) return;
    
                var parts = property.split('.');
                _(parts.slice(0, parts.length - 2)).each(function (part) {
                    if (!_(object).isNull() && !_(object).isUndefined()){ 
                      object = _(object.get).isFunction() ? object.get(part) : object[part];
                    }
                });
    
                if (!!object) {
                    if (_(object.set).isFunction()) {
                        var attributes = {};
                        attributes[property] = value;
                        object.set(attributes, {silent : silent});
                    } else {
                        object[property] = value;
                    }
                }
            }
        });

        var _alignCoords = function (el, anchor, pos, xFudge, yFudge) {
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
            //if (el.offsetParent()) {
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
            alignTo : function (anchor, pos, xFudge, yFudge, container) {
                _.each(this, function (el) {
                  var rehide = false;
                  // in order for alignTo to work properly the element needs to be visible
                  // if it's hidden show it off screen so it can be positioned
                  if (el.style.display === 'none') {
                    rehide=true;
                    $(el).css({position:'absolute',top:'-10000px', left:'-10000px', display:'block'});
                  }

                  var o = _alignCoords(el, anchor, pos, xFudge, yFudge);

                  // if a container is passed in adjust position
                  // for the offset of the containing element
                  if (_(container).isElement()) {
                    var c = $(container).offset();
                    o.x = o.x - c.left;
                    o.y = o.y - c.top;
                  }

                  $(el).css({
                    position:'absolute',
                    left: Math.round(o.x) + 'px',
                    top: Math.round(o.y) + 'px'
                  });
    
                  if (rehide) $(el).hide();
                });
            },

            // Hides each element the next time the user clicks the mouse or presses a
            // key.  This is a one-shot action - once the element is hidden, all
            // related event handlers are removed.
            autohide : function (options) {
                _.each(this, function (el) {
                    options = _.extend({
                        onEvent : 'click', //click or mouseover
                        leaveOpen : false,
                        hideCallback : false,
                        ignoreInputs: false,
                        ignoreKeys : [],
                        leaveOpenTargets : []
                    }, options || {});

                    el._autoignore = true;
                    setTimeout(function () {
                        el._autoignore = false; $(el).removeAttr('_autoignore'); 
                    }, 0);

                    if (!el._autohider) {
                        el._autohider = _.bind(function (e) {
                            var target = e.target;
                            if (!$(el).is(':visible')) return;
    
                            if (options.ignoreInputs && (/input|textarea|select|option/i).test(target.nodeName)) return;
                            //if (el._autoignore || (options.leaveOpen && Element.partOf(e.target, el)))
                            if (el._autoignore) return;
                            // pass in a list of keys to ignore as autohide triggers
                            if (e.type && e.type.match(/keypress/) && _.include(options.ignoreKeys, e.keyCode)) return;
                      
                            // allows you to provide an array of elements that should not trigger autohiding.
                            // This is useful for doing thigns like a flyout menu from a pulldown
                            if (options.leaveOpenTargets) {
                                var ancestor = _(options.leaveOpenTargets).find(function (t) {
                                    return e.target === t || $(e.target).closest($(t)).length > 0;
                                });
                                if (!!ancestor) return;
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
            if (typeof context.$ === 'undefined') {
                throw new Error('jQuery environment not loaded');
            }
            if (typeof context.Backbone.View === 'undefined') {
                throw new Error('Backbone environment not loaded');
            }

            var _$$ = context.$$;
            var backstrap = fn(context);

            backstrap.noConflict = function () {
                if ( context.$$ === backstrap ) { context.$$ = _$$; }
                return backstrap;
            };
            
            context.$$ = backstrap;
        } else {
            context.define("backstrap", ["jquery", "backbone", "bootstrap"],
                function ($, Backbone)
                {
                    return fn({$: $, Backbone: Backbone});
                }
            );
        }
    } else if (typeof context.module === "object" && typeof context.module.exports === "object") {
        require("bootstrap");
        context.module.exports = fn({$: require("jquery"), Backbone: require("backbone")});
    } else {
        if (typeof context.$ === 'undefined') {
            throw new Error('jQuery environment not loaded');
        }
        if (typeof context.Backbone.View === 'undefined') {
            throw new Error('Backbone environment not loaded');
    }

        var _$$ = context.$$;
        var backstrap = fn(context);

        backstrap.noConflict = function () {
            if ( context.$$ === backstrap ) { context.$$ = _$$; }
            return backstrap;
        };

        context.$$ = backstrap;
    }
})(this);

/*
    jQuery `input` special event v1.2
    http://whattheheadsaid.com/projects/input-special-event

    (c) 2010-2011 Andy Earnshaw
    forked by dodo (https://github.com/dodo)
    MIT license
    www.opensource.org/licenses/mit-license.php
*/

/*jshint eqeqeq:false */
/*jshint asi:true */
/*jshint undef:false */
/*jshint shadow:true */
if(window.jQuery) {
  (function($, udf) {
      var ns = ".inputEvent ",
          // A bunch of data strings that we use regularly
          dataBnd = "bound.inputEvent",
          dataVal = "value.inputEvent",
          dataDlg = "delegated.inputEvent",
          // Set up our list of events
          bindTo = [
              "input", "textInput",
              "propertychange",
              "paste", "cut",
              "keydown", "keyup",
              "drop",
          ""].join(ns),
          // Events required for delegate, mostly for IE support
          dlgtTo = [ "focusin", "mouseover", "dragstart", "" ].join(ns),
          // Elements supporting text input, not including contentEditable
          supported = {TEXTAREA:udf, INPUT:udf},
          // Events that fire before input value is updated
          delay = { paste:udf, cut:udf, keydown:udf, drop:udf, textInput:udf };

      // this checks if the tag is supported or has the contentEditable property
      function isSupported(elem) {
          return $(elem).prop('contenteditable') == "true" ||
                   elem.tagName in supported;
      }

      $.event.special.txtinput = {
          setup: function(data, namespaces, handler) {
              var timer = null,
                  bndCount,
                  // Get references to the element
                  elem  = this,
                  $elem = $(this),
                  triggered = false;

              if (isSupported(elem)) {
                  bndCount = $.data(elem, dataBnd) || 0;

                  if (!bndCount)
                      $elem.bind(bindTo, handler);

                  $.data(elem, dataBnd, ++bndCount);
                  $.data(elem, dataVal, elem.value);
              } else {
                  $elem.bind(dlgtTo, function (e) {
                      var target = e.target;
                      if (isSupported(target) && !$.data(elem, dataDlg)) {
                          bndCount = $.data(target, dataBnd) || 0;

                          if (!bndCount)
                              $(target).bind(bindTo, handler);

                          // make sure we increase the count only once for each bound ancestor
                          $.data(elem, dataDlg, true);
                          $.data(target, dataBnd, ++bndCount);
                          $.data(target, dataVal, target.value);
                      }
                  });
              }
              function handler (e) {
                  var elem = e.target;

                  // Clear previous timers because we only need to know about 1 change
                  window.clearTimeout(timer), timer = null;

                  // Return if we've already triggered the event
                  if (triggered)
                      return;

                  // paste, cut, keydown and drop all fire before the value is updated
                  if (e.type in delay && !timer) {
                      // ...so we need to delay them until after the event has fired
                      timer = window.setTimeout(function () {
                          if (elem.value !== $.data(elem, dataVal)) {
                              $(elem).trigger("txtinput");
                              $.data(elem, dataVal, elem.value);
                          }
                      }, 0);
                  }
                  else if (e.type == "propertychange") {
                      if (e.originalEvent.propertyName == "value") {
                          $(elem).trigger("txtinput");
                          $.data(elem, dataVal, elem.value);
                          triggered = true;
                          window.setTimeout(function () {
                              triggered = false;
                          }, 0);
                      }
                  }
                  else {
                      $(elem).trigger("txtinput");
                      $.data(elem, dataVal, elem.value);
                      triggered = true;
                      window.setTimeout(function () {
                          triggered = false;
                      }, 0);
                  }
              }
          },
          teardown: function () {
              var elem = $(this);
              elem.unbind(dlgtTo);
              elem.find("input, textarea").andSelf().each(function () {
                  bndCount = $.data(this, dataBnd, ($.data(this, dataBnd) || 1)-1);

                  if (!bndCount)
                      elem.unbind(bindTo);
              });
          }
      };

      // Setup our jQuery shorthand method
      $.fn.input = function (handler) {
          return handler ? $(this).bind("txtinput", handler) : this.trigger("txtinput");
      };
  })(window.jQuery);
}

/**
 * 
 * @author Kevin Perry perry@princeton.edu
 */
(function(context, moduleName, requirements)
{
    var fn = function($$, $)
    {
        var timeout = null;
        var dispatcher = {
                minInterval: 30,
                maxInterval: 1000,
                decayFrequency: 4,
                decayFactor: 2
        };
        var activeInterval = 0;
        var lastRefresh = 99999999999;
        var touchTime = (new Date()).getTime();

        var touch = function () {
            touchTime = (new Date()).getTime();
            if ((touchTime - lastRefresh)/1000 > dispatcher.minInterval) {
                activeInterval = dispatcher.minInterval;
                doRefresh();
            }
        };

        var doRefresh = function doRefresh() {
            if (!(dispatcher.minInterval > 0)) {
                console.log('$$.dispatcher.minInterval must be positive');
                return;
            }
            if (!(dispatcher.maxInterval >= dispatcher.minInterval)) {
                console.log('$$.dispatcher.maxInterval must be >= than minInterval');
                return;
            }
            if (!(dispatcher.decayFrequency >= 1 && dispatcher.decayFactor >= 1)) {
                console.log('$$.dispatcher decay parameters must be >= 1');
                return;
            }
            if (activeInterval < dispatcher.minInterval) {
                activeInterval = dispatcher.minInterval;
            }
            if (((new Date()).getTime() - touchTime)/1000 > activeInterval * dispatcher.decayFrequency
                    && activeInterval < dispatcher.maxInterval) {
                activeInterval = Math.min(activeInterval * dispatcher.decayFactor, dispatcher.maxInterval);
            }
            if (timeout) {
                clearTimeout(timeout);
            }
            timeout = setTimeout(doRefresh, activeInterval*1000);
            lastRefresh = (new Date()).getTime();
            dispatcher.trigger('refresh');
        };

        dispatcher = _.extend({
            minInterval: 10,
            maxInterval: 1000,
            decayFrequency: 6,
            decayFactor: 2,

            refresh: function () {
                console.log('refresh!');
            },

            /* Not normally used, but can be called OOB. */
            refreshMe: function () {
                lastRefresh = (new Date()).getTime();
                this.trigger('refresh');
            },

            startRefresh: function (model) {
                model.listenTo(this, 'refresh', model.refresh);
                if (!timeout) {
                    timeout = setTimeout(doRefresh, activeInterval*1000);
                }
            },

            stopRefresh: function (model) {
                model.stopListening(this, 'refresh', model.refresh);
            }
        }, $$.Events);

        $('html').on('click focus touchstart', function () {
            touch();
        });

        return ($$[moduleName] = dispatcher);
    };

    if (typeof context.define === 'function'
        && context.define.amd
        && !context._$$_backstrap_built_flag
    ) {
        context.define('backstrap/' + moduleName, requirements, fn);
    } else if (typeof context.module === 'object'
        && typeof context.module.exports === 'object'
    ) {
        context.module.exports = fn.call(requirements.map(
            function (reqName)
            {
                return require(reqName);
            }
        ));
    } else {
        if (typeof context.$$ !== 'function') {
            throw new Error('Backstrap not loaded');
        }
        if (typeof context.$ !== 'function') {
            throw new Error('jQuery environment not loaded');
        }
        fn(context.$$, context.$);
    }
}(this, 'dispatcher', ['backstrap', 'jquery', 'backstrap/Events']));

/**
 * A generic Backbone Model object, with extensions.
 * 
 * @author Kevin Perry perry@princeton.edu
 * @license MIT
 */
(function(context, moduleName, requirements)
{
    var fn = function($$, Backbone)
    {
        return ($$[moduleName] = Backbone.Model.extend({
            options: {
              // Whether the Model should automatically refresh at regular intervals.
              autoRefresh: false
            },
    
            initialize: function(options) {
                Backbone.Model.prototype.initialize.call(this, options);
                if(this.options.autoRefresh) {
                  this.resumeAutoRefresh();
                }  
            },
        
            pauseAutoRefresh: function () {
                  $$.dispatcher.stopRefresh(this);
            },
    
            resumeAutoRefresh: function () {
                  $$.dispatcher.startRefresh(this);
            },
    
            refresh: function () {
                this.fetch();
            }
        }));
    };

    if (typeof context.define === 'function'
        && context.define.amd
        && !context._$$_backstrap_built_flag
    ) {
        context.define('backstrap/' + moduleName, requirements, fn);
    } else if (typeof context.module === 'object'
        && typeof context.module.exports === 'object'
    ) {
        context.module.exports = fn.call(requirements.map(
            function (reqName)
            {
                return require(reqName);
            }
        ));
    } else {
        if (typeof context.$$ !== 'function') {
            throw new Error('Backstrap not loaded');
        }
        if (typeof context.Backbone.Model !== 'function') {
            throw new Error('Backbone not loaded');
        }
        fn(context.$$, context.Backbone);
    }
}(this, 'Model', [ 'backstrap', 'backbone', 'backstrap/dispatcher' ]));

/**
 * A generic Backbone Collection object, with extensions.
 * 
 * @author Kevin Perry perry@princeton.edu
 * @license MIT
 */
(function(context, moduleName, requirements)
{
    var fn = function($$, Backbone)
    {
        return ($$[moduleName] = Backbone.Collection.extend({
            options: {
              // Whether the Collection should automatically refresh at regular intervals.
              autoRefresh: false
            },
    
            initialize: function(model, options) {
                // NOOP Backbone.Collection.prototype.initialize.call(this, model, options);
                this.options = this.options ? _({}).extend(this.options, options) : options;
                if (this.options.autoRefresh) {
                  $$.dispatcher.startRefresh(this);
                }  
            },
        
            pauseAutoRefresh: function () {
                  $$.dispatcher.stopRefresh(this);
            },
    
            resumeAutoRefresh: function () {
                  $$.dispatcher.startRefresh(this);
            },
    
            refresh: function () {
                this.fetch();
            }
    
        }));
    };

    if (typeof context.define === 'function'
        && context.define.amd
        && !context._$$_backstrap_built_flag
    ) {
        context.define('backstrap/' + moduleName, requirements, fn);
    } else if (typeof context.module === 'object'
        && typeof context.module.exports === 'object'
    ) {
        context.module.exports = fn.call(requirements.map(
            function (reqName)
            {
                return require(reqName);
            }
        ));
    } else {
        if (typeof context.$$ !== 'function') {
            throw new Error('Backstrap not loaded');
        }
        if (typeof context.Backbone.Collection !== 'function') {
            throw new Error('Backbone not loaded');
        }
        fn(context.$$, context.Backbone);
    }
}(this, 'Collection', [ 'backstrap', 'backbone', 'backstrap/dispatcher' ]));

/**
 * A generic Backbone View for displaying Collection data.
 * Based on Backbone-UI CollectionView.
 *
 * The view will start listening to add/remove/change events
 * on the Collection when it receives an 'attach' event,
 * and will suspend listening when it receives a 'detach' event.
 * 
 * @author Kevin Perry, perry@princeton.edu
 * @license MIT
 */
(function (context, moduleName, requirements)
{
    var fn = function ($$)
    {
        /*
         * Render an item for the given model, at the given index.
         */
        var renderItem = function (model, index) {
            var content = null;
            if (_(this.options.itemView).exists()) {
                if (_(this.options.itemView).isString()) {
                    content = this.resolveContent(model, this.options.itemView);
                } else {
                    var view = new this.options.itemView(
                        _({ model: model, parentView: this }).extend(
                            this.options.itemViewOptions));
                    view.render();
                    this.itemViews[model.cid] = view;
                    content = view.el;
                }
            }

            // Bind the item click callback if given.
            if (this.options.onItemClick) {
                $(content).click(_(this.options.onItemClick).bind(this, model));
            }

            this.placeItem(content, model, index);
        };

        /*
         * Set up model change listeners.
         */
        var listenToModel = function (model, onOff) {
            if (model) {
                var actions = {
                    add:    onItemAdded,
                    remove: onItemRemoved,
                    reset:  this.render
                };

                if (this.options.renderOnChange) {
                    var props = this.options.renderOnChange;
                    if (props === true) {
                        actions.change = onItemChanged;
                    } else {
                        (_.isArray(props) ? props : [props]).forEach(function (prop) {
                            this['change:' + prop] = onItemChanged;
                        }, actions);
                    }
                }  

                (onOff ? model.on : model.off).call(model, actions, this);
            }
        };

        var onItemAdded = function (model, list, options) {
            // First, ensure that we haven't already rendered an item for this model.
            if (this.itemViews[model.cid]) {
                return;
            }

            // Remove empty content if it exists.
            if (this._emptyContent) {
                if (this._emptyContent.parentNode) this._emptyContent.parentNode.removeChild(this._emptyContent);
                this._emptyContent = null;
            }
   
            // Render the new item.
            renderItem.call(this, model, list.indexOf(model));
            
            if (_.isFunction(this.onItemAdded)) {
                this.onItemAdded(model, list, options);
            }
        };

        var onItemChanged = function (model, options) {
            var view = this.itemViews[model.cid];
            // Re-render the individual item view if it's a backbone view.
            if (view && view.el && view.el.parentNode) {
                view.render();
            } else { // Otherwise, we re-render the entire collection.
                this.render();
            }

            if (_.isFunction(this.onItemChanged)) {
                this.onItemChanged(model, options);
            }
        };

        var onItemRemoved = function (model, list, options) {
            var view = this.itemViews[model.cid];
            if (view) {
                var liOrTrElement = view.el.parentNode;
                if (liOrTrElement && liOrTrElement.parentNode) {
                    liOrTrElement.parentNode.removeChild(liOrTrElement);
                }
                delete(this.itemViews[model.cid]);
            }
            if (this.itemViews.length === 0) {
                // Need to render the empty content.
                this.render();
            }

            if (_.isFunction(this.onItemRemoved)) {
                this.onItemRemoved(model, list, options);
            }
        };
        
        return ($$[moduleName] = $$.View.extend({
            options: {
                // The Collection instance the view is bound to.
                model: null,

                // The View class responsible for rendering a single item 
                // in the collection. For simple use cases, you can pass a String instead 
                // which will be interpreted as the property of the model to display.
                itemView: null,
      
                // Options to pass into the View responsible for rendering the single item.
                itemViewOptions: {},

                // A string, element, or function describing what should be displayed
                // when the list is empty.
                emptyContent: null,

                // A callback to invoke when a row is clicked.  The associated model will be
                // passed as the first argument.
                onItemClick: function () {},

                // The maximum height in pixels that this table show grow to.  If the
                // content exceeds this height, it will become scrollable.
                maxHeight: null,
      
                // Render the the collection view on change in model.
                renderOnChange: true,
                
                // Whether to start listening to model events immediately or wait for 'attach'.
                attached: true,
                
                // Set this to true to generate first, last, even, and odd classnames on rows.
                generateRowClassNames: false
            },

            itemViews: {},

            _emptyContent: null,

            initialize: function (options) {
                $$.View.prototype.initialize.call(this, options);
                this.on('attach', _(listenToModel).bind(this, this.model, true));
                this.on('detach', _(listenToModel).bind(this, this.model, false));
                if (this.options.attached) {
                    listenToModel.call(this, this.model, true);
                }
            },

            render: function () {
                this.$el.empty();
                this.itemViews = {};

                if (this.options.emptyContent) {
                    this._emptyContent = _(this.options.emptyContent).isFunction() ? 
                        this.options.emptyContent() : this.options.emptyContent;
                }

                if (_(this.model).exists() && this.model.length > 0) {
                    _(this.model.models).each(renderItem, this);
                } else {
                    this.placeEmpty(this._emptyContent);
                }

                return this;
            },
            
            /**
             * Render first, last, even and odd classnames on row items.
             */
            renderClassNames: function (collectionEl) {
                if (this.options.generateRowClassNames) {
                    var children = (collectionEl ? collectionEl : this.el).childNodes;
                    if (children.length > 0) {
                        _(children).each(
                            function (child, index)
                            {
                                $(child).removeClass('first last')
                                        .addClass(index % 2 === 0 ? 'even' : 'odd');
                            });
                        $(children[0]).addClass('first');
                        $(children[children.length - 1]).addClass('last');
                    }
                }
            },

            /**
             * Place an individual item's view on the page.
             * 
             * Extensions of CollectionView may wish to override this method
             * to define how an item is put into the DOM.
             */
            placeItem: function (itemElement, model, index) {
                this.$el.append(itemElement);
            },
            
            /**
             * Place the "empty" content, if any, on the page.
             * 
             * Extensions of CollectionView may wish to override this method.
             */
            placeEmpty: function (emptyContent) {    
                // Render the empty content.
                if (emptyContent) {
                    this.$el.append(emptyContent);
                }
            }
        }));
    };

    if (typeof context.define === 'function'
        && context.define.amd
        && !context._$$_backstrap_built_flag
    ) {
        context.define('backstrap/' + moduleName, requirements, fn);
    } else if (typeof context.module === 'object'
        && typeof context.module.exports === 'object'
    ) {
        context.module.exports = fn.call(requirements.map(
            function (reqName)
            {
                return require(reqName);
            }
        ));
    } else {
        if (typeof context.$$ !== 'function') {
            throw new Error('Backstrap not loaded');
        }
        fn(context.$$);
    }
}(this, 'CollectionView', [ 'backstrap', 'backstrap/View' ]));

/**
 * A mixin for dealing with collection alternatives.
 * Based on Backbone-UI.
 * 
 * @author Kevin Perry perry@princeton.edu
 * @license MIT
 */
(function(context, moduleName, requirements)
{
    var fn = function($$)
    {
        return($$[moduleName] = {
            options : {
                // The collection of items representing alternative choices
                alternatives : null,

                // The property of the individual choice represent the the label to be displayed
                altLabelContent : null,

                // The property of the individual choice that represents the value to be stored
                // in the bound model's property. Omit this option if you'd like the choice 
                // object itself to represent the value.
                altValueContent : null,
                
                // The property of the individual choice representing CSS 
                // background rule for the left glyph 
                altGlyphLeftClassName : null,

                // The property of the individual choice representing CSS 
                // background rule for the right glyph 
                altGlyphRightClassName : null
            },

            _determineSelectedItem : function() {
                var item = null;

                // if a bound property has been given, we attempt to resolve it
                if(_(this.model).exists() && _(this.options.content).exists()) {
                    item = _(this.model).resolveProperty(this.options.content);

                    // if a value property is given, we further resolve our selected item
                    if(_(this.options.altValueContent).exists()) {
                        var otherItem = _(this._collectionArray()).detect(function(collectionItem) {
                            return (collectionItem.attributes || collectionItem)[this.options.altValueContent] === item;
                        }, this);
                        if(!_(otherItem).isUndefined()) item = otherItem;
                    }
                }

                return item || this.options.selectedItem;
            },

            _setSelectedItem : function(item, silent) {
                this.selectedValue = item;
                this.selectedItem = item;

                if(_(this.model).exists() && _(this.options.content).exists()) {
                    this.selectedValue = this._valueForItem(item);
                    _(this.model).setProperty(this.options.content, this.selectedValue, silent);
                }
            },

            _valueForItem : function(item) {
                return _(this.options.altValueContent).exists() ? 
                    _(item).resolveProperty(this.options.altValueContent) :
                    item;
            },

            _collectionArray : function() {
                return _(this.options.alternatives).exists() ?
                    this.options.alternatives.models || this.options.alternatives : [];
            },

            _observeCollection : function(callback) {
                if(_(this.options.alternatives).exists() && _(this.options.alternatives.bind).exists()) {
                    var key = 'change';
                    this.options.alternatives.unbind(key, callback);
                    this.options.alternatives.bind(key, callback);
                }
            }
        });
    };

    if (typeof context.define === 'function'
        && context.define.amd
        && !context._$$_backstrap_built_flag
    ) {
        context.define('backstrap/' + moduleName, requirements, fn);
    } else if (typeof context.module === 'object'
        && typeof context.module.exports === 'object'
    ) {
        context.module.exports = fn.call(requirements.map(
            function (reqName)
            {
                return require(reqName);
            }
        ));
    } else {
        if (typeof context.$$ !== 'function') {
            throw new Error('Backstrap not loaded');
        }
        fn(context.$$);
    }
}(this, 'HasAlternativeProperty', [ 'backstrap' ]));

/**
 * A mixin for dealing with errors in widgets 
 *
 * @author Kevin Perry perry@princeton.edu
 * @license MIT
 */
(function(context, moduleName, requirements)
{
    var fn = function($$)
    {
        return ($$[moduleName] = {
            options : {
                // Can be inserted into the flow of the form as the type 'inform' or as
                // a flyover disclosing the error message as the type 'disclosure'
                errorType : 'inform',
                // Where the error message will be displayed.
                // Possible positions: 'right', 'below'
                errorPosition : 'below'
            },
            
            unsetError : function() {
                // remove error class
                $(this.el).removeClass('error');
                // remove error message if it exists
                $(this.errorMessage).remove();
                // remove disclosure if it exists
                $(this._disclosure).remove();     
                // remove event attached to the model regarding errors     
                if(_(this._unobserveModel).exists()) {
                    this._unobserveModel(_(this.unsetError).bind(this));
                }
            },
            
            setError : function(message) {
                
                // add event to model to unset error when on change
                if(_(this._observeModel).exists()) {
                    this._observeModel(_(this.unsetError).bind(this));
                }
                 
                // message will default to empty string
                message = (message === null || _(message).isUndefined()) ? "" : message;
                // clear existing error
                this.unsetError();
                // add error class
                $(this.el).addClass('error');
                
                // add error message if provided
                if(message.length > 0) {
                    
                    if(this.options.errorType !== "disclosure") {
                        this.errorMessage = $$.span({className : 'error_message ' + 
                            this.options.errorPosition}, message);
                    }
                    else {
                        this.errorMessage = $$.span({className : 'error_message right with_disclosure'}, "!");
                        
                        this._disclosure = $$.div({className : 'disclosure'},
                            this._disclosureOuter = $$.div({className: 'disclosure_outer'},
                                this._disclosureInner = $$.div({className: 'disclosure_inner'}, message),
                                    this._disclosureArrow = $$.div({className: 'disclosure_arrow'})));
                        
                        $(this.errorMessage).click(_(function(e) {
                            e.preventDefault();
                            this._showDisclosure();
                            return false;
                        }).bind(this));
                        
                        $(this.el).click(_(function() {
                            $(this._disclosure).remove();
                        }).bind(this));
                        
                    }
                    
                    this.el.childNodes[0].appendChild(this.errorMessage);
                    
                    if(this._disclosure) {
                        this._showDisclosure();
                    }
                    
                }
                
            },
            
            _showDisclosure : function(){
                // add the disclosure
                this.el.appendChild(this._disclosure);
                // set the position
                this.options.errorPosition === 'right' ? 
                    $(this._disclosure).alignTo(this.errorMessage, 'right', 10, 0, this.el) : 
                    $(this._disclosure).alignTo(this.errorMessage, 'center bottom', 0, 10, this.el);

                // add the appropriate class to disclosure arrow for correct sprite and styles
                $(this._disclosureOuter).addClass(this.options.errorPosition === 'right' ? 'arrow_left' : 'arrow_up');
                // set the disclosure arrow position
                var pos = this.options.errorPosition === 'right' ? (($(this._disclosure).height() / 2) - 10) : 
                    (($(this._disclosure).width() / 2) - 10);
                var cssTopOrLeft = this.options.errorPosition === 'right' ? 'top' : 'left';    
                $(this._disclosureArrow).css(cssTopOrLeft, pos + 'px');
            }
        });
    };

    if (typeof context.define === 'function'
        && context.define.amd
        && !context._$$_backstrap_built_flag
    ) {
        context.define('backstrap/' + moduleName, requirements, fn);
    } else if (typeof context.module === 'object'
        && typeof context.module.exports === 'object'
    ) {
        context.module.exports = fn.call(requirements.map(
            function (reqName)
            {
                return require(reqName);
            }
        ));
    } else {
        if (typeof context.$$ !== 'function') {
            throw new Error('Backstrap not loaded');
        }
        fn(context.$$);
    }
}(this, 'HasError', [ 'backstrap' ]));

/**
 * A mixin for dealing with focus in / focus out
 *
 * @author Kevin Perry perry@princeton.edu
 * @license MIT
 */
(function(context, moduleName, requirements)
{
    var fn = function($$)
    {
        return ($$[moduleName] = {
            setupFocus : function(el, parent) {
            
                // add focusin 
                $(el).focusin(_(function(e) {
                    $(parent).addClass('focused');
                }).bind(this));

                // add focusout
                $(el).focusout(_(function(e) {
                    $(parent).removeClass('focused');
                }).bind(this));
                
            }
        });
    };

    if (typeof context.define === 'function'
        && context.define.amd
        && !context._$$_backstrap_built_flag
    ) {
        context.define('backstrap/' + moduleName, requirements, fn);
    } else if (typeof context.module === 'object'
        && typeof context.module.exports === 'object'
    ) {
        context.module.exports = fn.call(requirements.map(
            function (reqName)
            {
                return require(reqName);
            }
        ));
    } else {
        if (typeof context.$$ !== 'function') {
            throw new Error('Backstrap not loaded');
        }
        fn(context.$$);
    }
}(this, 'HasFocus', [ 'backstrap' ]));

/**
 * A mixin for dealing with glyphs in widgets.
 * 
 * @author Kevin Perry perry@princeton.edu
 */
(function(context, moduleName, requirements)
{
    var fn = function($$)
    {
        return($$[moduleName] = {
            options: {
                // If provided this content will wrap the component with additional label.
                formLabelContent : null
            },

            wrapWithFormLabel : function(content) {
                var wrapped = $$.plain.label({'for': this.options.name});
                
                var formLabelText = this.options.formLabelContent ? 
                    this.resolveContent(this.model, this.options.formLabelContent, 
                        this.options.formLabelContent) || this.options.formLabelContent : null;
                if(formLabelText) {
                    wrapped.appendChild($$.span({className : 'form_label'}, formLabelText));
                }
                wrapped.appendChild(content);
                return wrapped;    
            }    
        });
    };

    if (typeof context.define === 'function'
        && context.define.amd
        && !context._$$_backstrap_built_flag
    ) {
        context.define('backstrap/' + moduleName, requirements, fn);
    } else if (typeof context.module === 'object'
        && typeof context.module.exports === 'object'
    ) {
        context.module.exports = fn.call(requirements.map(
            function (reqName)
            {
                return require(reqName);
            }
        ));
    } else {
        if (typeof context.$$ !== 'function') {
            throw new Error('Backstrap not loaded');
        }
        fn(context.$$);
    }
}(this, 'HasFormLabel', [ 'backstrap' ]));

/**
 * A mixin for dealing with glyphs in widgets 
 *
 * @author Kevin Perry perry@princeton.edu
 * @license MIT
 */
(function(context, moduleName, requirements)
{
    var fn = function($$)
    {
        return ($$[moduleName] = {
            insertGlyphLayout : function(glyphLeftClassName, glyphRightClassName, content, parent) {

                // append left glyph
                if(glyphLeftClassName) {
                    var glyphLeft = $$.span({
                        className : 'glyph left ' + glyphLeftClassName
                    });
                    parent.appendChild(glyphLeft);
                    $(parent).addClass('hasGlyphLeft');
                }

                // append content
                if(content) {
                    parent.appendChild(content);
                }

                // append right glyph
                if(glyphRightClassName) {
                    var glyphRight = $$.span({
                        className : 'glyph right ' + glyphRightClassName
                    });
                    parent.appendChild(glyphRight);
                    $(parent).addClass('hasGlyphRight');
                }
             
            },

            resolveGlyph : function(model, content) {
                if(content === null) return null;
                var glyph = null;
                if(_(model).exists() && _((model.attributes || model)[content]).exists()) {
                    glyph = this.resolveContent(model, content);
                }
                return _(glyph).exists() ? glyph : content;
            }
        });
    };

    if (typeof context.define === 'function'
        && context.define.amd
        && !context._$$_backstrap_built_flag
    ) {
        context.define('backstrap/' + moduleName, requirements, fn);
    } else if (typeof context.module === 'object'
        && typeof context.module.exports === 'object'
    ) {
        context.module.exports = fn.call(requirements.map(
            function (reqName)
            {
                return require(reqName);
            }
        ));
    } else {
        if (typeof context.$$ !== 'function') {
            throw new Error('Backstrap not loaded');
        }
        fn(context.$$);
    }
}(this, 'HasGlyph', [ 'backstrap' ]));

/**
 * A mixin for those views that are model bound.
 *
 * @author Kevin Perry perry@princeton.edu
 */
(function(context, moduleName, requirements)
{
    var fn = function($$)
    {
        return($$[moduleName] = {
            options : {
                // The Model instance the view is bound to.
                model : null,

                // The property of the bound model this component should render / update.
                // If a function is given, it will be invoked with the model and will 
                // expect an element to be returned.    If no model is present, this 
                // property may be a string or function describing the content to be rendered.
                content : null,

                // If provided this content will wrap the component with additional label.
                // The text displayed by the label is determined the same way the content attribute.
                // For Checkbox and Label.
                labelContent : null,

                // If present, a square glyph area will be added to the left side of this 
                // component, and the given string will be used as the class name
                // property of that glyph area. This option is a no-op when applied 
                // to Calender and Menu components. 
                glyphLeftClassName : null,

                // Same as above, but on the right side.
                glyphRightClassName : null

            },

            _observeModel : function(callback) {
                if(_(this.model).exists() && _(this.model.off).isFunction()) {
                    _(['content', 'labelContent']).each(function(prop) {
                        var key = this.options[prop];
                        if(_(key).exists()) {
                            key = 'change:' + key;
                            this.model.off(key, callback);
                            this.model.on(key, callback);
                        }
                    }, this);
                }
            },

            _unobserveModel : function(callback) {
                if(_(this.model).exists() && _(this.model.off).isFunction()) {
                    _(['content', 'labelContent']).each(function(prop) {
                        var key = this.options[prop];
                        if(_(key).exists()) {
                            key = 'change:' + key;
                            this.model.off(key, callback);
                        }
                    }, this);
                }
            }

        });
    };

    if (typeof context.define === 'function'
        && context.define.amd
        && !context._$$_backstrap_built_flag
    ) {
        context.define('backstrap/' + moduleName, requirements, fn);
    } else if (typeof context.module === 'object'
        && typeof context.module.exports === 'object'
    ) {
        context.module.exports = fn.call(requirements.map(
            function (reqName)
            {
                return require(reqName);
            }
        ));
    } else {
        if (typeof context.$$ !== 'function') {
            throw new Error('Backstrap not loaded');
        }
        fn(context.$$);
    }
}(this, 'HasModel', [ 'backstrap' ]));

/**
 * A Backbone View that displays a model-bound list.
 * Based on Backbone-UI's ListView,
 * with Bootstrap decoration.
 * 
 * @author Kevin Perry perry@princeton.edu
 * @license MIT
 */
(function (context, moduleName, requirements)
{
    var fn = function ($$)
    {
        var ensureProperPosition = function (model) {
            if (this.model.comparator) {
                this.model.sort({silent: true});
                var view = this.itemViews[model.cid];
                if (view) {
                    var itemEl = this.itemViews[model.cid].el.parentNode;
                    var currentIndex = _(this.collectionEl.childNodes).indexOf(itemEl, true);
                    var properIndex = this.model.indexOf(model);
                    if (currentIndex !== properIndex) {
                        itemEl.parentNode.removeChild(itemEl);
                        var refNode = this.collectionEl.childNodes[properIndex];
                        if (refNode) {
                            this.collectionEl.insertBefore(itemEl, refNode);
                        } else {
                            this.collectionEl.appendChild(itemEl);
                        }
                    }
                }
            }
        };
	
        var ensureProperPositions = function (collection) {
            collection.models.forEach(function (model, index) {
                if (this.itemViews[model.cid]) {
                    var itemEl = this.itemViews[model.cid].el.parentNode;
                    itemEl.parentNode.removeChild(itemEl);
                    var refNode = this.collectionEl.childNodes[index];
                    if (refNode) {
                        this.collectionEl.insertBefore(itemEl, refNode);
                    } else {
                        this.collectionEl.appendChild(itemEl);
                    }
                }
            }, this);
            this.renderClassNames(this.collectionEl);
        };
        
        var listenToSort = function (model, onOff) {
            if (model) {
                (onOff ? model.on : model.off).call(model, 'sort', ensureProperPositions, this);
            }
        };

        return ($$[moduleName] = $$.CollectionView.extend({
            initialize: function (options) {
                $$.CollectionView.prototype.initialize.call(this, options);

                $(this.el).addClass('list');
                this.collectionEl = $$.ul({className: 'list-group'});

                this.on('attach', _(listenToSort).bind(this, this.model, true));
                this.on('detach', _(listenToSort).bind(this, this.model, false));
                if (this.options.attached) {
                    listenToSort.call(this, this.model, true);
                }
            },

            render: function () {
                $(this.collectionEl).empty();

                $$.CollectionView.prototype.render.call(this);

                this.renderClassNames(this.collectionEl);
                this.$el.append(this.collectionEl);

                return this;
            },

            // Renders an item for the given model, at the given index.
            placeItem: function (content, model, index) {
                this.collectionEl.appendChild($$.li({className: 'list-group-item'}, content));
            },

            placeEmpty: function (content) {
                this.collectionEl.appendChild($$.li({className: 'list-group-item'}, content));
            },

            onItemAdded: function () {
                this.renderClassNames(this.collectionEl);
            },

            onItemRemoved: function () {
                this.renderClassNames(this.collectionEl);
            },

            onItemChanged: function (model) {
                ensureProperPosition.call(this, model);
            }
        }));
    };

    if (typeof context.define === 'function'
        && context.define.amd
        && !context._$$_backstrap_built_flag
    ) {
        context.define('backstrap/' + moduleName, requirements, fn);
    } else if (typeof context.module === 'object'
        && typeof context.module.exports === 'object'
    ) {
        context.module.exports = fn.call(requirements.map(
            function (reqName)
            {
                return require(reqName);
            }
        ));
    } else {
        if (typeof context.$$ !== 'function') {
            throw new Error('Backstrap not loaded');
        }
        fn(context.$$);
    }
}(this, 'List', [ 'backstrap', 'backstrap/CollectionView' ]));

/**
 * A model-bound Bootstrap badge object.
 *
 * Use model and content options to set the content of the badge.
 * 
 * @author Kevin Perry perry@princeton.edu
 * @license MIT
 * 
 */
(function(context, moduleName, requirements)
{
    var fn = function($$)
    {
        return ($$[moduleName] = $$.View.extend({
            tagName: 'span',
    
            initialize : function(options) {
                $$.View.prototype.initialize.call(this, options);
                this.mixin([$$.HasModel]);
                _(this).bindAll('render');
                this.$el.addClass('badge');
            },
    
            render : function() {
                var content = this.resolveContent();
                this._observeModel(this.render);
                this.$el.text(content);
                return this;
            }
        }));
    };

    if (typeof context.define === 'function'
        && context.define.amd
        && !context._$$_backstrap_built_flag
    ) {
        context.define('backstrap/' + moduleName, requirements, fn);
    } else if (typeof context.module === 'object'
        && typeof context.module.exports === 'object'
    ) {
        context.module.exports = fn.call(requirements.map(
            function (reqName)
            {
                return require(reqName);
            }
        ));
    } else {
        if (typeof context.$$ !== 'function') {
            throw new Error('Backstrap not loaded');
        }
        fn(context.$$);
    }
}(this, 'Badge', [ 'backstrap', 'backstrap/View', 'backstrap/HasModel' ]));

/**
 * A basic model-bound Bootstrap navbar object.
 * 
 * @author Kevin Perry perry@princeton.edu
 * @license MIT
 */
(function(context, moduleName, requirements)
{
    var fn = function($$)
    {
        var ItemView = $$.View.extend({
            tagName: 'a',
            className: 'nav-item',
            
            render: function render() {
                this.$el.addClass('nav-item-' + this.model.get('name'))
                    .attr('href', this.model.get('href'))
                    .text(this.model.get('label'));
                return this;
            }
        });

        var NavList = $$.CollectionView.extend({
            className: 'navbar-collapse collapse',
            
            initialize : function(options) {
                $$.CollectionView.prototype.initialize.call(this, options);
                $(this.el).addClass('list');
                _(this).bindAll('render');
            },
            
            render : function() {
                $(this.el).empty();
                this.itemViews = {};

                this.collectionEl = $$.ul({className: 'nav navbar-nav'});

                // if the collection is empty, we render the empty content
              if((!_(this.model).exists()  || this.model.length === 0) && this.options.emptyContent) {
                this._emptyContent = _(this.options.emptyContent).isFunction() ? 
                  this.options.emptyContent() : this.options.emptyContent;
                this._emptyContent = $$.li(this._emptyContent);

                if(!!this._emptyContent) {
                  this.collectionEl.appendChild(this._emptyContent);
                }
              }

              // otherwise, we render each row
              else {
                _(this.model.models).each(function(model, index) {
                  var item = this._renderItem(model, index);
                  this.collectionEl.appendChild(item);
                }, this);
              }

              this.el.appendChild(this.collectionEl);
              this.renderClassNames(this.collectionEl);

              return this;
            },

            // renders an item for the given model, at the given index
            _renderItem : function(model, index) {
              var content = null;
              if(_(this.options.itemView).exists()) {

                if(_(this.options.itemView).isString()) {
                  content = this.resolveContent(model, this.options.itemView);
                }

                else {
                  var view = new this.options.itemView(_({ model : model }).extend(
                    this.options.itemViewOptions));
                  view.render();
                  this.itemViews[model.cid] = view;
                  content = view.el;
                }
              }

              var item = $$.li(content);

              // bind the item click callback if given
              if(this.options.onItemClick) {
                $(item).click(_(this.options.onItemClick).bind(this, model));
              }

              return item;
            }
        });
    
        return ($$[moduleName] = $$.View.extend({
            className: 'navbar navbar-default',
            brand: '',
    
            initialize: function (options) {
                $$.View.prototype.initialize.apply(this, arguments);
                if ('navbarType' in options) {
                    this.$el.addClass('navbar-'+options.navbarType);
                }
                if ('brand' in options) {
                    this.brand = options.brand;
                }
                this.navList = new NavList({ model: options.model, itemView: ItemView });
            },
    
            render: function () {
                this.$el.empty();
                this.$el.append(
                    $$.div({ className: 'container' },
                        $$.div({ className: 'navbar-header' },
                            $$.button({
                                    type: 'button',
                                    className: 'navbar-toggle',
                                    'data-toggle': 'collapse',
                                    'data-target': '.navbar-collapse'
                                },
                                $$.span({ className: 'sr-only' }, 'Toggle navigation'),
                                $$.span({ className: 'icon-bar' }),
                                $$.span({ className: 'icon-bar' }),
                                $$.span({ className: 'icon-bar' })
                            ),
                            $$.a({ className: 'navbar-brand', href: '#' }, this.brand)
                        ),
                        this.navList.render().el
                    )
                ).attr('role', 'navigation');
                return this;
            }
        }));
    };

    if (typeof context.define === 'function'
        && context.define.amd
        && !context._$$_backstrap_built_flag
    ) {
        context.define('backstrap/' + moduleName, requirements, fn);
    } else if (typeof context.module === 'object'
        && typeof context.module.exports === 'object'
    ) {
        context.module.exports = fn.call(requirements.map(
            function (reqName)
            {
                return require(reqName);
            }
        ));
    } else {
        if (typeof context.$$ !== 'function') {
            throw new Error('Backstrap not loaded');
        }
        fn(context.$$);
    }
}(this, 'BasicNavbar', [ 'backstrap', 'backstrap/CollectionView' ]));

/**
 * A Backbone View that displays a model-bound button.
 * Largely from Backbone-UI's Button class,
 * with Bootstrap decoration.
 * 
 * @author Kevin Perry perry@princeton.edu
 * @license MIT
 */
(function(context, moduleName, requirements)
{
    var fn = function($$)
    {
        return ($$[moduleName] = $$.View.extend({
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
                $$.View.prototype.initialize.call(this, options);
                this.mixin([$$.HasModel, $$.HasGlyph]);
                _(this).bindAll('render');

                this.$el.addClass('button btn btn-' + $$._mapSize(this.options.size));
                if (this.options.size !== this.options.context) {
                    this.$el.addClass(' btn-' + this.options.context);
                }

                this.$el.bind('click', _(function(e) {
                    return (this.options.disabled || this.options.active) ? false :
                        (this.options.onClick ? this.options.onClick(e) : true);
                }).bind(this));
            },

            render : function() {
                var labelText = this.resolveContent();

                this._observeModel(this.render);

                this.$el.empty();

                if(this.options.isSubmit) {
                    this.$el.attr({
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
                this.$el.toggleClass('disabled', !enabled);
                this.$el.attr({'disabled' : !enabled});
            },

            // sets the active state of the button
            setActive : function(active) {
                this.options.active = active;
                this.$el.toggleClass('active', active);
            }
        }));
    };

    if (typeof context.define === 'function'
        && context.define.amd
        && !context._$$_backstrap_built_flag
    ) {
        context.define('backstrap/' + moduleName, requirements, fn);
    } else if (typeof context.module === 'object'
        && typeof context.module.exports === 'object'
    ) {
        context.module.exports = fn.call(requirements.map(
            function (reqName)
            {
                return require(reqName);
            }
        ));
    } else {
        if (typeof context.$$ !== 'function') {
            throw new Error('Backstrap not loaded');
        }
        fn(context.$$);
    }
}(this, 'Button', [
    'backstrap',
    'backstrap/View',
    'backstrap/HasModel',
    'backstrap/HasGlyph'
]));

/**
 * A Backbone View that displays a model-bound calendar.
 * Largely from Backbone-UI's Calendar class,
 * with Bootstrap decoration.
 * 
 * @author Kevin Perry perry@princeton.edu
 * @license MIT
 */
(function(context, moduleName, requirements)
{
    var fn = function($$, moment)
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

        return ($$[moduleName] = $$.View.extend({
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
                $$.View.prototype.initialize.call(this, options);
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

    if (typeof context.define === 'function'
        && context.define.amd
        && !context._$$_backstrap_built_flag
    ) {
        context.define('backstrap/' + moduleName, requirements, fn);
    } else if (typeof context.module === 'object'
        && typeof context.module.exports === 'object'
    ) {
        context.module.exports = fn.call(requirements.map(
            function (reqName)
            {
                return require(reqName);
            }
        ));
    } else {
        if (typeof context.$$ !== 'function') {
            throw new Error('Backstrap not loaded');
        }
        if (typeof context.moment !== 'function') {
            throw new Error('Moment not loaded');
        }
        fn(context.$$, context.moment);
    }
}(this, 'Calendar', [ 'backstrap', 'moment', 'backstrap/View' ]));

/**
 * A Backbone View that displays a model-bound checkbox.
 * Largely from Backbone-UI's Checkbox class,
 * with Bootstrap decoration.
 * 
 * @author Kevin Perry perry@princeton.edu
 * @license MIT
 */
(function(context, moduleName, requirements)
{
    var fn = function($$)
    {
        return ($$[moduleName] = $$.View.extend({
            options : {
                // The property of the model describing the label that 
                // should be placed next to the checkbox
                labelContent : null,

                disabled : false
            },

            initialize : function(options) {
                $$.View.prototype.initialize.call(this, options);
                this.mixin([$$.HasModel, $$.HasGlyph, $$.HasError]);
                _(this).bindAll('_refreshCheck');
                this.$el.addClass('checkbox');
                if(this.options.name){
                    this.$el.addClass(this.options.name);
                }
                this.label = $$.plain.label();
                this.input = $$.plain.input({type : 'checkbox'});
                $(this.input).change(_(this._updateModel).bind(this));
                $(this.input).click(_(this._updateModel).bind(this));
                this._observeModel(_(this._refreshCheck).bind(this));
            },

            render : function() {
                this.$el.empty();
                $(this.label).empty();

                $(this.input).off('change');
                $(this.input).off('click');

                var value = this.resolveContent() !== null ? 
                    this.resolveContent() : this.input.checked;

                $(this.input).attr({
                    name : this.options.name,
                    id : this.options.name,
                    tabIndex : this.options.tabIndex,
                    checked : value,
                    disabled : this.options.disabled
                });

                var labelText = this.resolveContent(this.model, this.options.labelContent) || this.options.labelContent;

                this.label.appendChild(this.input);
                this._labelText = $$.span(labelText);

                var parent = $$.div({className : 'checkbox_wrapper'});
                var content = this._labelText;
                var glyphLeftClassName = this.resolveGlyph(this.model, this.options.glyphLeftClassName);
                var glyphRightClassName = this.resolveGlyph(this.model, this.options.glyphRightClassName);
                this.insertGlyphLayout(glyphLeftClassName, glyphRightClassName, content, parent);

                this.label.appendChild(parent);
                this.el.appendChild(this.label);

                this.setEnabled(!this.options.disabled);

                $(this.input).on('change', _(this._updateModel).bind(this));
                $(this.input).on('click', _(this._updateModel).bind(this));

                return this;
            },

            _refreshCheck : function() {

                var value = this.resolveContent();

                $(this.input).attr({ checked : value });

                var labelText = this.resolveContent(this.model, this.options.labelContent) || this.options.labelContent;
                $(this._labelText).text(labelText);

            },

            _updateModel : function() {
                _(this.model).setProperty(this.options.content, this.input.checked);
            },

            // sets the enabled state
            setEnabled : function(enabled) {
                if(enabled) { 
                    this.$el.removeClass('disabled');
                } else {
                    this.$el.addClass('disabled');
                }
                this.input.disabled = !enabled;
            }

        }));
    };

    if (typeof context.define === 'function'
        && context.define.amd
        && !context._$$_backstrap_built_flag
    ) {
        context.define('backstrap/' + moduleName, requirements, fn);
    } else if (typeof context.module === 'object'
        && typeof context.module.exports === 'object'
    ) {
        context.module.exports = fn.call(requirements.map(
            function (reqName)
            {
                return require(reqName);
            }
        ));
    } else {
        if (typeof context.$$ !== 'function') {
            throw new Error('Backstrap not loaded');
        }
        fn(context.$$);
    }
}(this, 'Checkbox', [
    'backstrap',
    'backstrap/HasError',
    'backstrap/HasGlyph',
    'backstrap/HasModel',
    'backstrap/View'
]));

/**
 * A Backbone View that displays a Bootstrap contextually-colored span or other tag;
 * context name bound to model data.
 * 
 * @author Kevin Perry perry@princeton.edu
 * @license MIT
 */
(function(context, moduleName, requirements)
{
    var fn = function($$)
    {
        return ($$[moduleName] = $$.View.extend({
            options : {
                tagName: 'span',
                content: 'context',
                background: false
            },
    
            initialize : function(options) {
                $$.View.prototype.initialize.call(this, options);
                this.mixin([$$.HasModel]);
                _(this).bindAll('render');
                this.prefix = this.options.background ? 'bg-' : 'text-';
            },
    
            render : function() {
                var contextName = this.resolveContent(this.options.model, this.options.contentMap);
                this._observeModel(this.render);
                this.$el.removeClass(this.prefix + this.context).addClass(this.prefix + contextName);
                return this;
            }
        }));
    };

    if (typeof context.define === 'function'
        && context.define.amd
        && !context._$$_backstrap_built_flag
    ) {
        context.define('backstrap/' + moduleName, requirements, fn);
    } else if (typeof context.module === 'object'
        && typeof context.module.exports === 'object'
    ) {
        context.module.exports = fn.call(requirements.map(
            function (reqName)
            {
                return require(reqName);
            }
        ));
    } else {
        if (typeof context.$$ !== 'function') {
            throw new Error('Backstrap not loaded');
        }
        fn(context.$$);
    }
}(this, 'Context', [ 'backstrap', 'backstrap/View', 'backstrap/HasModel' ]));

/**
 * A Backbone View that displays a Bootstrap container div.
 * 
 * @author Kevin Perry perry@princeton.edu
 * @license MIT
 */
(function(context, moduleName, requirements)
{
    var fn = function($$)
    {
        return ($$[moduleName] = $$.View.extend({
            initialize : function(options) {
                $$.View.prototype.initialize.call(this, options);
                this.$el.addClass('container');
            }
        }));
    };

    if (typeof context.define === 'function'
        && context.define.amd
        && !context._$$_backstrap_built_flag
    ) {
        context.define('backstrap/' + moduleName, requirements, fn);
    } else if (typeof context.module === 'object'
        && typeof context.module.exports === 'object'
    ) {
        context.module.exports = fn.call(requirements.map(
            function (reqName)
            {
                return require(reqName);
            }
        ));
    } else {
        if (typeof context.$$ !== 'function') {
            throw new Error('Backstrap not loaded');
        }
        fn(context.$$);
    }
}(this, 'Container', [ 'backstrap', 'backstrap/View' ]));

/**
 * A Backbone View that displays a model-bound date picker.
 * Largely from Backbone-UI's DatePicker class,
 * with Bootstrap decoration.
 * 
 * Kevin Perry perry@princeton.edu
 * @license MIT
 */
(function(context, moduleName, requirements)
{
    var fn = function($$, moment)
    {
        var KEY_RETURN = 13;

        return ($$[moduleName] = $$.View.extend({

            options : {
                // a moment.js format : http://momentjs.com/docs/#/display/format
                format : 'MM/DD/YYYY',
                date : null,
                name : null,
                onChange : null,
                minDate : null,
                maxDate : null
            },

            initialize : function(options) {
                $$.View.prototype.initialize.call(this, options);
                this.mixin([$$.HasModel, $$.HasFormLabel, $$.HasError]);
                this.$el.addClass('date_picker');

                this._calendar = new $$.Calendar({
                    className : 'date_picker_calendar',
                    model : this.model,
                    content : this.options.content,
                    onSelect : _(this._selectDate).bind(this),
                    minDate : this.options.minDate,
                    maxDate : this.options.maxDate
                });
                $(this._calendar.el).hide();
                document.body.appendChild(this._calendar.el);

                $(this._calendar.el).autohide({
                    ignoreInputs : true,
                    leaveOpenTargets : [this._calendar.el]
                });

                // listen for model changes
                this._observeModel(_(this.render).bind(this));
            },

            render : function() {
                this.$el.empty();

                this._textField = new $$.TextField({
                    name : this.options.name,
                    placeholder : this.options.placeholder,
                    glyphLeftClassName : this.options.glyphLeftClassName,
                    glyphRightClassName : this.options.glyphRightClassName
                }).render();

                $(this._textField.input).click(_(this._showCalendar).bind(this));
                $(this._textField.input).blur(_(this._dateEdited).bind(this));
                $(this._textField.input).keyup(_(this._hideCalendar).bind(this));

                this.el.appendChild(this.wrapWithFormLabel(this._textField.el));

                this._selectedDate = (!!this.model && !!this.options.content) ? 
                    this.resolveContent() : this.options.date;

                if(!!this._selectedDate) {
                    this._calendar.options.date = this._selectedDate;
                    var dateString = moment(this._selectedDate).format(this.options.format);
                    this._textField.setValue(dateString);
                }
                this._calendar.render();

                return this;
            },

            setEnabled : function(enabled) {
                this._textField.setEnabled(enabled);
            },

            getValue : function() {
                return this._selectedDate;
            },

            setValue : function(date) {
                this._selectedDate = date;
                var dateString = moment(date).format(this.options.format);
                this._textField.setValue(dateString);
                this._dateEdited();
            },

            _showCalendar : function() {
                $(this._calendar.el).show();
                $(this._calendar.el).alignTo(this._textField.el, 'bottom -left');
                // TODO: First time, it mis-computes vertical position.
                $(this._calendar.el).alignTo(this._textField.el, 'bottom -left', 5, 2);
            },

            _hideCalendar : function(e) {
                if(e && e.keyCode === KEY_RETURN) this._dateEdited();
                $(this._calendar.el).hide();
            },

            _selectDate : function(date) {
                var month = date.getMonth() + 1;
                if(month < 10) month = '0' + month;

                var day = date.getDate();
                if(day < 10) day = '0' + day;

                var dateString = moment(date).format(this.options.format);
                this._textField.setValue(dateString);
                this._dateEdited();
                this._hideCalendar();

                return false;
            },

            _dateEdited : function(e) {

                var newDate = moment(this._textField.getValue(), this.options.format);
                this._selectedDate = newDate ? newDate.toDate() : null;

                // if the event is a blur, we need to make sure that the menu is not
                // open, otherwise we'll squash that selection event
                if(e && e.type === 'blur' && $(this._calendar.el).is(':visible')) return;

                // if the enter key was pressed or we've invoked this method manually, 
                // we hide the calendar and re-format our date
                if(!e || e.keyCode === KEY_RETURN || e.type === 'blur') {
                    var newValue = moment(newDate).format(this.options.format);
                    this._textField.setValue(newValue);
                    this._hideCalendar();

                    // update our bound model (but only the date portion)
                    if(!!this.model && this.options.content) {
                        var boundDate = this.resolveContent() || new Date();
                        var updatedDate = new Date(boundDate.getTime());
                        updatedDate.setMonth(newDate.month());
                        updatedDate.setDate(newDate.date());
                        updatedDate.setFullYear(newDate.year());
                        _(this.model).setProperty(this.options.content, updatedDate);
                    }
                    else {
                        this._calendar.date = this._selectedDate;
                        this._calendar.render();
                    }

                    if(_(this.options.onChange).isFunction()) {
                        this.options.onChange(newValue);
                    }
                }
            }
        }));
    };

    if (typeof context.define === 'function'
        && context.define.amd
        && !context._$$_backstrap_built_flag
    ) {
        context.define('backstrap/' + moduleName, requirements, fn);
    } else if (typeof context.module === 'object'
        && typeof context.module.exports === 'object'
    ) {
        context.module.exports = fn.call(requirements.map(
            function (reqName)
            {
                return require(reqName);
            }
        ));
    } else {
        if (typeof context.$$ !== 'function') {
            throw new Error('Backstrap not loaded');
        }
        if (typeof context.moment !== 'function') {
            throw new Error('Moment not loaded');
        }
        fn(context.$$, context.moment);
    }
}(this, 'DatePicker', [
    'backstrap',
    'moment',
    'backstrap/Calendar',
    'backstrap/HasError',
    'backstrap/HasFormLabel',
    'backstrap/HasModel',
    'backstrap/TextField',
    'backstrap/View'
]));

/**
 * A Backbone View that displays a model-bound dropdown list.
 * Largely from Backbone-UI's Pulldown class,
 * with Bootstrap decoration.
 * 
 * @author Kevin Perry perry@princeton.edu
 * @license MIT
 */
(function(context, moduleName, requirements)
{
    var fn = function($$)
    {
        var ItemView = $$.View.extend({
            tagName: function () {
                var elem = this.model.get('element');
                return (elem === 'divider' || elem === 'separator' || elem === 'header') ? 'span' : 'a';
            },
    
            initialize: function render() {
                var elem = this.model.get('element');
                if (elem === 'header') {
                    this.$el.text(this.model.get('label'));
                } else  if (elem !== 'divider' && elem !== 'separator') {
                    this.$el.addClass('menuitem').attr({
                        role: 'menuitem',
                        tabindex: -1,
                        href: this.model.get('href')
                    }).append(this.model.get('label'));
                }
                return this;
            }
        });
        
    
        return ($$[moduleName] = $$.List.extend({
            className: 'dropdown',
    
            initialize: function (options) {
                this.options.itemView = ItemView;
                $$.List.prototype.initialize.call(this, options);

                this.button = $$.button({
                        className: 'dropdown-toggle',
                        context: this.options.context,
                        id: _.uniqueId('Bkp'),
                        type: 'button',
                        'data-toggle': 'dropdown'
                    },
                    String.fromCharCode(160), // &nbsp; to get proper height.
                    $$.caret()
                );
                // allow bubble-up to Bootstrap's Dropdown event handler
                $(this.button).on('click', function () { return true; });
                
                if (this.options.split) {
                    this.$el.addClass('btn-group');
                    this.labelButton = $$.button({
                            context: this.options.context,
                            type: 'button'
                        },
                        this.options.buttonLabel
                    );
                    $(this.button).append($$.span({className: 'sr-only'}, 'Toggle Dropdown'));
                } else {
                    $(this.button).prepend(this.options.buttonLabel);
                }
                
                if ('align' in this.options) {
                    $(this.collectionEl).addClass(this.options.align === 'right' ?
                        'dropdown-menu-right' :
                        'dropdown-menu-left'
                    );
                }
                
                $(this.collectionEl).addClass('dropdown-menu').attr({
                    role: 'menu',
                    'aria-labelledby': this.button.id
                });
            },
            
            render: function () {
                $$.List.prototype.render.call(this);
                this.$el.prepend(this.button);
                this.$el.prepend(this.labelButton);
                return this;
            },
            
            placeItem: function (content, model, index) {
                var elem = model.get('element');
                this.collectionEl.appendChild($$.li({
                    role: 'presentation',
                    className: (elem === 'divider' || elem === 'separator') ? 'divider' :
                        (elem === 'header') ? 'dropdown-header' : ''
                }, content));
            }
        }));
    };

    if (typeof context.define === 'function'
        && context.define.amd
        && !context._$$_backstrap_built_flag
    ) {
        context.define('backstrap/' + moduleName, requirements, fn);
    } else if (typeof context.module === 'object'
        && typeof context.module.exports === 'object'
    ) {
        context.module.exports = fn.call(requirements.map(
            function (reqName)
            {
                return require(reqName);
            }
        ));
    } else {
        if (typeof context.$$ !== 'function') {
            throw new Error('Backstrap not loaded');
        }
        fn(context.$$);
    }
}(this, 'Dropdown', [ 'backstrap', 'backstrap/List', 'backstrap/Button' ]));

/**
 * A Backbone View that displays a Bootstrap contextually-colored glyphicon glyph.
 * context name bound to model data.
 * 
 * @author Kevin Perry perry@princeton.edu
 * @license MIT
 */
(function(context, moduleName, requirements)
{
    var fn = function($$)
    {
        return ($$[moduleName] = $$.View.extend({
            options : {
                context: 'default',
                contextMap: null,
                content: 'ok',
                contentMap: null,
                background: false
            },
            context: 'default',
            content: '',
    
            initialize : function(options) {
                options.tagName = 'span';
                $$.View.prototype.initialize.call(this, options);
                this.mixin([$$.HasModel]);
                _(this).bindAll('render');
                this.prefix = this.options.background ? 'bg-' : 'text-';
                this.glyph = $$.glyph(this.content);
                this.$el.append(this.glyph);
            },
    
            render : function() {
                var contextName = this.resolveContent(this.options.model, this.options.contextMap ? this.options.contextMap : this.options.context);
                var contentName = this.resolveContent(this.options.model, this.options.contentMap);
                this._observeModel(this.render);
                if (contextName !== this.context) {
                    this.$el.removeClass(this.prefix + this.context).addClass(this.prefix + contextName);
                    this.context = contextName;
                }
                if (contentName !== this.content) {
                    $(this.glyph).removeClass('glyphicon-' + this.content).addClass('glyphicon-' + contentName);
                    this.content = contentName;
                }
                return this;
            }
        }));
    };

    if (typeof context.define === 'function'
        && context.define.amd
        && !context._$$_backstrap_built_flag
    ) {
        context.define('backstrap/' + moduleName, requirements, fn);
    } else if (typeof context.module === 'object'
        && typeof context.module.exports === 'object'
    ) {
        context.module.exports = fn.call(requirements.map(
            function (reqName)
            {
                return require(reqName);
            }
        ));
    } else {
        if (typeof context.$$ !== 'function') {
            throw new Error('Backstrap not loaded');
        }
        fn(context.$$);
    }
}(this, 'Glyph', [ 'backstrap', 'backstrap/View', 'backstrap/HasModel' ]));

/**
 * Creates a Bootstrap grid layout object.
 * 
 * @author Kevin Perry perry@princeton.edu
 */
(function(context, moduleName, requirements)
{
    var fn = function($$)
    {
        var appendGridRows = function (layout) {
            for (var r=0; r<layout.length; r++) {
                this.appendRow(layout[r]);
            }
        };

        var parseCellSpec = function (spec) {
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
        
        return ($$[moduleName] = function () {
            var layout;
            var cn = 'container';
            
            layout = [[12]];
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
        });
    };

    if (typeof context.define === 'function'
        && context.define.amd
        && !context._$$_backstrap_built_flag
    ) {
        context.define('backstrap/' + moduleName, requirements, fn);
    } else if (typeof context.module === 'object'
        && typeof context.module.exports === 'object'
    ) {
        context.module.exports = fn.call(requirements.map(
            function (reqName)
            {
                return require(reqName);
            }
        ));
    } else {
        if (typeof context.$$ !== 'function') {
            throw new Error('Backstrap not loaded');
        }
        fn(context.$$);
    }
}(this, 'grid', [ 'backstrap' ]));

/**
 * A Backbone View that displays a Bootstrap grid.
 * 
 * @author Kevin Perry perry@princeton.edu
 * @license MIT
 */
(function(context, moduleName, requirements)
{
    var fn = function($$)
    {
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
        
        // Defaults to 1x1 non-fluid layout.
        return ($$[moduleName] = $$.View.extend({
            fluid: false,
            layout: [[ 12 ]],

            initialize: function (options) {
                $$.View.prototype.initialize.call(this, options);
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

    if (typeof context.define === 'function'
        && context.define.amd
        && !context._$$_backstrap_built_flag
    ) {
        context.define('backstrap/' + moduleName, requirements, fn);
    } else if (typeof context.module === 'object'
        && typeof context.module.exports === 'object'
    ) {
        context.module.exports = fn.call(requirements.map(
            function (reqName)
            {
                return require(reqName);
            }
        ));
    } else {
        if (typeof context.$$ !== 'function') {
            throw new Error('Backstrap not loaded');
        }
        fn(context.$$);
    }
}(this, 'Grid', [ 'backstrap', 'backstrap/View' ]));

/**
 * A Backbone View that displays a model-bound label
 * with Bootstrap decoration.
 * 
 * @author Kevin Perry perry@princeton.edu
 * @license MIT
 */
(function(context, moduleName, requirements)
{
    var fn = function($$)
    {
        return ($$[moduleName] = $$.View.extend({
    
            options : {
                emptyContent : '',
                size: 'default',
                context: 'default'
            },
            
            tagName : 'label',

            initialize : function(options) {
                $$.View.prototype.initialize.call(this, options);
                this.mixin([$$.HasModel]);
                _(this).bindAll('render');
                this.$el.addClass('label label-' + $$._mapSize(this.options.size));
                if (this.options.size !== this.options.context) {
                    this.$el.addClass(' label-' + this.options.context);
                }
                if(this.options.name){
                    this.$el.addClass(this.options.name);
                }

            },

            render : function() {
                var labelText = this.resolveContent(this.model, this.options.labelContent) || this.options.labelContent;
                // if the label is undefined use the emptyContent option
                if(labelText === undefined){
                    labelText = this.options.emptyContent;
                }
                this._observeModel(this.render);

                this.$el.empty();
                
                // insert label
                this.el.appendChild(document.createTextNode(labelText));

                return this;
            }
        }));
    };

    if (typeof context.define === 'function'
        && context.define.amd
        && !context._$$_backstrap_built_flag
    ) {
        context.define('backstrap/' + moduleName, requirements, fn);
    } else if (typeof context.module === 'object'
        && typeof context.module.exports === 'object'
    ) {
        context.module.exports = fn.call(requirements.map(
            function (reqName)
            {
                return require(reqName);
            }
        ));
    } else {
        if (typeof context.$$ !== 'function') {
            throw new Error('Backstrap not loaded');
        }
        fn(context.$$);
    }
}(this, 'Label', [ 'backstrap', 'backstrap/View', 'backstrap/HasModel' ]));

/**
 * A Backbone View that displays a model-bound URL link.
 * Largely from Backbone-UI's Link class,
 * with Bootstrap decoration.
 * 
 * @author Kevin Perry perry@princeton.edu
 * @license MIT
 */
(function(context, moduleName, requirements)
{
    var fn = function($$)
    {
        return ($$[moduleName] = $$.View.extend({
            options : {
                // disables the link (non-clickable) 
                disabled : false,

                // A callback to invoke when the link is clicked
                onClick : null,
                
                size: 'default',
                context: 'default'
            },

            tagName : 'a',

            initialize : function(options) {
                $$.View.prototype.initialize.call(this, options);
                this.mixin([$$.HasModel, $$.HasGlyph]);
                _(this).bindAll('render');
                this.$el.addClass('link text-' + $$._mapSize(this.options.size));
                if (this.options.size !== this.options.context) {
                    this.$el.addClass(' text-' + this.options.context);
                }
                this.$el.bind('click', _(function(e) {
                    return this.options.disabled ? false :
                        (this.options.onClick ? this.options.onClick(e) : true);
                }).bind(this));
            },

            render : function() {
                var labelText = this.resolveContent();

                this._observeModel(this.render);

                this.$el.empty();

                var content = $$.span(labelText);

                var glyphLeftClassName = this.resolveGlyph(this.model, this.options.glyphLeftClassName);
                var glyphRightClassName = this.resolveGlyph(this.model, this.options.glyphRightClassName);

                this.insertGlyphLayout(glyphLeftClassName, glyphRightClassName, content, this.el);

                // add appropriate class names
                this.setEnabled(!this.options.disabled);

                return this;
            },

            // sets the enabled state of the button
            setEnabled : function(enabled) {
                if(enabled) {
                    this.el.href = '#';
                } else { 
                    this.el.removeAttribute('href');
                }
                this.options.disabled = !enabled;
                this.$el.toggleClass('disabled', !enabled);
            }
        }));
    };

    if (typeof context.define === 'function'
        && context.define.amd
        && !context._$$_backstrap_built_flag
    ) {
        context.define('backstrap/' + moduleName, requirements, fn);
    } else if (typeof context.module === 'object'
        && typeof context.module.exports === 'object'
    ) {
        context.module.exports = fn.call(requirements.map(
            function (reqName)
            {
                return require(reqName);
            }
        ));
    } else {
        if (typeof context.$$ !== 'function') {
            throw new Error('Backstrap not loaded');
        }
        fn(context.$$);
    }
}(this, 'Link', [ 'backstrap', 'backstrap/View', 'backstrap/HasModel', 'backstrap/HasGlyph' ]));

/**
 * A Backbone View that displays a model-bound menu.
 * Largely from Backbone-UI's Menu class,
 * with Bootstrap decoration.
 * 
 * @author Kevin Perry perry@princeton.edu
 * @license MIT
 */
(function(context, moduleName, requirements)
{
    var fn = function($$)
    {
        // TODO: Major overhaul - should not use <select>
        var noop = function(){};
        return ($$[moduleName] = $$.View.extend({
            options : {
                // an additional item to render at the top of the menu to 
                // denote the lack of a selection
                emptyItem : null,

                // enables / disables the menu
                disabled : false,

                // A callback to invoke with a particular item when that item is
                // selected from the menu.
                onChange : noop,

                // text to place in the pulldown button before a
                // selection has been made
                placeholder : 'Select...',

                // number of option items to display in the menu
                size : 1
            },

            initialize : function(options) {
                $$.View.prototype.initialize.call(this, options);
                this.mixin([$$.HasModel, $$.HasAlternativeProperty, 
                    $$.HasFormLabel, $$.HasError]);
                _(this).bindAll('render');
                $(this.el).addClass('menu');
            },

            render : function() {
                $(this.el).empty();

                this._observeModel(this.render);
                this._observeCollection(this.render);

                this.selectedItem = this._determineSelectedItem();
                // || this.selectedItem;
                var selectedValue = this._valueForItem(this.selectedItem);

                this.select = $$.select({ 
                    size : this.options.size,
                    disabled : this.options.disabled
                 });

                // setup events for each input in collection
                $(this.select).change(_(this._updateModel).bind(this));

                var selectedOffset = 0;

                // append placeholder option if no selectedItem
                this._placeholder = null;
                if(!this.options.emptyItem && (this.options.size === 1) && !selectedValue) {
                    this._placeholder = $$.option(this.options.placeholder);
                    $(this._placeholder).data('value', null);
                    $(this._placeholder).attr({ disabled : 'true' });
                    this.select.appendChild(this._placeholder);
                    // adjust for placeholder option
                    selectedOffset++;
                }

                if(this.options.emptyItem) {

                    this._emptyItem = $$.option(this._labelForItem(this.options.emptyItem));
                    $(this._emptyItem).data('value', null);
                    this.select.appendChild(this._emptyItem);
                    $(this._emptyItem).click(_(function() {
                        this.select.selectedIndex = 0;
                        this._updateModel();
                    }).bind(this));
                    // adjust for emptyItem option
                    selectedOffset++;
                }

                // default selectedIndex as placeholder if exists
                this._selectedIndex = -1 + selectedOffset;

                _(this._collectionArray()).each(function(item, idx) {

                    // adjust index for potential placeholder and emptyItem
                    idx = idx + selectedOffset;

                    var val = this._valueForItem(item);
                    if(_(selectedValue).isEqual(val)) {
                        this._selectedIndex = idx;
                    }

                    var option = $$.option(this._labelForItem(item));
                    $(option).data('value', val);
                    $(option).attr({
                        selected : this._selectedIndex === idx
                    });

                    $(option).click(_(function(selectedIdx) {
                        this.select.selectedIndex = selectedIdx;
                        this._updateModel();
                    }).bind(this, idx));

                    this.select.appendChild(option);

                }, this);

                // set the selectedIndex on the select element
                this.select.selectedIndex = this._selectedIndex;

                this.el.appendChild(this.wrapWithFormLabel(this.select));

                // scroll to selected Item
                this.scrollToSelectedItem();

                this.setEnabled(!this.options.disabled);

                return this;
            },

         // sets the enabled state
            setEnabled : function(enabled) {
                $(this.el).toggleClass('disabled', !enabled);
                this.select.disabled = !enabled;
            },

            _labelForItem : function(item) {
                return !_(item).exists() ? this.options.placeholder : 
                    this.resolveContent(item, this.options.altLabelContent);
            },

            // sets the selected item
            setSelectedItem : function(item) {
                this._setSelectedItem(item);
                $(this._placeholder).remove();
            },

            _updateModel : function() {
                var item = this._itemForValue($(this.select.options[this.select.selectedIndex]).data('value'));
                var changed = this.selectedItem !== item;
                this._setSelectedItem(item);
                // if onChange function exists call it
                if(_(this.options.onChange).isFunction() && changed) {
                    this.options.onChange(item);
                }    
            },

            _itemForValue : function(val) {
                if(val === null) {
                    return val;
                }
                var item = _(this._collectionArray()).find(function(item) {
                    var isItem = val === item;
                    var itemHasValue = this.resolveContent(item, this.options.altValueContent) === val;
                    return isItem || itemHasValue;
                }, this);

                return item;
            },

            scrollToSelectedItem : function() {
                if(this.select.selectedIndex > 0) {
                    var optionIsMeasurable = $(this.select).find('option').eq(0).height();
                    var optionHeight = optionIsMeasurable > 0 ? optionIsMeasurable : 12;
                    $(this.select).scrollTop((this.select.selectedIndex * optionHeight));
                }
            }

        }));
    };

    if (typeof context.define === 'function'
        && context.define.amd
        && !context._$$_backstrap_built_flag
    ) {
        context.define('backstrap/' + moduleName, requirements, fn);
    } else if (typeof context.module === 'object'
        && typeof context.module.exports === 'object'
    ) {
        context.module.exports = fn.call(requirements.map(
            function (reqName)
            {
                return require(reqName);
            }
        ));
    } else {
        if (typeof context.$$ !== 'function') {
            throw new Error('Backstrap not loaded');
        }
        fn(context.$$);
    }
}(this, 'Menu', [
    'backstrap',
    'backstrap/View',
    'backstrap/HasAlternativeProperty',
    'backstrap/HasError',
    'backstrap/HasFormLabel',
    'backstrap/HasModel'
]));

/**
 * A generic Backbone View for displaying data from a single Model object.
 *
 * Sets up needed bindings to re-render the view
 * when the Model data changes. Set renderOnChange=true
 * to render when any property changes; or to the name of a particular
 * property or an array of property names, to only re-render when the
 * named properties change; or false to do nothing.
 *
 * @author Kevin Perry, perry@princeton.edu
 */
(function (context, moduleName, requirements)
{
    var fn = function ($$)
    {
        return ($$[moduleName] = $$.View.extend({
            options: {
                // The Model instance the view is bound to.
                model: null,

                // Whether to render the model view on change in model.
                // Can also take the name of a property, or an array of property names.
                renderOnChange: true
            },

            initialize: function(options) {
                $$.View.prototype.initialize.call(this, options);
                if (this.model) {
                    var renderOnChange = this.options.renderOnChange;
                    if (renderOnChange) {
                        if (_(renderOnChange).isArray()) {
                            renderOnChange.forEach(function (property) {
                                this.model.on('change:' + property, this.render, this);
                            }, this);
                        } else if (renderOnChange === true) {
                            this.model.on('change', this.render, this);
                        } else { // Assume string
                            this.model.on('change:' + renderOnChange, this.render, this);
                        }
                    }
                }
            }
        }));
    };

    if (typeof context.define === 'function'
        && context.define.amd
        && !context._$$_backstrap_built_flag
    ) {
        context.define('backstrap/' + moduleName, requirements, fn);
    } else if (typeof context.module === 'object'
        && typeof context.module.exports === 'object'
    ) {
        context.module.exports = fn.call(requirements.map(
            function (reqName)
            {
                return require(reqName);
            }
        ));
    } else {
        if (typeof context.$$ !== 'function') {
            throw new Error('Backstrap not loaded');
        }
        fn(context.$$);
    }
}(this, 'ModelView', [ 'backstrap', 'backstrap/View' ]));

/**
 * A 'tag' that defines a Bootstrap nav - a navigation group.
 *
 * The nav is a $$.ul(), so you should populate it with $$.li()'s.
 * You should provide a type, either "type: 'tabs'" or "type: 'pills'".
 * You can also specify attributes "justified: true" for justified tabs or pills,
 * and "stacked: true" for stacked pills.
 *
 * @author Kevin Perry perry@princeton.edu
 */
(function(context, moduleName, requirements)
{
    var fn = function($$)
    {
        return($$[moduleName] = function (attrs)
            {
                var el;
                var type = '';

                if (typeof attrs === 'object' && attrs.nodeType !== 1) {
                    if ('type' in attrs) {
                        if (attrs.type === 'tabs' && !('role' in attrs)) {
                            attrs.role = 'tablist';
                        }
                        if (attrs.type === 'tabs' || attrs.type === 'pills') {
                            type = ' nav-' + attrs.type;
                        }
                        delete(attrs.type);
                    }
                    if ('justified' in attrs) {
                        if (attrs.justified) {
                            type += ' nav-justified';
                        }
                        delete(attrs.justified);
                    }
                    if ('stacked' in attrs) {
                        if (attrs.stacked) {
                            type += ' nav-stacked';
                        }
                        delete(attrs.stacked);
                    }
                }

                el = $$.ul.apply($$, arguments);
                $(el).addClass('nav' + type);
                el.clearActive = function () {
                    $('> *', this).removeClass('active');
                    return this;
                };

                return el;
            }
        );
    };

    if (typeof context.define === 'function'
        && context.define.amd
        && !context._$$_backstrap_built_flag
    ) {
        context.define('backstrap/' + moduleName, requirements, fn);
    } else if (typeof context.module === 'object'
        && typeof context.module.exports === 'object'
    ) {
        context.module.exports = fn.call(requirements.map(
            function (reqName)
            {
                return require(reqName);
            }
        ));
    } else {
        if (typeof context.$$ !== 'function') {
            throw new Error('Backstrap not loaded');
        }
        fn(context.$$);
    }
}(this, 'nav', [ 'backstrap' ]));

/**
 * A 'tag' that defines a Bootstrap navbar component.
 *
 * Options:
 *     brandContent: '' - Branding visual (a DOM object).
 *     brandUrl: '#' - URL for brand href.
 *     position: '' - Allowed: 'fixed-top', 'fixed-bottom' or 'static-top'.
 *     inverse: false - Invert color scheme
 *     toggleContent: Alternate visual for navbar collapse toggle (a DOM object; defaults to a 3-bar hamburger).
 *     sr_toggle_text: 'Toggle navigation' - For screen-readers
 *     role: 'navigation' - For accessibility
 *
 * @author Kevin Perry perry@princeton.edu
 */
(function(context, moduleName, requirements)
{
    var fn = function($$)
    {
        return($$[moduleName] = function (attrs)
            {
                var el, content, collapser, toggleContent = '';
                var offset = 1;
                var brandContent = '';
                var brandUrl = '#';
                var className = 'navbar-default';
                var sr_toggle_text = 'Toggle navigation';
                var collapserId = _.uniqueId('Bkp');

                if (typeof attrs !== 'object' || attrs.nodeType === 1) {
                    attrs = {};
                    offset = 0;
                } else {
                    if ('brandContent' in attrs) {
                        brandContent = attrs.brandContent;
                        delete(attrs.brandContent);
                    }
                    if ('brandUrl' in attrs) {
                        brandUrl = attrs.brandUrl;
                        delete(attrs.brandUrl);
                    }
                    if ('inverse' in attrs) {
                        className = attrs.inverse ? 'navbar-inverse' : 'navbar-default';
                        delete(attrs.inverse);
                    }
                    if ('position' in attrs) {
                        if (attrs.position === 'fixed-bottom'
                            || attrs.position === 'fixed-top'
                            || attrs.position === 'static-top'
                        ) {
                            className += ' navbar-' + attrs.position;
                        }
                        delete(attrs.position);
                    }
                    if ('toggleContent' in attrs) {
                        toggleContent = attrs.toggleContent;
                        delete(attrs.toggleContent);
                    } else {
                        toggleContent = $$.span(
                            $$.span({className: 'icon-bar'}),
                            $$.span({className: 'icon-bar'}),
                            $$.span({className: 'icon-bar'})
                        );
                    }
                    if ('sr_toggle_text' in attrs) {
                        sr_toggle_text = attrs.sr_toggle_text;
                        delete(attrs.sr_toggle_text);
                    }
                }
                if (!('role' in attrs)) {
                    attrs.role = 'navigation';
                }

                el = $$.nav(attrs);
                content = Array.prototype.slice.call(arguments, offset);
                collapser = $$.div({className: 'collapse navbar-collapse', id: collapserId});
                $(collapser).append.apply($(collapser), content);

                $(el).addClass('navbar ' + className).append(
                    $$.div({className: 'container container-fluid'},
                        $$.div({className: 'navbar-header'},
                            $$.button({
                                    type: 'button',
                                    className: 'navbar-toggle collapsed',
                                    'data-toggle': 'collapse',
                                    'data-target': '#' + collapserId
                                },
                                $$.span({className: 'sr-only'}, sr_toggle_text),
                                toggleContent
                            ),
                            $$.a({
                                    className: 'navbar-brand',
                                    href: brandUrl
                                }, brandContent
                            )
                        ),
                        collapser
                    )
                );

                return el;
            }
        );
    };

    if (typeof context.define === 'function'
        && context.define.amd
        && !context._$$_backstrap_built_flag
    ) {
        context.define('backstrap/' + moduleName, requirements, fn);
    } else if (typeof context.module === 'object'
        && typeof context.module.exports === 'object'
    ) {
        context.module.exports = fn.call(requirements.map(
            function (reqName)
            {
                return require(reqName);
            }
        ));
    } else {
        if (typeof context.$$ !== 'function') {
            throw new Error('Backstrap not loaded');
        }
        fn(context.$$);
    }
}(this, 'navbar', [ 'backstrap' ]));

/**
 * A 'tag' that defines a Bootstrap navbar content group.
 * The navbarForm is a $$.form(), so you should populate it
 * with $$.formGroups()'s and form items.
 *
 * @author Kevin Perry perry@princeton.edu
 */
(function(context, moduleName, requirements)
{
    var fn = function($$)
    {
        return($$[moduleName] = function (attrs)
            {
                var el;
                var align = 'left';

                if (typeof attrs === 'object' && attrs.nodeType !== 1) {
                    if ('align' in attrs) {
                        if (attrs.align === 'right') {
                            align = attrs.align;
                        }
                        delete(attrs.align);
                    }
                }

                el = $$.ul.apply($$, arguments);
                $(el).addClass('navbar-form navbar-' + align);

                return el;
            }
        );
    };

    if (typeof context.define === 'function'
        && context.define.amd
        && !context._$$_backstrap_built_flag
    ) {
        context.define('backstrap/' + moduleName, requirements, fn);
    } else if (typeof context.module === 'object'
        && typeof context.module.exports === 'object'
    ) {
        context.module.exports = fn.call(requirements.map(
            function (reqName)
            {
                return require(reqName);
            }
        ));
    } else {
        if (typeof context.$$ !== 'function') {
            throw new Error('Backstrap not loaded');
        }
        fn(context.$$);
    }
}(this, 'navbarForm', [ 'backstrap' ]));

/**
 * A 'tag' that defines a Bootstrap navbar content group.
 * The navbarGroup is a $$.ul(), so you should populate it with $$.li()'s.
 *
 * @author Kevin Perry perry@princeton.edu
 */
(function(context, moduleName, requirements)
{
    var fn = function($$)
    {
        return($$[moduleName] = function (attrs)
            {
                var el;
                var align = 'left';

                if (typeof attrs === 'object' && attrs.nodeType !== 1) {
                    if ('align' in attrs) {
                        if (attrs.align === 'right') {
                            align = attrs.align;
                        }
                        delete(attrs.align);
                    }
                }

                el = $$.ul.apply($$, arguments);
                $(el).addClass('nav navbar-nav navbar-' + align);

                return el;
            }
        );
    };

    if (typeof context.define === 'function'
        && context.define.amd
        && !context._$$_backstrap_built_flag
    ) {
        context.define('backstrap/' + moduleName, requirements, fn);
    } else if (typeof context.module === 'object'
        && typeof context.module.exports === 'object'
    ) {
        context.module.exports = fn.call(requirements.map(
            function (reqName)
            {
                return require(reqName);
            }
        ));
    } else {
        if (typeof context.$$ !== 'function') {
            throw new Error('Backstrap not loaded');
        }
        fn(context.$$);
    }
}(this, 'navbarGroup', [ 'backstrap' ]));

/**
 * A model-bound Bootstrap pills nav object.
 * 
 * @author Kevin Perry perry@princeton.edu
 * @license MIT
 */
(function(context, moduleName, requirements)
{
    var fn = function($$)
    {
        var ItemView = $$.View.extend({
            tagName: 'a',
            className: 'nav-item',
            
            render: function render() {
                this.$el.addClass('nav-item-' + this.model.get('name'))
                    .attr('href', this.model.get('href'))
                    .text(this.model.get('label'));
                return this;
            }
        });
        
        return ($$[moduleName] = $$.List.extend({
    
            initialize: function (options) {
                this.options.itemView = ItemView;
                $$.List.prototype.initialize.call(this, options);
            },
    
            render: function () {
                $$.List.prototype.render.call(this);
                this.$('> ul').addClass('nav nav-pills');
                return this;
            }
        }));
    };

    if (typeof context.define === 'function'
        && context.define.amd
        && !context._$$_backstrap_built_flag
    ) {
        context.define('backstrap/' + moduleName, requirements, fn);
    } else if (typeof context.module === 'object'
        && typeof context.module.exports === 'object'
    ) {
        context.module.exports = fn.call(requirements.map(
            function (reqName)
            {
                return require(reqName);
            }
        ));
    } else {
        if (typeof context.$$ !== 'function') {
            throw new Error('Backstrap not loaded');
        }
        fn(context.$$);
    }
}(this, 'NavPills', [ 'backstrap', 'backstrap/List' ]));
 
/**
 * A model-bound Bootstrap tabs nav object.
 * 
 * @author Kevin Perry perry@princeton.edu
 * @license MIT
 */
(function(context, moduleName, requirements)
{
    var fn = function($$)
    {
        var ItemView = $$.View.extend({
            tagName: 'a',
            className: 'nav-item',
            
            render: function render() {
                this.$el.addClass('nav-item-' + this.model.get('name'))
                    .attr('href', this.model.get('href'))
                    .text(this.model.get('label'));
                return this;
            }
        });
        
        return ($$[moduleName] = $$.List.extend({
    
            initialize: function (options) {
                this.options.itemView = ItemView;
                $$.List.prototype.initialize.call(this, options);
            },
    
            render: function () {
                $$.List.prototype.render.call(this);
                this.$('> ul').addClass('nav nav-tabs');
                return this;
            }
        }));
    };

    if (typeof context.define === 'function'
        && context.define.amd
        && !context._$$_backstrap_built_flag
    ) {
        context.define('backstrap/' + moduleName, requirements, fn);
    } else if (typeof context.module === 'object'
        && typeof context.module.exports === 'object'
    ) {
        context.module.exports = fn.call(requirements.map(
            function (reqName)
            {
                return require(reqName);
            }
        ));
    } else {
        if (typeof context.$$ !== 'function') {
            throw new Error('Backstrap not loaded');
        }
        fn(context.$$);
    }
}(this, 'NavTabs', [ 'backstrap', 'backstrap/List' ]));

/**
 * A Backbone View that displays a Bootstrap panel div.
 * 
 * @author Kevin Perry perry@princeton.edu
 * @license MIT
 */
(function(context, moduleName, requirements)
{
    var fn = function($$)
    {
        return ($$[moduleName] = $$.View.extend({
            initialize : function(options) {
                $$.View.prototype.initialize.call(this, options);
                this.$el.addClass('panel');
            }
        }));
    };

    if (typeof context.define === 'function'
        && context.define.amd
        && !context._$$_backstrap_built_flag
    ) {
        context.define('backstrap/' + moduleName, requirements, fn);
    } else if (typeof context.module === 'object'
        && typeof context.module.exports === 'object'
    ) {
        context.module.exports = fn.call(requirements.map(
            function (reqName)
            {
                return require(reqName);
            }
        ));
    } else {
        if (typeof context.$$ !== 'function') {
            throw new Error('Backstrap not loaded');
        }
        fn(context.$$);
    }
}(this, 'Panel', [ 'backstrap', 'backstrap/View' ]));

/**
 * A model-bound Bootstrap progress bar.
 *
 * Use model and content options to set the percent-complete of the progress bar.
 * 
 * @author Kevin Perry perry@princeton.edu
 * @license MIT
 */
(function(context, moduleName, requirements)
{
    var fn = function($$)
    {
        var ItemView = $$.View.extend({
            initialize: function () {
                $$.View.prototype.initialize.call(this, options);
                this.mixin([$$.HasModel]);
                _(this).bindAll('render');
                this.span = $$.span({className: this.model.labelled ? '' : 'sr-only'});
                $(this.el).addClass('progress-bar').
                    attr('role', 'progressbar').
                    append(this.span);
                if (this.model.context) {
                    $(this.el).addClass(this.model.context);
                }
            },
            
            render: function () {
                var value = this.resolveContent();
                var min = this.resolveContent(this.model, 'min', 0);
                var max = this.resolveContent(this.model, 'max', 100);
                $(this.el).attr({
                    role: 'progressbar',
                    'aria-min': min,
                    'aria-max': max,
                    'aria-valuenow': value
                }).style('width', (value - min)/(max - min) + '%');
                // TODO Allow for "minutes left" style label (computed if flag set?)
                this.span.text(value + this.model.labelSuffix);
            }
        });
        
        return ($$[moduleName] = $$.CollectionView.extend({
            options : {
                tagName : 'span',
                itemView: ItemView
            },
    
            initialize : function(options) {
                $$.View.prototype.initialize.call(this, options);
                this.mixin([$$.HasModel]);
                _(this).bindAll('render');
                $(this.el).addClass('progress');
                if (typeof this.model !== 'Collection') {
                    this.model = new $$.Collection(this.model);    
                }
            },
    
            render : function() {
                var content = this.resolveContent();
                this._observeModel(this.render);
                $(this.el).text(content);
                return this;
            }
        }));
    };

    if (typeof context.define === 'function'
        && context.define.amd
        && !context._$$_backstrap_built_flag
    ) {
        context.define('backstrap/' + moduleName, requirements, fn);
    } else if (typeof context.module === 'object'
        && typeof context.module.exports === 'object'
    ) {
        context.module.exports = fn.call(requirements.map(
            function (reqName)
            {
                return require(reqName);
            }
        ));
    } else {
        if (typeof context.$$ !== 'function') {
            throw new Error('Backstrap not loaded');
        }
        fn(context.$$);
    }
}(this, 'ProgressBar', [
    'backstrap',
    'backstrap/CollectionView',
    'backstrap/HasModel'
]));

/**
 * A Backbone View that displays a model-bound radio-button group.
 * Largely from Backbone-UI's RadioGroup class,
 * with Bootstrap decoration.
 * 
 * @author Kevin Perry perry@princeton.edu
 * @license MIT
 */
(function(context, moduleName, requirements)
{
    var fn = function($$)
    {
        var noop = function(){};

        return ($$[moduleName] = $$.View.extend({

            options : {
                // used to group the radio inputs
                content : 'group',

                // enables / disables the radiogroup
                disabled : false,

                // A callback to invoke with the selected item whenever the selection changes
                onChange : noop
            },

            initialize : function(options) {
                $$.View.prototype.initialize.call(this, options);
                this.mixin([$$.HasModel, 
                    $$.HasAlternativeProperty, $$.HasGlyph, 
                    $$.HasFormLabel, $$.HasError]);
                _(this).bindAll('render');

                $(this.el).addClass('radio_group');
                if(this.options.name){
                    $(this.el).addClass(this.options.name);
                }
            },

            // public accessors
            selectedItem : null,

            render : function() {

                $(this.el).empty();

                this._observeModel(this.render);
                this._observeCollection(this.render);

                this.selectedItem = this._determineSelectedItem() || this.selectedItem;

                var selectedValue = this._valueForItem(this.selectedItem);

                this.group = $$.div({className : 'radio_group_wrapper'});

                _(this._collectionArray()).each(function(item, idx) {

                    var val = this._valueForItem(item);
                    var selected = selectedValue === val;
                    var label = this.resolveContent(item, this.options.altLabelContent);

                    var input = $$.plain.input();
                    $(input).attr({ 
                        type : 'radio',
                        name : this.options.content,
                        value : val,
                        checked : selected
                    });

                    // setup events for each input in collection
                    $(input).change(_(this._updateModel).bind(this, item));
                    $(input).click(_(this._updateModel).bind(this, item));

                    // resolve left and right glyphs
                    var parent = $$.div({className : 'radio_group_wrapper'});
                    var content = $$.span(label);
                    var glyphLeftClassName = this.resolveGlyph(item, this.options.altGlyphLeftClassName);
                    glyphLeftClassName = (glyphLeftClassName && (glyphLeftClassName !== this.options.altGlyphLeftClassName)) ? glyphLeftClassName : 
                        this.resolveGlyph(null, this.options.glyphLeftClassName);
                    var glyphRightClassName = this.resolveGlyph(item, this.options.altGlyphRightClassName);
                    glyphRightClassName = (glyphRightClassName && (glyphRightClassName !== this.options.altGlyphRightClassName)) ? 
                        glyphRightClassName : this.resolveGlyph(null, this.options.glyphRightClassName);
                    this.insertGlyphLayout(glyphLeftClassName, glyphRightClassName, content, parent);

                    // create a new label/input pair and insert into the group
                    this.group.appendChild(
                        $$.plain.label({className : _(this._collectionArray()).nameForIndex(idx++) + 
                            ' ' + (idx % 2 === 0 ? 'even' : 'odd')}, input, parent));

                }, this);

                this.el.appendChild(this.wrapWithFormLabel(this.group));

                this.setEnabled(!this.options.disabled);

                return this;
            },

            _updateModel : function(item) {
                // check if item selected actually changed
                var changed = this.selectedItem !== item;
                this._setSelectedItem(item);
                // if onChange function exists call it
                if(_(this.options.onChange).isFunction() && changed) {
                    this.options.onChange(item);
                }    
            },

            // sets the enabled state
            setEnabled : function(enabled) {
                if(enabled) { 
                    $(this.el).removeClass('disabled');
                } else {
                    $(this.el).addClass('disabled');
                }
            }

        }));
    };

    if (typeof context.define === 'function'
        && context.define.amd
        && !context._$$_backstrap_built_flag
    ) {
        context.define('backstrap/' + moduleName, requirements, fn);
    } else if (typeof context.module === 'object'
        && typeof context.module.exports === 'object'
    ) {
        context.module.exports = fn.call(requirements.map(
            function (reqName)
            {
                return require(reqName);
            }
        ));
    } else {
        if (typeof context.$$ !== 'function') {
            throw new Error('Backstrap not loaded');
        }
        fn(context.$$);
    }
}(this, 'RadioGroup', [
    'backstrap',
    'backstrap/View',
    'backstrap/HasAlternativeProperty',
    'backstrap/HasError',
    'backstrap/HasFormLabel',
    'backstrap/HasGlyph',
    'backstrap/HasModel'
]));

/**
 * A Backbone View that displays a model-bound menu.
 * Largely from Backbone-UI's Menu class,
 * with Bootstrap decoration.
 * Re-named to Select so I can use Menu for a more elaborate component.
 * 
 * @author Kevin Perry perry@princeton.edu
 * @license MIT
 */
(function(context, moduleName, requirements)
{
    var fn = function($$)
    {
        var noop = function(){};

        return($$[moduleName] = $$.View.extend({
            options : {

                // an additional item to render at the top of the menu to 
                // denote the lack of a selection
                emptyItem : null,

                // enables / disables the menu
                disabled : false,

                // A callback to invoke with a particular item when that item is
                // selected from the menu.
                onChange : noop,

                // text to place in the pulldown button before a
                // selection has been made
                placeholder : 'Select...',

                // number of option items to display in the menu
                size : 1
            },

            initialize : function(options) {
                $$.View.prototype.initialize.call(this, options);
                this.mixin([$$.HasModel, $$.HasAlternativeProperty, 
                    $$.HasFormLabel, $$.HasError]);
                _(this).bindAll('render');
                $(this.el).addClass('menu');
            },


            render : function() {
                $(this.el).empty();

                this._observeModel(this.render);
                this._observeCollection(this.render);

                this.selectedItem = this._determineSelectedItem();
                // || this.selectedItem;
                var selectedValue = this._valueForItem(this.selectedItem);

                this.select = $$.select({ 
                    size : this.options.size,
                    disabled : this.options.disabled
                 });

                // setup events for each input in collection
                $(this.select).change(_(this._updateModel).bind(this));

                var selectedOffset = 0;

                // append placeholder option if no selectedItem
                this._placeholder = null;
                if(!this.options.emptyItem && (this.options.size === 1) && !selectedValue) {
                    this._placeholder = $$.option(this.options.placeholder);
                    $(this._placeholder).data('value', null);
                    $(this._placeholder).attr({ disabled : 'true' });
                    this.select.appendChild(this._placeholder);
                    // adjust for placeholder option
                    selectedOffset++;
                }

                if(this.options.emptyItem) {

                    this._emptyItem = $$.option(this._labelForItem(this.options.emptyItem));
                    $(this._emptyItem).data('value', null);
                    this.select.appendChild(this._emptyItem);
                    $(this._emptyItem).click(_(function() {
                        this.select.selectedIndex = 0;
                        this._updateModel();
                    }).bind(this));
                    // adjust for emptyItem option
                    selectedOffset++;
                }

                // default selectedIndex as placeholder if exists
                this._selectedIndex = -1 + selectedOffset;

                _(this._collectionArray()).each(function(item, idx) {

                    // adjust index for potential placeholder and emptyItem
                    idx = idx + selectedOffset;

                    var val = this._valueForItem(item);
                    if(_(selectedValue).isEqual(val)) {
                        this._selectedIndex = idx;
                    }

                    var option = $$.option(this._labelForItem(item));
                    $(option).data('value', val);
                    $(option).attr({
                        selected : this._selectedIndex === idx
                    });

                    $(option).click(_(function(selectedIdx) {
                        this.select.selectedIndex = selectedIdx;
                        this._updateModel();
                    }).bind(this, idx));

                    this.select.appendChild(option);

                }, this);

                // set the selectedIndex on the select element
                this.select.selectedIndex = this._selectedIndex;

                this.el.appendChild(this.wrapWithFormLabel(this.select));

                // scroll to selected Item
                this.scrollToSelectedItem();

                this.setEnabled(!this.options.disabled);

                return this;
            },

         // sets the enabled state
            setEnabled : function(enabled) {
                $(this.el).toggleClass('disabled', !enabled);
                this.select.disabled = !enabled;
            },

            _labelForItem : function(item) {
                return !_(item).exists() ? this.options.placeholder : 
                    this.resolveContent(item, this.options.altLabelContent);
            },

            // sets the selected item
            setSelectedItem : function(item) {
                this._setSelectedItem(item);
                $(this._placeholder).remove();
            },

            _updateModel : function() {
                var item = this._itemForValue($(this.select.options[this.select.selectedIndex]).data('value'));
                var changed = this.selectedItem !== item;
                this._setSelectedItem(item);
                // if onChange function exists call it
                if(_(this.options.onChange).isFunction() && changed) {
                    this.options.onChange(item);
                }    
            },

            _itemForValue : function(val) {
                if(val === null) {
                    return val;
                }
                var item = _(this._collectionArray()).find(function(item) {
                    var isItem = val === item;
                    var itemHasValue = this.resolveContent(item, this.options.altValueContent) === val;
                    return isItem || itemHasValue;
                }, this);

                return item;
            },

            scrollToSelectedItem : function() {
                if(this.select.selectedIndex > 0) {
                    var optionIsMeasurable = $(this.select).find('option').eq(0).height();
                    var optionHeight = optionIsMeasurable > 0 ? optionIsMeasurable : 12;
                    $(this.select).scrollTop((this.select.selectedIndex * optionHeight));
                }
            }
        }));
    };

    if (typeof context.define === 'function'
        && context.define.amd
        && !context._$$_backstrap_built_flag
    ) {
        context.define('backstrap/' + moduleName, requirements, fn);
    } else if (typeof context.module === 'object'
        && typeof context.module.exports === 'object'
    ) {
        context.module.exports = fn.call(requirements.map(
            function (reqName)
            {
                return require(reqName);
            }
        ));
    } else {
        if (typeof context.$$ !== 'function') {
            throw new Error('Backstrap not loaded');
        }
        fn(context.$$);
    }
}(this, 'Select', [
    'backstrap',
    'backstrap/View',
    'backstrap/HasAlternativeProperty',
    'backstrap/HasError',
    'backstrap/HasFormLabel',
    'backstrap/HasModel'
]));

/**
 * A Backbone View that displays model-bound content with Bootstrap decoration.
 * 
 * @author Kevin Perry perry@princeton.edu
 * @license MIT
 */
(function(context, moduleName, requirements)
{
    var fn = function($$)
    {
        return ($$[moduleName] = $$.View.extend({
            options : {
                size: 'default',
                context: 'default'
            },

            tagName : 'span',

            initialize : function(options) {
                $$.View.prototype.initialize.call(this, options);
                this.mixin([$$.HasModel, $$.HasGlyph]);
                _(this).bindAll('render');
                this.$el.addClass('text-' + $$._mapSize(this.options.size));
                if (this.options.size !== this.options.context) {
                    this.$el.addClass(' text-' + this.options.context);
                }
            },

            render : function() {
                var content = this.resolveContent();

                this._observeModel(this.render);

                this.$el.empty();

                var glyphLeftClassName = this.resolveGlyph(this.model, this.options.glyphLeftClassName);
                var glyphRightClassName = this.resolveGlyph(this.model, this.options.glyphRightClassName);

                this.insertGlyphLayout(glyphLeftClassName, glyphRightClassName, content, this.el);

                return this;
            }
        }));
    };

    if (typeof context.define === 'function'
        && context.define.amd
        && !context._$$_backstrap_built_flag
    ) {
        context.define('backstrap/' + moduleName, requirements, fn);
    } else if (typeof context.module === 'object'
        && typeof context.module.exports === 'object'
    ) {
        context.module.exports = fn.call(requirements.map(
            function (reqName)
            {
                return require(reqName);
            }
        ));
    } else {
        if (typeof context.$$ !== 'function') {
            throw new Error('Backstrap not loaded');
        }
        fn(context.$$);
    }
}(this, 'Span', [
    'backstrap',
    'backstrap/View',
    'backstrap/HasModel',
    'backstrap/HasGlyph'
]));

/**
 * A Backbone View that displays a model-bound table.
 * Largely from Backbone-UI's TableView class,
 * with Bootstrap decoration.
 * 
 * @author Kevin Perry perry@princeton.edu
 * @license MIT
 */
(function (context, moduleName, requirements)
{
    var fn = function ($$)
    {
        var noop = function () {};
        
        return ($$[moduleName] = $$.CollectionView.extend({
            options: _({}).extend($$.CollectionView.prototype.options, {
                // Each column should contain a <code>title</code> property to
                // describe the column's heading, a <code>content</code> property to
                // declare which property the cell is bound to, an optional two-argument
                // <code>comparator</code> with which to sort each column if the
                // table is sortable, and an optional <code>width</code> property to
                // declare the width of the column in pixels.
                columns: [],

                // A string, element, or function describing what should be displayed
                // when the table is empty.
                emptyContent: 'no entries',

                // An itemView that renders a table row.
                itemView: $$.View.extend({
                    tagName: 'tr',

                    render: function () {
                        // walk through each column and generate the container
                        _(this.options.parentView.options.columns).each(function (column, index, list) {
                            var width = !!column.width ? parseInt(column.width, 10) + 5 : null;
                            var style = width ? 'width:' + width + 'px; max-width:' + width + 'px': null;
                            this.$el.append($$.td({
                                className: _(list).nameForIndex(index), 
                                style: style
                            }, $$.div({className: 'wrapper', style: style})));
                        }, this);
        
                        // bind the item click callback if given
                        if (this.options.parentView.options.onItemClick) {
                            this.$el.click(_(this.options.parentView.options.onItemClick).bind(this, this.model));
                        }
                        
                        this.render = function () {
                            // walk through each column and fill in the content
                            _(this.options.parentView.options.columns).each(function (column, index, list) {
                                var content = this.resolveContent(this.model, column.content);
                                this.$('td.' + _(list).nameForIndex(index) + ' div.wrapper').empty().append(content);
                            }, this);
    
                            return this;
                        };
                        
                        return this.render();
                    }
                }),

                // Clicking on the column headers will sort the table. See
                // <code>comparator</code> property description on columns.
                // The table is sorted by the first column by default.
                sortable: false,

                // A callback to invoke when the table is to be sorted and sortable is enabled. The callback will
                // be passed the <code>column</code> on which to sort.
                onSort: null,

                striped: false,
                bordered: false,
                hover: false,
                condensed: false,
                responsive: false
            }),

            initialize: function (options) {
                $$.CollectionView.prototype.initialize.call(this, options);
                $(this.el).addClass('table_view');
                this._sortState = {reverse: true};
            },

            render: function () {
                var table;
                var container = $$.div({
                        className: 'content' + (this.options.responsive ? ' table-responsive' : '')
                    },
                    table = $$.table({
                        className: 'table' +
                                (this.options.striped ? ' table-striped' : '') +
                                (this.options.bordered ? ' table-bordered' : '') +
                                (this.options.hover ? ' table-hover' : '') +
                                (this.options.condensed ? ' table-condensed' : ''),
                        cellPadding: '0',
                        cellSpacing: '0'
                    })
                );

                $(this.el).toggleClass('clickable', this.options.onItemClick !== noop);

                // generate a table row for our headings
                var headingRow = $$.tr();
                var sortFirstColumn = false;
                var firstHeading = null;
                _(this.options.columns).each(_(function (column, index, list) {
                    var label = _(column.title).isFunction() ? column.title() : column.title;
                    var width = !!column.width ? parseInt(column.width, 10) + 5 : null;
                    var style = width ? 'width:' + width + 'px; max-width:' + width + 'px; ' : '';
                    style += this.options.sortable ? 'cursor: pointer; ' : '';
                    column.comparator = _(column.comparator).isFunction() ? column.comparator : function (item1, item2) {
                        return item1.get(column.content) < item2.get(column.content) ? -1 :
                            item1.get(column.content) > item2.get(column.content) ? 1 : 0;
                    };

                    var firstSort = (sortFirstColumn && firstHeading === null);
                    var sortHeader = this._sortState.content === column.content || firstSort;
                    var sortClass = sortHeader ? (this._sortState.reverse && !firstSort ? ' asc' : ' desc') : '';
                    var sortLabel = $$.div({className: 'glyph'}, 
                        sortClass === ' asc' ? '\u25b2 ' : sortClass === ' desc' ? '\u25bc ' : '');

                    var onclick = this.options.sortable ? (_(this.options.onSort).isFunction() ?
                        _(function (e) { this.options.onSort(column); }).bind(this) :
                        _(function (e, silent) { this._sort(column, silent); }).bind(this)) : noop;

                    var th = $$.th({
                            className: _(list).nameForIndex(index) + (sortHeader ? ' sorted' : ''), 
                            style: style, 
                            onclick: onclick
                        }, 
                        $$.div({className: 'wrapper' + (sortHeader ? ' sorted': '')}, label),
                        sortHeader ? $$.div({className: 'sort_wrapper' + sortClass}, sortLabel) : null).appendTo(headingRow);

                    if (firstHeading === null) firstHeading = th;
                }).bind(this));
                if (sortFirstColumn && !!firstHeading) {
                    firstHeading.onclick(null, true);
                }

                // now we'll generate the body of the content table, with a row
                // for each model in the bound collection
                this.collectionEl = $$.tbody();
                table.appendChild(this.collectionEl);

                $$.CollectionView.prototype.render.call(this);

                // wrap the list in a scroller
                if (_(this.options.maxHeight).exists()) {
                    var style = 'overflow:auto; max-height:' + this.options.maxHeight + 'px';
                    container = $$.div({style: style}, container);
                }

                // Add the heading row to its very own table so we can allow the
                // actual table to scroll with a fixed heading.
                this.$el.append(
                    $$.table({
                            className: 'heading',
                            cellPadding: '0',
                            cellSpacing: '0'
                        },
                        $$.thead(headingRow)),
                    container
                );

                this.renderClassNames(this.collectionEl);

                return this;
            },

            placeItem: function (item, model, index) {
                $(this.collectionEl).append(item);
            },

            placeEmpty: function (content) {
                $(this.collectionEl).append($$.tr($$.td(content)));
            },

            _sort: function (column, silent) {
                this._sortState.reverse = !this._sortState.reverse;
                this._sortState.content = column.content;
                var comp = column.comparator;
                if (this._sortState.reverse) {
                    comp = function (item1, item2) {
                        return -column.comparator(item1, item2);
                    };
                }
                this.model.comparator = comp;
                this.model.reset(this.model.models, {silent: !!silent});
            }

        }));
    };

    if (typeof context.define === 'function'
        && context.define.amd
        && !context._$$_backstrap_built_flag
    ) {
        context.define('backstrap/' + moduleName, requirements, fn);
    } else if (typeof context.module === 'object'
        && typeof context.module.exports === 'object'
    ) {
        context.module.exports = fn.call(requirements.map(
            function (reqName)
            {
                return require(reqName);
            }
        ));
    } else {
        if (typeof context.$$ !== 'function') {
            throw new Error('Backstrap not loaded');
        }
        fn(context.$$);
    }
}(this, 'Table', [ 'backstrap', 'backstrap/CollectionView' ]));

/**
 * A Backbone View that displays a model-bound text area.
 * Largely from Backbone-UI's TextArea class,
 * with Bootstrap decoration.
 * 
 * @author Kevin Perry perry@princeton.edu
 * @license MIT
 */
(function(context, moduleName, requirements)
{
    var fn = function($$)
    {
        var noop = function(){};

        return ($$[moduleName] = $$.View.extend({
            options : {
                className : 'text_area',

                // id to use on the actual textArea 
                textAreaId : null,

                // disables the text area
                disabled : false,

                tabIndex : null,

                // a callback to invoke when a key is pressed within the text field
                onKeyPress : noop,

                // if given, the text field will limit it's character count
                maxLength : null 
            },

            // public accessors
            textArea : null,

            initialize : function(options) {
                $$.View.prototype.initialize.call(this, options);
                this.mixin([$$.HasModel, $$.HasFormLabel,
                    $$.HasError, $$.HasFocus]);

                $(this.el).addClass('text_area');
                if(this.options.name){
                    $(this.el).addClass(this.options.name);
                }
            },

            render : function() {
                var value = (this.textArea && this.textArea.value.length) > 0 ? 
                    this.textArea.value : this.resolveContent();

                $(this.el).empty();

                this.textArea = $$.textarea({
                    id : this.options.textAreaId,
                    tabIndex : this.options.tabIndex, 
                    placeholder : this.options.placeholder,
                    maxLength : this.options.maxLength}, value);

                this._observeModel(_(this._refreshValue).bind(this));

                this._parent = $$.div({className : 'textarea_wrapper'}, this.textArea);

                this.el.appendChild(this.wrapWithFormLabel(this._parent));

                // add focusin / focusout
                this.setupFocus(this.textArea, this._parent);

                this.setEnabled(!this.options.disabled);

                $(this.textArea).keyup(_(function(e) {
                    _.defer(_(this._updateModel).bind(this));
                    if(_(this.options.onKeyPress).exists() && _(this.options.onKeyPress).isFunction()) {
                        this.options.onKeyPress(e, this);
                    }
                }).bind(this));

                return this;
            },

            getValue : function() {
                return this.textArea.value;
            },

            setValue : function(value) {
                $(this.textArea).empty();
                this.textArea.value = value;
                this._updateModel();
            },

            // sets the enabled state
            setEnabled : function(enabled) {
                if(enabled) {
                    $(this.el).removeClass('disabled');
                } else {
                    $(this.el).addClass('disabled');
                }
                this.textArea.disabled = !enabled;
            },

            _updateModel : function() {
                _(this.model).setProperty(this.options.content, this.textArea.value);
            },

            _refreshValue : function() {
                var newValue = this.resolveContent();
                if(this.textArea && this.textArea.value !== newValue) {
                    this.textArea.value = _(newValue).exists() ? newValue : null;
                }
            }
        }));
    };

    if (typeof context.define === 'function'
        && context.define.amd
        && !context._$$_backstrap_built_flag
    ) {
        context.define('backstrap/' + moduleName, requirements, fn);
    } else if (typeof context.module === 'object'
        && typeof context.module.exports === 'object'
    ) {
        context.module.exports = fn.call(requirements.map(
            function (reqName)
            {
                return require(reqName);
            }
        ));
    } else {
        if (typeof context.$$ !== 'function') {
            throw new Error('Backstrap not loaded');
        }
        fn(context.$$);
    }
}(this, 'TextArea', [
    'backstrap',
    'backstrap/View',
    'backstrap/HasError',
    'backstrap/HasFocus',
    'backstrap/HasFormLabel',
    'backstrap/HasModel'
]));

/**
 * A Backbone View that displays a model-bound text field.
 * Largely from Backbone-UI's TextField class,
 * with Bootstrap decoration.
 * 
 * @author Kevin Perry perry@princeton.edu
 * @license MIT
 */
(function(context, moduleName, requirements)
{
    var fn = function($$)
    {
        var noop = function(){};

        return ($$[moduleName] = $$.View.extend({
            options : {
                // disables the input text
                disabled : false,
                
                // The type of input (text, password, number, email, etc.)
                type : 'text',

                // the value to use for both the name and id attribute 
                // of the underlying input element
                name : null,

                // the tab index to set on the underlying input field
                tabIndex : null,

                // a callback to invoke when a key is pressed within the text field
                onKeyPress : noop,

                // if given, the text field will limit it's character count
                maxLength : null
            },

            // public accessors
            input : null,

            initialize : function(options) {
                $$.View.prototype.initialize.call(this, options);
                this.mixin([$$.HasModel, $$.HasGlyph, 
                    $$.HasFormLabel, $$.HasError, $$.HasFocus]);
                _(this).bindAll('_refreshValue');
            
                $(this.el).addClass('text_field form-group');
                if(this.options.name){
                    $(this.el).addClass(this.options.name);
                }

                this.input = $$.input({maxLength : this.options.maxLength});

                $(this.input).keyup(_(function(e) {
                    if(_(this.options.onKeyPress).exists() && _(this.options.onKeyPress).isFunction()) {
                        this.options.onKeyPress(e, this);
                    }
                }).bind(this)).input(_(this._updateModel).bind(this));

                this._observeModel(this._refreshValue);
            },

            render : function() {
                var value = (this.input && this.input.value.length) > 0 ? 
                    this.input.value : this.resolveContent();

                this.$el.empty();

                $(this.input).attr({
                    type : this.options.type ? this.options.type : 'text',
                    name : this.options.name,
                    id : this.options.name,
                    tabIndex : this.options.tabIndex,
                    placeholder : this.options.placeholder,
                    pattern : this.options.pattern,
                    value : value});

                // insert glyph if exist
                this._parent = $$.div({className : 'text_wrapper'});
                var content = this.input;
                var glyphLeftClassName = this.resolveGlyph(this.model, this.options.glyphLeftClassName);
                var glyphRightClassName = this.resolveGlyph(this.model, this.options.glyphRightClassName);
                this.insertGlyphLayout(glyphLeftClassName, glyphRightClassName, content, this._parent);
                
                // add focusin / focusout
                this.setupFocus(this.input, this._parent);
                            
                this.$el.append(this.wrapWithFormLabel($$.span()), this._parent);
                
                this.setEnabled(!this.options.disabled);

                return this;
            },

            getValue : function() {
                return this.input.value;
            },

            setValue : function(value) {
                this.input.value = value;
                this._updateModel();
            },

            // sets the enabled state
            setEnabled : function(enabled) {
                if(enabled) { 
                    $(this.el).removeClass('disabled');
                } else {
                    $(this.el).addClass('disabled');
                }
                this.input.disabled = !enabled;
            },

            _updateModel : function() {
                _(this.model).setProperty(this.options.content, this.input.value);
            },

            _refreshValue : function() {
                var newValue = this.resolveContent();
                if(this.input && this.input.value !== newValue) {
                    this.input.value = _(newValue).exists() ? newValue : "";
                }
            }
        }));
    };

    if (typeof context.define === 'function'
        && context.define.amd
        && !context._$$_backstrap_built_flag
    ) {
        context.define('backstrap/' + moduleName, requirements, fn);
    } else if (typeof context.module === 'object'
        && typeof context.module.exports === 'object'
    ) {
        context.module.exports = fn.call(requirements.map(
            function (reqName)
            {
                return require(reqName);
            }
        ));
    } else {
        if (typeof context.$$ !== 'function') {
            throw new Error('Backstrap not loaded');
        }
        fn(context.$$);
    }
}(this, 'TextField', [
    'backstrap',
    'backstrap/View',
    'backstrap/HasModel',
    'backstrap/HasGlyph',
    'backstrap/HasFormLabel',
    'backstrap/HasError',
    'backstrap/HasFocus'
]));

/**
 * A Backbone View that displays a model-bound time picker.
 * Largely from Backbone-UI's TimePicker class,
 * with Bootstrap decoration.
 * 
 * @author Kevin Perry perry@princeton.edu
 * @license MIT
 */
(function(context, moduleName, requirements)
{
    var fn = function($$, moment)
    {
        var KEY_RETURN = 13;

        return ($$[moduleName] = $$.View.extend({
            options : {
                // a moment.js format : http://momentjs.com/docs/#/display/format
                format : 'hh:mm a',

                // minute interval to use for pulldown menu
                interval : 30,

                // the name given to the text field's input element
                name : null,

                // text field is disabled or enabled
                disabled : false
            },

            initialize : function(options) {
                $$.View.prototype.initialize.call(this, options);
                this.mixin([$$.HasModel, $$.HasFormLabel, $$.HasError]);
                $(this.el).addClass('time_picker');

                this._timeModel = {};
                this._menu = new $$.Menu({
                    className : 'time_picker_menu',
                    model : this._timeModel,
                    altLabelContent : 'label',
                    altValueContent : 'label',
                    content : 'value',
                    onChange : _(this._onSelectTimeItem).bind(this),
                    size : 10
                });
                $(this._menu.el).hide();
                $(this._menu.el).autohide({
                    ignoreInputs : true
                });
                document.body.appendChild(this._menu.el);

                // listen for model changes
                this._observeModel(_(this.render).bind(this));
            },

            render : function() {
                $(this.el).empty();

                this._textField = new $$.TextField({
                    name : this.options.name,
                    disabled : this.options.disabled, 
                    placeholder : this.options.placeholder,
                    glyphLeftClassName : this.options.glyphLeftClassName,
                    glyphRightClassName : this.options.glyphRightClassName
                }).render();
                $(this._textField.input).click(_(this._showMenu).bind(this));
                $(this._textField.input).blur(_(this._timeEdited).bind(this));
                $(this._textField.input).keyup(_(this._hideMenu).bind(this));
                this.el.appendChild(this.wrapWithFormLabel(this._textField.el));

                var date = this.resolveContent();

                if(!!date) {
                    var value = moment(date).format(this.options.format);
                    this._textField.setValue(value);
                    this._timeModel.value = value;
                    this._selectedTime = date;
                }

                this._menu.options.alternatives = this._collectTimes();
                this._menu.options.model = this._timeModel;
                this._menu.render();

                return this;
            },

            getValue : function() {
                return this._selectedTime;
            },

            setValue : function(time) {
                this._selectedTime = time;
                var timeString = moment(time).format(this.options.format);
                this._textField.setValue(timeString);
                this._timeEdited();

                this._menu.options.selectedValue = time;
                this._menu.render();
            },

            setEnabled : function(enabled) {
                this.options.disabled = !enabled;
                this._textField.setEnabled(enabled);
            },

            _collectTimes : function() {
                var collection;
                var d = moment().startOf('day');
                var day = d.date();
                
                collection = [];
                while(d.date() === day) {
                    collection.push({
                        label : d.format(this.options.format),
                        value : new Date(d)
                    });

                    d.add(this.options.interval, 'minutes');
                }

                return collection;
            },

            _showMenu : function() {
                if($(this._menu.el).is(':visible')) return;

                $(this._menu.el).alignTo(this._textField.el, 'bottom -left', 0, 2);
                $(this._menu.el).show();
                this._menu.scrollToSelectedItem();
            },

            _hideMenu : function(e) {
                if(e && e.keyCode === KEY_RETURN) this._timeEdited();
                $(this._menu.el).hide();
            },

            _onSelectTimeItem : function(item) {
                this._hideMenu();
                this._selectedTime = item.value;
                this._textField.setValue(moment(this._selectedTime).format(this.options.format));
                this._timeEdited();
            },

            _timeEdited : function(e) {
                var value = this._textField.getValue();
                if(!value) return;

                // if the event is a blur, we need to make sure that the menu is not
                // open, otherwise we'll squash that selection event
                if(e && e.type === 'blur' && $(this._menu.el).is(':visible')) return;

                var newDate = moment(value, this.options.format);

                // if the enter key was pressed or we've invoked this method manually, 
                // we hide the calendar and re-format our date
                if(!e || e.keyCode === KEY_RETURN || e.type === 'blur') {
                    var newValue = moment(newDate).format(this.options.format);
                    this._textField.setValue(newValue);
                    this._hideMenu();

                    // update our bound model (but only the date portion)
                    if(!!this.model && this.options.content) {
                        var boundDate = this.resolveContent();
                        var updatedDate = new Date(boundDate);
                        // Ensure we are updating a valid Date object
                        updatedDate = isNaN(updatedDate.getTime()) ? new Date() : updatedDate;
                        updatedDate.setHours(newDate.hours());
                        updatedDate.setMinutes(newDate.minutes());
                        _(this.model).setProperty(this.options.content, updatedDate);
                    }

                    if(_(this.options.onChange).isFunction()) {
                        this.options.onChange(newValue);
                    }
                }
            }
        }));
    };

    if (typeof context.define === 'function'
        && context.define.amd
        && !context._$$_backstrap_built_flag
    ) {
        context.define('backstrap/' + moduleName, requirements, fn);
    } else if (typeof context.module === 'object'
        && typeof context.module.exports === 'object'
    ) {
        context.module.exports = fn.call(requirements.map(
            function (reqName)
            {
                return require(reqName);
            }
        ));
    } else {
        if (typeof context.$$ !== 'function') {
            throw new Error('Backstrap not loaded');
        }
        if (typeof context.moment !== 'function') {
            throw new Error('Moment not loaded');
        }
        fn(context.$$, context.moment);
    }
}(this, 'TimePicker', [
    'backstrap',
    'moment',
    'backstrap/View',
    'backstrap/HasError',
    'backstrap/HasFormLabel',
    'backstrap/HasModel',
    'backstrap/Menu',
    'backstrap/TextField'
]));

/**
 * Cleanup our temporary global context defn's. See _setup.js for explanation.
 * 
 * @author Kevin Perry perry@princeton.edu
 */
if (typeof this.define === "function" && this.define.amd) {
	this._$$_backstrap_built_flag();
	this.define("backstrap", ["jquery", "backbone", "bootstrap"], this.$$.noConflict);
}
