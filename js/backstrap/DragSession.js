(function(context) {
	var fn = function($$)
	{
		var KEY_ESC = 27;
		var noop = function(){};

		$$.DragSession = function(options) {
			this.options = _.extend({
				// A mouse(move/down) event
				dragEvent : null,

				//The document in which the drag session should occur
				scope : null,

				//Sent when the session is ends up being a sloppy mouse click
				onClick: noop,

				// Sent when a drag session starts for real 
				// (after the mouse has moved SLOP pixels)
				onStart: noop,

				// Sent for each mouse move event that occurs during the drag session
				onMove: noop,

				// Sent when the session stops normally (the mouse was released)
				onStop: noop,

				// Sent when the session is aborted (ESC key pressed)
				onAbort: noop,

				// Sent when the drag session finishes, regardless of
				// whether it stopped normally or was aborted.
				onDone: noop
			}, options);

			if($$.DragSession.currentSession) {
				// Abort any existing drag session. While this should never happen in
				// theory, in practice it happens a fair bit (e.g. if a mouseup occurs
				// outside the document). So we don't complain about.
				$$.DragSession.currentSession.abort();
			}

			this._doc = this.options.scope || document;

			this._handleEvent = _.bind(this._handleEvent, this);
			this._handleEvent(this.options.dragEvent);

			// Activate handlers
			this._activate(true);

			this.options.dragEvent.stopPropagation();

			/**
			 * currentSession The currently active drag session.
			 */
			$$.DragSession.currentSession = this;
		};

		// add class methods 
		_.extend($$.DragSession, {
			SLOP : 2,

			BASIC_DRAG_CLASSNAME: 'dragging',

			// Enable basic draggable element behavior for absolutely positioned elements.
			// scope:     The window/document to enable dragging on. Default is current document.
			// container: A container element to constrain dragging within
			// shield:    If true the draggable will use a shield iframe useful for ...
			enableBasicDragSupport : function(scope, container, shield) {
				var d = scope ? (scope.document || scope) : document;
				if (d._basicDragSupportEnabled) return;
				d._basicDragSupportEnabled = true;
				// Enable "draggable"/"grabbable" classes
				$(d).bind('mousedown', function(e) {
					var el = e.target;

					// Ignore clicks that happen on anything the user might want to
					// interact with input elements
					var IGNORE = /(input|textarea|button|select|option)/i;
					if (IGNORE.exec(el.nodeName)) return;

					// Find the element to drag
					if (!el.hasClassName) return; // flash objects don't support this method
									// and should not be draggable
									// this fixes a problem in Shareflow in IE7
									// with the upload button
					var del = el.hasClassName('draggable') ? el : el.up('.draggable');
					del = del ? del.up('.draggable-container') || del : null;

					if (del) {
						// Get the allowable bounds to drag w/in
						// if (container) container = $(container);
						// var vp = container ? container.getBounds() : zen.util.Dom.getViewport(del.ownerDocument);
						//var vp = zen.util.Dom.getViewport(del.ownerDocument);
						var elb = del.getBounds();

						// Create a new drag session
						var activeElement = document.activeElement;
						new $$.DragSession({
							dragEvent : e, 
							scope : del.ownerDocument, 
							onStart : function(ds) {
								if (activeElement && activeElement.blur) activeElement.blur();
								ds.pos = del.positionedOffset();
								$(del).addClass($$.DragSession.BASIC_DRAG_CLASSNAME);
							},
							onMove : function(ds) {
								//elb.moveTo(ds.pos.left + ds.dx, ds.pos.top + ds.dy).constrainTo(vp);
								del.style.left = elb.x + 'px';
								del.style.top = elb.y + 'px';
							},
							onDone : function(ds) {
								if (activeElement && activeElement.focus) activeElement.focus();
								del.removeClassName($$.DragSession.BASIC_DRAG_CLASSNAME);
							}
						});
					}
				});
			}
		});

		// add instance methods
		_.extend($$.DragSession.prototype, {

			// Fire the onStop event and stop the drag session.
			stop: function() {
				this._stop();
			},

			// Fire the onAbort event and stop the drag session.
			abort: function() {
				this._stop(true);
			},

			// Activate the session by registering/unregistering event handlers
			_activate: function(flag) {
				var f = flag ? 'bind' : 'unbind';
				$(this._doc)[f]('mousemove', this._handleEvent);
				$(this._doc)[f]('mouseup', this._handleEvent);
				$(this._doc)[f]('keyup', this._handleEvent);
			},

			// All-in-one event handler for managing a drag session
			_handleEvent: function(e) {
				e.stopPropagation();
				e.preventDefault();

				this.x = e.pageX;
				this.y = e.pageY;

				if (e.type === 'mousedown') {
					// Absolute X of initial mouse down*/
					this.xStart = this.x;

					// Absolute Y of initial mouse down
					this.yStart = this.y;
				}

				// X-coord relative to initial mouse down
				this.dx = this.x - this.xStart;

				// Y-coord relative to initial mouse down
				this.dy = this.y - this.yStart;

				switch (e.type) {
					case 'mousemove':
						if (!this._dragging) {
							// Sloppy click?
							if(this.dx * this.dx + this.dy * this.dy >= $$.DragSession.SLOP * $$.DragSession.SLOP) {
								this._dragging = true;
								this.options.onStart(this, e);
							}
						} else {
							this.options.onMove(this, e);
						}
						break;
					case 'mouseup':
						if (!this._dragging) {
							this.options.onClick(this, e);
						} else {
							this.stop();
						}
						//this._stop();
						break;
					case 'keyup':
						if (e.keyCode !== KEY_ESC) return;
						this.abort();
						break;
					default:
						return;
				}
			},

			// Stop the drag session
			_stop: function(abort) {
				$$.DragSession.currentSession = null;

				// Deactivate handlers
				this._activate(false);

				if (this._dragging) {
					if (abort) {
						this.options.onAbort(this);
					} else {
						this.options.onStop(this);
					}
					this.options.onDone(this);
				}
			}
		});

		return $$.DragSession;
	};

	if (typeof context.define === "function" && context.define.amd &&
			typeof context._$$_backstrap_built_flag === 'undefined') {
		context.define("backstrap/Badge", ["backstrap", "backstrap/HasModel"], fn);
	} else if (typeof context.module === "object" && typeof context.module.exports === "object") {
		context.module.exports = fn(require("backstrap"));
	} else {
		if (typeof context.$$ !== 'function') throw new Error('Backstrap environment not loaded');
		fn(context.$$);
	}
}(this));
