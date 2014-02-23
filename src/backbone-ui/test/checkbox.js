$(document).ready(function() {

  module("Backbone.UI.Checkbox");

  test("withoutDataBinding", function() {
    var checkbox = new Backbone.UI.Checkbox({
      content : 'foo',
      checked : true
    }).render();

    var text = $(checkbox.el).find('label').text();
    equal(text, 'foo');
    
    //check
    equal(checkbox.input.checked, true);

    checkbox = new Backbone.UI.Checkbox({
      label : 'foo',
      checked : false
    }).render();
    
    //uncheck
    equal(checkbox.input.checked, false);

    //check
    $(checkbox.input).click();
    equal(checkbox.input.checked, true);

    //uncheck
    $(checkbox.input).click();
    equal(checkbox.input.checked, false);


  });

  test("withDataBinding and labelContent", function() {
    
    var model = new Backbone.Model({
      description : 'property name',
      active : true
    });

    var checkbox = new Backbone.UI.Checkbox({
      model : model,
      content : 'active',
      labelContent : 'description'
    }).render();

    // label should be rendered from the 'descripton' property
    var text = $(checkbox.el).find('label').text();
    equal(text, 'property name');

    // checkmark should be active based on the 'active' property
    equal(checkbox.input.checked, true);

    // update our model
    model.set({
      active : false,
      description : 'baz'
    });

    // text should have changed
    text = $(checkbox.el).find('label').text();
    equal(text, 'baz');

    // and we should not have a checkmark fill
    equal(checkbox.input.checked, false);

    //check
    checkbox.input.click();
    equal(checkbox.input.checked, true);
    equal(model.get('active'), true);
    
    //uncheck
    checkbox.input.click();
    equal(checkbox.input.checked, false);
    equal(model.get('active'), false);

  });

  test("disabled", function() {
    var model = new Backbone.Model({
      description : 'property name',
      active : true
    });

    var checkbox = new Backbone.UI.Checkbox({
      model : model,
      content : 'active',
      labelContent : 'description',
      disabled : true
    }).render();

    //try to uncheck
    checkbox.input.click();
    equal(checkbox.input.checked, true);
    equal(model.get('active'),true);

  });

});
