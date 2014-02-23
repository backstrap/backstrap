(function(context) {

  var formation = {

    stack : function() {

      var options = {
        padding : '10px',
        className : 'formation stack'
      };

      var el = $.el.div();

      var args = flattenArgs(arguments);
      for(var i=0; i<args.length; i++) {
        var arg = args[i];
        if(!arg) continue;

        // if the argument is a dom node, we append it
        if(arg.nodeType === 1) {
          var isLast = i === args.length - 1;
          arg.style.marginBottom = isLast ? '0' : options.padding;
          if(i === args.length - 1) arg.className += ' last';
          if(i === 0) arg.className += ' first';
          el.appendChild(arg);
          $.el.span({style : 'display:block;clear:both;'}).appendTo(el);
        }

        // if the argument is a plain old object, and it's in the 
        // first slot, we process the object as options
        else if(i === 0 && typeof(arg) === 'object' && 
            Object.prototype.toString.call(arg) !== '[object Array]') {
          processOptions(options, arg, el);
        }
      }

      el.className = options.className;
      return el;
    },

    flow : function() {
      var options = {
        padding : '10px',
        className : 'formation flow'
      };

      var el = $.el.div();
      var args = flattenArgs(arguments);

      // process any formation options or element attributes
      var firstArg = args[0];
      if(!!firstArg && firstArg.nodeType !== 1 && typeof(firstArg) === 'object') {
        processOptions(options, firstArg, el);
        args = Array.prototype.slice.call(args, 1);
      }

      // determine the spring index 
      var i, springIndex = -1;
      for(i=0; i<args.length; i++) {
        if(args[i] === 'spring') {
          springIndex = i;
          break;
        }
      }

      // add children after the spring from right to left
      var leftLimit = springIndex < 0 ? args.length : springIndex;
      var child;
      for(i=args.length-1; i>leftLimit; i--) {
        child = args[i];
        if(child) {
          child.className += ' right';
          if(i === args.length - 1) el.className += ' last';
          if(i === 0) child.className += ' first';

          // apply style attributes
          child.style.marginLeft = options.padding;
          child.style.cssFloat = 'right';
          child.style.zoom = '1';

          !!previousChild && !!previousChild.nextChild ?
            el.insertBefore(child, previousChild.nextChild) :
            el.appendChild(child);

          var previousChild = child;
        }
      }

      // add children before the spring from left to right
      for(i=0; i<leftLimit; i++) {
        child = args[i];

        // set class name
        if(child) {
          child.className += ' left';
          if(i === 0) child.className += ' first';
          if(i === leftLimit - 1) child.className += ' last';

          // set style attributes
          if(i !== leftLimit - 1) child.style.marginRight = options.padding;
          child.style.display = 'inline-block';
          child.style.verticalAlign = 'top';
          
          // IE7 zoom / inline hack
          if (navigator.appVersion.indexOf("MSIE") != -1) {
            if(parseFloat(navigator.appVersion.split("MSIE")[1]) <= 7) {
              child.style.display = 'inline';
              child.style.zoom = '1';
            }
          }

          el.appendChild(child);
        }
      }
      
      $.el.span({style : 'display:block;clear:both;'}).appendTo(el);

      el.className = options.className;
      return el;
    }
  };

  var flattenArgs = function(args) {
    var flattened = [];
    for(var i=0; i<args.length; i++) {
      var arg = args[i];
      if(Object.prototype.toString.call(arg) === '[object Array]') {
        for(var j=0; j<arg.length; j++) {
          flattened.push(arg[j]);
        }
      }
      else {
        flattened.push(arg);
      }
    }
    return flattened;
  };

  var processOptions = function(existing, given, el) {
    for(var key in given) {
      // any key corresponding to a formation option will be copied over 
      if(existing[key] !== undefined) {
        // class name option should be appended to the existing class name
        if(key.match(/class/i) || key.match(/className/i)) {
          existing.className = existing.className + ' ' + given[key];
        }

        // all other options should overwrite existing options
        else {
          existing[key] = given[key];
        }
      }

      // other keys will be considered element attributes
      else {
        el.setAttribute(key, given[key]);
      }
    }
  };

  // If we're in a CommonJS environment, we export our formation methods
  if(typeof module !== 'undefined' && module.exports) {
    module.exports = formation;
  } 

  // otherwise, we attach them to the top level $.formation namespace
  else {
    var dollar = context['$'] || {};
    dollar.el = dollar.el || {};
    for(var key in formation) {
      dollar.el[key] = formation[key];
    }
    context['$'] = dollar;
  }

})(this);
