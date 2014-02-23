$(document).ready(function() {

  module("Backbone.ListView");

  Backbone.UI.setMobile(false);

  test("withDataBinding", function(){

    var regions = new Backbone.Collection([{
      name: 'Americas',
      notes: 'Bright'
    }, {
      name: 'Africa',
      notes: 'Fruity'
    }]);

    var Item = Backbone.View.extend({
      render: function() {
        $(this.el).empty();
        $.el.div(this.model.get('name')).appendTo(this.el);
      }
    });

    var list = new Backbone.UI.List({
      model: regions,
      itemView: Item
    }).render();

    //check table has two rows
    equal($(list.el).find('li').length,2);

    //add item to regions
    var newItem = { name: 'Hawaii', notes: 'Nutty'};
    regions.add(newItem);
    equal($(list.el).find('li').length,3);
    equal($(list.el).find('li.last').text(),'Hawaii');

  });
  
  // we want to ensure that render for the list and each item
  // in the list is not called wastefully
  test("properRenderCounts", function() {
    
    var users = new Backbone.Collection();
    
    users.comparator = function(user) {
      return user.get('first');
    }
    
    // count number of times a render function is called
    var renderCount = 0;
    var renderItemCount = 0;
    
    var list = new Backbone.UI.List({
      model: users,
      itemView : Backbone.View.extend({
        render: function() {
          $(this.el).empty();
          this.el.appendChild($.el.div(this.model.get('first') + ' ' + this.model.get('last')));
          // increment renderItem
          renderItemCount++;
          return this;
        }
      })
    });
    
    // modify List's render to increment our counter
    var listRender = _(list.render).bind(list);
    list.render = function() {
      var toReturn = listRender();
      renderCount++;
      return toReturn;
    }
    list.render();
    
    // use set to add models to the collection
    users.set({first : 'jack', last : 'carrig'}, {remove : false});
    users.set({first : 'joe', last : 'stelmach'}, {remove : false});
    users.set({first : 'jim', last : 'strate'}, {remove : false});
    users.set({first : 'bob', last : 'vawter'}, {remove : false});
    
    equal(renderCount, 1);
    equal(renderItemCount, 4);
    
    // use add to add models to the collection
    users.add({first : 'alan', last : 'chung'});
    
    equal(renderCount, 1);
    equal(renderItemCount, 5);
    
    // ensure proper order
    equal($(list.el).find('li.first').text(),'alan chung');
    
  });
  
});