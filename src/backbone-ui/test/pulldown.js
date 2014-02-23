$(document).ready(function() {

  module("Backbone.UI.Pulldown");

  Backbone.UI.setMobile(false);

  var regions = new Backbone.Collection([{
    name: 'Americas',
    notes: 'Bright'
  }, {
    name: 'Africa',
    notes: 'Fruity'
  }]);

  test("withoutDataBinding", function(){

    var pulldown = new Backbone.UI.Pulldown({
      content: 'test',
      alternatives: regions,
      altLabelContent: 'name'
    }).render();

    $(pulldown._menu.select).click();
    $(pulldown._menu.select).find('option').eq(1).click();

    equal(pulldown._menu.select.options[pulldown._menu.select.selectedIndex].text, 'Americas');

  });

  test("withDataBinding", function(){

    var coffee = new Backbone.Model({
      roaster: 'Counter Culture',
      name: 'Baroida',
      roastedOn: new Date(2012, 2, 28, 6, 30),
      acidic: true,
      region: regions.at(0)
    });

    var pulldown = new Backbone.UI.Pulldown({
      model : coffee,
      content: 'region',
      alternatives: regions,
      altLabelContent: 'name'
    }).render();

    $(pulldown._menu.select).click();
    $(pulldown._menu.select).find('option').eq(1).click();

    equal(coffee.get('region').get('name'),'Africa');

  });

  test("placeholder", function(){

    var pulldown = new Backbone.UI.Pulldown({
      content: 'test',
      alternatives: regions,
      altLabelContent: 'name',
      placeholder: 'Select a region...'
    }).render();

    //check the label on pulldown
    equal($(pulldown._menu.select).find('option').eq(0).text(),"Select a region...");

  });

  
  test("onChange", function() {

    var coffee = new Backbone.Model({
      roaster: 'Counter Culture',
      name: 'Baroida',
      roastedOn: new Date(2012, 2, 28, 6, 30),
      acidic: true,
      region: regions.at(0)
    });

    var changeEvents = 0, itemClicked;

    var pulldown = new Backbone.UI.Pulldown({
      model: coffee,
      content: 'region',
      alternatives: regions,
      altLabelContent: 'name',
      onChange: function (item) {
        itemClicked = item;
        changeEvents++;
      }
    }).render();
    
    $(pulldown._menu.select).click();
    $(pulldown._menu.select).find('option').eq(1).click();

    equal(changeEvents, 1);
    equal(itemClicked, regions.at(1));
  });

  test("issue 31 - remove pulldown-add pulldown-double fire", function(){

    var changeEvents = 0;

    var coffee = new Backbone.Model({
      roaster: 'Counter Culture',
      name: 'Baroida',
      roastedOn: new Date(2012, 2, 28, 6, 30),
      acidic: true,
      region: regions.at(0)
    });

    var pulldown1 = new Backbone.UI.Pulldown({
      model : coffee,
      content: 'region',
      alternatives: regions,
      altLabelContent: 'name',
      emptyItem: true,
      onChange: function (item) {
        changeEvents++;
      }
    }).render();

    pulldown1.remove();

    var pulldown2 = new Backbone.UI.Pulldown({
      model : coffee,
      content: 'region',
      alternatives: regions,
      altLabelContent: 'name',
      onChange: function (item) {
        changeEvents++;
      }
    }).render();

    $(pulldown2._menu.select).click();
    $(pulldown2._menu.select).find('option').eq(1).click();

    equal(changeEvents, 1);
  });

});