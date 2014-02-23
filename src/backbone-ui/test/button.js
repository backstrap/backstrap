$(document).ready(function() {

  module("Backbone.UI.Button");

  test("withoutDataBinding", function() {
    var button = new Backbone.UI.Button({
      content : 'foo'
    }).render();

    var text = $(button.el).find('span').text();
    equal(text, 'foo');
  });

  test("withDataBinding", function() {
    var model = new Backbone.Model({
      foo : 'bar'
    });

    var button = new Backbone.UI.Button({
      model : model,
      content : 'foo'
    }).render();

    // text should be based on 'foo' property
    var text = $(button.el).find('span').text();
    equal(text, 'bar');

    // update the foo property
    model.set({foo : 'baz'});

    // text should have changed
    text = $(button.el).find('span').text();
    equal(text, 'baz');
  });

  test("disabled", function() {
    var clickCount=0;

    var model = new Backbone.Model({
      foo : 'bar'
    });

    var button = new Backbone.UI.Button({
      model : model,
      content : 'foo',
      disabled : true,
      onClick : function() { clickCount++; }
    }).render();

    ok($(button.el).hasClass('disabled'));
    $(button.el).click();

    equal(clickCount, 0);
  });
  
  test("setDisabled", function() {
    
    var clickCount=0;

    var model = new Backbone.Model({
      foo : 'bar'
    });

    var button = new Backbone.UI.Button({
      model : model,
      content : 'foo',
      onClick : function() { clickCount++; }
    }).render();
    
    button.setEnabled(false);

    ok($(button.el).hasClass('disabled'));
    $(button.el).click();

    equal(clickCount, 0);
    
  });

  test("active", function() {
    var clickCount=0;

    var model = new Backbone.Model({
      foo : 'bar'
    });

    var button = new Backbone.UI.Button({
      model : model,
      content : 'foo',
      active : true,
      onClick : function() { clickCount++; }
    }).render();

    ok($(button.el).hasClass('active'));
    $(button.el).click();

    equal(clickCount, 0);
  });
  
  test("setActive", function() {
    var clickCount=0;

    var model = new Backbone.Model({
      foo : 'bar'
    });

    var button = new Backbone.UI.Button({
      model : model,
      content : 'foo',
      onClick : function() { clickCount++; }
    }).render();
    
    button.setActive(true);

    ok($(button.el).hasClass('active'));
    $(button.el).click();

    equal(clickCount, 0);
  });

  test("onClick", function() {
    var clickCount=0;

    var model = new Backbone.Model({
      foo : 'bar'
    });

    var button = new Backbone.UI.Button({
      model : model,
      content : 'foo',
      onClick : function() { clickCount++; }
    }).render();

    $(button.el).click();
    equal(clickCount, 1);
  });

  test("isSubmit", function() {
    var button = new Backbone.UI.Button({
      label : 'foo',
      isSubmit : true
    }).render();

    equal($(button.el).attr('type'), 'submit');
  });

});
