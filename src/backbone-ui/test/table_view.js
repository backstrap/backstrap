$(document).ready(function() {

  module("Backbone.TableView");

  Backbone.UI.setMobile(false);

  test("withDataBinding", function(){

    var regions = new Backbone.Collection([{
      name: 'Americas',
      notes: 'Bright'
    }, {
      name: 'Africa',
      notes: 'Fruity'
    }]);

    var table = new Backbone.UI.TableView({
      model: regions,
      columns: [{
        title: 'Name',
        content: 'name'
      }, {
        title: 'Notes',
        width: 100,
        content: 'notes'
      }]
    }).render();

    //check table has two rows
    equal($(table.el).find('.content tr').length,2);

    //add item to regions
    var newItem = { name: 'Hawaii', notes: 'Nutty'};
    regions.push(newItem);
    equal($(table.el).find('.content tr').length,3);
    equal($(table.el).find('.content tr.last td.first').text(),'Hawaii');

  });

  test("onItemClick", function(){
    var regions = new Backbone.Collection([{
      name: 'Americas',
      notes: 'Bright'
    }, {
      name: 'Africa',
      notes: 'Fruity'
    }]);

    var clickCount = 0;

    var table = new Backbone.UI.TableView({
      model: regions,
      onItemClick: function(model) {
        clickCount++;
      },
      columns: [{
        title: 'Name',
        content: 'name'
      }, {
        title: 'Notes',
        width: 100,
        content: 'notes'
      }]
    }).render();

    //click two rows
    $(table.el).find('.content tr.first').click();
    $(table.el).find('.content tr.last').click();
    equal(clickCount,2);

  }); 

  test("sortable", function(){

    var regions = new Backbone.Collection([{
      name: 'Americas',
      notes: 'Bright'
    }, {
      name: 'Africa',
      notes: 'Fruity'
    }]);

    var table = new Backbone.UI.TableView({
      sortable: true,
      model: regions,
      columns: [{
        title: 'Name',
        content: 'name'
      }, {
        title: 'Notes',
        width: 100,
        content: 'notes'
      }]
    }).render();

    //add item to regions
    var newItem = { name: 'Hawaii', notes: 'Nutty'};
    regions.push(newItem);

    //click name header column to sort ascending
    $(table.el).find('.heading th.first').click();
    equal($(table.el).find('.content tr.first td.first').text(),'Africa');

    //click name header column to sort descending
    $(table.el).find('.heading th.first').click();
    equal($(table.el).find('.content tr.first td.first').text(),'Hawaii');

    //click notes header column to sort ascending
    $(table.el).find('.heading th.last').click();
    equal($(table.el).find('.content tr.first td.last').text(),'Bright');

    //click notes header column to sort descending
    $(table.el).find('.heading th.last').click();
    equal($(table.el).find('.content tr.first td.last').text(),'Nutty');
    
  }); 

  test("onSort", function(){

    var regions = new Backbone.Collection([{
      name: 'Americas',
      notes: 'Bright'
    }, {
      name: 'Africa',
      notes: 'Fruity'
    }]);

    var sortCount = 0;

    var table = new Backbone.UI.TableView({
      sortable: true,
      model: regions,
      onSort: function(model) {
        sortCount++;
      },
      columns: [{
        title: 'Name',
        content: 'name'
      }, {
        title: 'Notes',
        width: 100,
        content: 'notes'
      }]
    }).render();

    //click a header column to check if onSort is called
    $(table.el).find('.heading th.first').click();
    equal(sortCount,1);

  }); 

  test("emptyContent", function(){
    var regions=null;

    var table = new Backbone.UI.TableView({
      model: regions,
      emptyContent: 'empty',
      columns: [{
        title: 'Name',
        content: 'name'
      }, {
        title: 'Notes',
        width: 100,
        content: 'notes'
      }]
    }).render();

    equal($(table.el).find('.content tr.first td').text(),'empty');

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
    
    var table = new Backbone.UI.TableView({
      model: users,
      columns: [{
        title: 'Firstname',
        content: 'first'
      }, {
        title: 'Lastname',
        content: 'last'
      }]
    });
    
    // modify Table's render to increment our counter
    var tableRender = _(table.render).bind(table);
    table.render = function() {
      var toReturn = tableRender();
      renderCount++;
      return toReturn;
    }
    
    // modify Table's renderItem to increment our counter
    var tableRenderItem = _(table._renderItem).bind(table);
    table._renderItem = function(model, index) {
      var toReturn = tableRenderItem(model, index);
      renderItemCount++;
      return toReturn;
    }
    
    table.render();
    
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
    equal($(table.el).find('.content tr.first td.first').text(),'alan');
    
  });



});