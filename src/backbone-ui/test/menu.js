$(document).ready(function() {

  module("Backbone.UI.Menu");

  Backbone.UI.setMobile(false);

  var regions = new Backbone.Collection([{
    name: 'Americas',
    notes: 'Bright'
  }, {
    name: 'Africa',
    notes: 'Fruity'
  }]);

  test("withoutDataBinding", function(){

    var menu = new Backbone.UI.Menu({
      content: 'test',
      alternatives: regions,
      altLabelContent: 'name'
    }).render();

    $(menu.select).find('option').eq(1).click();

    equal(menu.select.options[menu.select.selectedIndex].text,'Americas');

  });

  test("withDataBinding", function(){

    var coffee = new Backbone.Model({
      roaster: 'Counter Culture',
      name: 'Baroida',
      roastedOn: new Date(2012, 2, 28, 6, 30),
      acidic: true,
      region: regions.at(0)
    });

    var menu = new Backbone.UI.Menu({
      model : coffee,
      content: 'region',
      alternatives: regions,
      altLabelContent: 'name'
    }).render();

    $(menu.select).find('option').eq(1).click();

    equal(coffee.get('region').get('name'),'Africa');

  });

  test("emptyItem", function(){

    var coffee = new Backbone.Model({
      roaster: 'Counter Culture',
      name: 'Baroida',
      roastedOn: new Date(2012, 2, 28, 6, 30),
      acidic: true,
      region: regions.at(0)
    });

    var menu = new Backbone.UI.Menu({
      model : coffee,
      content: 'region',
      alternatives: regions,
      altLabelContent: 'name',
      emptyItem : { name : 'No Region' }
    }).render();

    //select emptyItem
    $(menu.select).find('option').eq(0).click();

    //check if selection is empty
    equal(coffee.get('region'),null);

  });

});