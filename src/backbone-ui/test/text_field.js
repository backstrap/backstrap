$(document).ready(function() {

  module("Backbone.UI.TextField");

  test("withoutDataBinding", function() {
    var textfield = new Backbone.UI.TextField({
      content : 'foo'
    }).render();

    var text = $(textfield.el).find('input').val();
    equal(text, 'foo');

  });

  test("withDataBinding", function() {
    var coffee = new Backbone.Model({
      roaster: 'Counter Culture',
      name: 'Baroida',
      roastedOn: new Date(2012, 2, 28, 6, 30),
      acidic: true
    });

    var textfield = new Backbone.UI.TextField({
      model : coffee,
      content : 'roaster'
    }).render();

    // text field content should have changed
    var text = $(textfield.el).find('input').val();
    equal(text, 'Counter Culture');

    // update our model
    coffee.set({
      roaster : 'La Colombe'
    });

    // text should have changed
    text = $(textfield.el).find('input').val();
    equal(text, 'La Colombe');

    //type in text field and check if model updates
    $(textfield.el).find('input').simulate("key-sequence", {sequence: "a"});
    stop();
    setTimeout(function(){
      equal(coffee.get('roaster'),'La Colombea');
      start();
    },1000);

  });

  test("type", function() {

    var coffee = new Backbone.Model({
      roaster: 'Counter Culture',
      name: 'Baroida',
      roastedOn: new Date(2012, 2, 28, 6, 30),
      acidic: true
    });

    var textfield = new Backbone.UI.TextField({
      model : coffee,
      content : 'roaster',
      type : 'password'
    }).render();

    //check if text field is a password field
    equal($(textfield.el).find('input').attr("type"),'password');

  });

  test("disabled", function() {

    var coffee = new Backbone.Model({
      roaster: 'Counter Culture',
      name: 'Baroida',
      roastedOn: new Date(2012, 2, 28, 6, 30),
      acidic: true
    });

    var textfield = new Backbone.UI.TextField({
      model : coffee,
      content : 'roaster',
      disabled : true
    }).render();

    //check if text area has disabled class
    ok($(textfield.el).hasClass('disabled'));
    //check if textare is disabled
    ok($(textfield.el).find('input').is(":disabled"));

  });

  test("onKeyPress", function() {
    var countPress=0;
    var enterPress=0;

    var coffee = new Backbone.Model({
      roaster: 'Counter Culture',
      name: 'Baroida',
      roastedOn: new Date(2012, 2, 28, 6, 30),
      acidic: true
    });

    var textfield = new Backbone.UI.TextField({
      model : coffee,
      content : 'roaster',
      onKeyPress : function(e) { 
        countPress++;
        if(e.keyCode === 13) enterPress++;
      }
    }).render();

    //press the enter key in text field
    $(textfield.el).find('input').simulate("key-sequence", {sequence: "{enter}"});
    //wait 1 sec and check if keypress got called and detect keyCode
    stop();
    setTimeout(function(){
      equal(countPress,1);
      equal(enterPress,1);
      start();
    },1000);


  });

  test("tabIndex", function() {

    var coffee = new Backbone.Model({
      roaster: 'Counter Culture',
      name: 'Baroida',
      roastedOn: new Date(2012, 2, 28, 6, 30),
      acidic: true
    });

    var textfield = new Backbone.UI.TextField({
      model : coffee,
      content : 'roaster',
      tabIndex : 5
    }).render();

    //check if tab index is set to 5
    equal($(textfield.el).find('input').attr("tabindex"),5);

  });

  test("name", function() {

    var textfield = new Backbone.UI.TextField({
      content : 'foo',
      name : 'pollos_hermanos'
    }).render();

    //check name attribute is set
    equal($(textfield.el).find('input').attr("name"),'pollos_hermanos');
    //check value based on id
    equal($(textfield.el).find('#pollos_hermanos').val(),'foo');

  });

  test("maxLength", function() {

    var textfield = new Backbone.UI.TextField({
      content : 'foo',
      maxLength : 5
    }).render();

    //check maxlength attribute is set
    equal($(textfield.el).find('input').attr("maxlength"),5);

  });
  
  test("setContentToNull", function() {
    
    var coffee = new Backbone.Model({
      roaster: 'Counter Culture',
      name: 'Baroida',
      roastedOn: new Date(2012, 2, 28, 6, 30),
      acidic: true
    });

    var textfield = new Backbone.UI.TextField({
      model : coffee,
      content : 'roaster'
    }).render();
    
    // initial test
    equal(textfield.input.value, 'Counter Culture');
    
    // set to null test
    coffee.set({roaster : null});
    equal(textfield.input.value, "");
    
    // back to initial test
    coffee.set({roaster : 'Counter Culture'});
    equal(textfield.input.value, 'Counter Culture');
    
    // unset test
    coffee.unset('roaster');
    equal(textfield.input.value, "");
    
  });

});
