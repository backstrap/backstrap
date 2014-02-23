window.beautify = function(func) {
  var code = func.toString();
  code = code.substring(code.indexOf('\n'));
  code = code.substring(0, code.lastIndexOf('return'));
  code = code.replace(/var lorem = \"[^\"]*"/, 'var lorem = "Lorem ipsum dolor sit..."');
  code = js_beautify(code, {
    indent_size : 2 
  });
  return code;
};

window.addExample = function(container, func) {
  // remove function wrapper and return statement 
  // from the code, then format it
  var code = beautify(func);

  var example = $.el.div(
    $.el.div({className : 'code'}, 
      $.el.pre({className : 'prettyprint'}, code)),
    $.el.div({className : 'result'}, 
      func().el),
    $.el.br({style : 'clear:both'}));
    
    var ref = $('.options', $(container)[0])[0];
    if(ref) {
      $(container)[0].insertBefore(example, ref);
    }
    else {
      $(container)[0].appendChild(example);
    }
};

$(window).load(function() {
  // setup sample data
  setTimeout(prettyPrint, 0);

  var func = function() {
    window.regions = new Backbone.Collection([{
      name : 'Americas',
      notes : 'Bright'
    }, {
      name : 'Africa',
      notes : 'Fruity'
    }]);

    window.coffee = new Backbone.Model({
      roaster: 'Counter Culture',
      name: 'Baroida',
      roastedOn: new Date(2012, 2, 28, 6, 30),
      acidic : true,
      region : regions.at(0)
    });

    return;
  };

  func();

  $.el.pre({className : 'prettyprint'}, beautify(func)).appendTo($('#setup_code')[0]);

  // keep example state display data updated
  var dataEl = $('#example_data')[0];
  $(dataEl).hide();
  var stateEl = $('#example_state')[0];
  var renderState = function() {
    $(stateEl).empty();
    var json = (JSON.stringify(coffee.attributes, null, 2));
    json = json.substring(json.indexOf('\n')).substring(0, json.lastIndexOf('\n'));
    json = json.replace(/(\r\n|\n|\r)/gm, '<br/>');
    var div = $.el.div();
    div.innerHTML = json;
    stateEl.appendChild(div);

    if(!$(dataEl).is(":visible")) {
      $(dataEl).fadeIn();
    }
  };

  var closeLink = $('#close_example')[0];
  $(closeLink).click(function() {
    $(dataEl).fadeOut();
    return false;
  });

  coffee.bind('change', renderState);
  regions.bind('change', renderState);

  // task example
  var taskFunc = function() {
    // create a sorted backbone collection to store our tasks
    var tasks = new Backbone.Collection([], {
      comparator : function(task) {
        return task.get('done') ? 1 : 0;
      }
    });

    // define how each individual task should render
    var TaskView = Backbone.View.extend({
      render : function() {
        $(this.el).empty();

        // add a link to remove this task from the list
        this.el.appendChild(new Backbone.UI.Link({
          content : 'delete',
          onClick : _(tasks.remove).bind(tasks, this.model)
        }).render().el);

        // a checkbox to mark / unmark the done status of this task 
        this.el.appendChild(new Backbone.UI.Checkbox({
          model : this.model,
          labelContent : 'title',
          content : 'done'
        }).render().el);
      }
    });

    // create our list view to render our collection
    var list = new Backbone.UI.List({
      itemView : TaskView,
      model : tasks
    }).render();

    // create a text field to add new items 
    var newItem = new Backbone.Model;
    var field = new Backbone.UI.TextField({ 
      model : newItem,
      content : 'title',
      placeholder : 'add a new item',
      onKeyPress : function(e) {
        if(e.keyCode == 13) {
          list.options.model.add(newItem.clone());
          newItem.set({ title : undefined });
        }
      }
    }).render();

    var appEl = $.el.div(field.el, list.el);

    return appEl; 
  };

  var code = taskFunc.toString();
  code = code.substring(code.indexOf('\n'));
  code = code.substring(0, code.lastIndexOf('return'));

  code = js_beautify(code, {
    indent_size : 2 
  });

  $.el.pre({className : 'prettyprint'}, code).appendTo($('#task_list_code')[0]);

  var result = taskFunc();
  $('#task_list_result')[0].appendChild(result);
  
  // theming
  Backbone.UI.setSkin('perka');  
  
});

