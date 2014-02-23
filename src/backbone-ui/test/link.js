$(document).ready(function() {

  module("Backbone.UI.Link");

  test("withoutDataBinding", function() {
    var link = new Backbone.UI.Link({
      content : 'foo',
    }).render();

    var text = $(link.el).find('span').text();
    equal(text, 'foo');

  });

  test("withDataBinding", function() {
    var coffee = new Backbone.Model({
      roaster: 'Counter Culture',
      name: 'Baroida',
      roastedOn: new Date(2012, 2, 28, 6, 30),
      acidic: true
    });

    var link = new Backbone.UI.Link({
      model : coffee,
      content : 'roaster'
    }).render();

    // label should be rendered from the 'descripton' property
    var text = $(link.el).find('span').text();
    equal(text, 'Counter Culture');

    // update our model
    coffee.set({
      roaster : 'La Colombe'
    });

    // text should have changed
    text = $(link.el).find('span').text();
    equal(text, 'La Colombe');

  });

  test("disabled", function() {
    var clickCount=0;

    var coffee = new Backbone.Model({
      roaster: 'Counter Culture',
      name: 'Baroida',
      roastedOn: new Date(2012, 2, 28, 6, 30),
      acidic: true
    });

    var link = new Backbone.UI.Link({
      model : coffee,
      content : 'roaster',
      disabled : true,
      onClick : function() { clickCount++; }
    }).render();

    ok($(link.el).hasClass('disabled'));
    $(link.el).click();
    equal(clickCount,0);

  });

  test("onClick", function() {
    var clickCount=0;

    var coffee = new Backbone.Model({
      roaster: 'Counter Culture',
      name: 'Baroida',
      roastedOn: new Date(2012, 2, 28, 6, 30),
      acidic: true
    });

    var link = new Backbone.UI.Link({
      model : coffee,
      content : 'roaster',
      onClick : function() { clickCount++; }
    }).render();

    $(link.el).click();
    equal(clickCount,1);

  });

});
