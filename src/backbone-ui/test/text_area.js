$(document).ready(function() {

  module("Backbone.UI.TextArea");

  test("withoutDataBinding", function() {
    var textarea = new Backbone.UI.TextArea({
      content : 'foo'
    }).render();

    var text = $(textarea.el).find('textarea').val();
    equal(text, 'foo');

  });

  test("withDataBinding", function() {
    var coffee = new Backbone.Model({
      roaster: 'Counter Culture',
      name: 'Baroida',
      roastedOn: new Date(2012, 2, 28, 6, 30),
      acidic: true
    });

    var textarea = new Backbone.UI.TextArea({
      model : coffee,
      content : 'roaster'
    }).render();

    // text area content should have changed
    var text = $(textarea.el).find('textarea').val();
    equal(text, 'Counter Culture');

    // update our model
    coffee.set({
      roaster : 'La Colombe'
    });

    // text should have changed
    text = $(textarea.el).find('textarea').val();
    equal(text, 'La Colombe');

    //type in text area and check if model updates
    $(textarea.el).find('textarea').simulate("key-sequence", {sequence: "a"});
    stop();
    setTimeout(function(){
      equal(coffee.get('roaster'),'aLa Colombe');
      start();
    },1000);

  });

  test("disabled", function() {

    var coffee = new Backbone.Model({
      roaster: 'Counter Culture',
      name: 'Baroida',
      roastedOn: new Date(2012, 2, 28, 6, 30),
      acidic: true
    });

    var textarea = new Backbone.UI.TextArea({
      model : coffee,
      content : 'roaster',
      disabled : true
    }).render();

    //check if text area has disabled class
    ok($(textarea.el).hasClass('disabled'));
    //check if textare is disabled
    ok($(textarea.el).find('textarea').is(":disabled"));

  });

  test("textAreaId", function() {

    var coffee = new Backbone.Model({
      roaster: 'Zafiro Anejo',
      name: 'Baroida',
      roastedOn: new Date(2012, 2, 28, 6, 30),
      acidic: true
    });

    var textarea = new Backbone.UI.TextArea({
      model : coffee,
      content : 'roaster',
      textAreaId : 'textArea1'
    }).render();

    //check value based on id
    equal($(textarea.el).find('#textArea1').val(),'Zafiro Anejo');

  });

});
