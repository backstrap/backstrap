$(document).ready(function() {

  module("Backbone.UI.TimePicker");

  test("withDataBinding", function() {
    var coffee = new Backbone.Model({
      roaster: 'Counter Culture',
      name: 'Baroida',
      roastedOn: new Date(2012, 2, 28, 6, 30),
      acidic: true
    });

    var timepicker = new Backbone.UI.TimePicker({
      model : coffee,
      content : 'roastedOn'
    }).render();

    // text field content should have changed
    var text = $(timepicker.el).find('input').val();
    equal(text, '06:30 am');

    // update our model
    coffee.set({
      roastedOn: new Date(2012,2,28,13,0)
    });

    //text should have changed
    text = $(timepicker.el).find('input').val();
    equal(text, '01:00 pm');

    //select 10:00 am from the time picker
    $(timepicker.el).find('input').click();
    $(timepicker._menu.select).find('option').eq(20).click();

    //check that the model updated
    equal(coffee.get('roastedOn').getHours(),10);

  });

  test("manually enter time", function() {
    var coffee = new Backbone.Model({
      roaster: 'Counter Culture',
      name: 'Baroida',
      roastedOn: null,
      acidic: true
    });

    var timepicker = new Backbone.UI.TimePicker({
      model: coffee,
      content: 'roastedOn'
    }).render();

    //type in datepicker and check if model updates
    $(timepicker.el).find('input').simulate("key-sequence", {sequence: "8:30 pm"});
    $(timepicker.el).find('input').simulate("key-sequence", {sequence: "{enter}"});

    //check that the model updated
    equal(coffee.get('roastedOn').getHours(),20);
    equal(coffee.get('roastedOn').getMinutes(),30);


  });

  test("interval", function() {

    var coffee = new Backbone.Model({
      roaster: 'Counter Culture',
      name: 'Baroida',
      roastedOn: new Date(2012, 2, 28, 6, 30),
      acidic: true
    });

    var timepicker = new Backbone.UI.TimePicker({
      model : coffee,
      content : 'roastedOn',
      interval : 15
    }).render();

    //check if second time listed is 12:15 am
    equal($(timepicker._menu.select).find('option').eq(1).text(),'12:15 am');

  });

  test("disabled", function() {

    var coffee = new Backbone.Model({
      roaster: 'Counter Culture',
      name: 'Baroida',
      roastedOn: new Date(2012, 2, 28, 6, 30),
      acidic: true
    });

    var timepicker = new Backbone.UI.TimePicker({
      model : coffee,
      content : 'roastedOn',
      disabled : true
    }).render();

    //check if text area has disabled class
    ok($(timepicker.el).find('.text_field').hasClass('disabled'));
    //check if textare is disabled
    ok($(timepicker.el).find('input').is(":disabled"));

  });

  test("format", function() {

    var coffee = new Backbone.Model({
      roaster: 'Counter Culture',
      name: 'Baroida',
      roastedOn: new Date(2012, 2, 28, 6, 30, 23),
      acidic: true
    });

    var timepicker = new Backbone.UI.TimePicker({
      model : coffee,
      content : 'roastedOn',
      format : 'HH:mm:ss'
    }).render();

    //check time format
    var date = $(timepicker.el).find('input').val();
    equal(date,'06:30:23');

  });

  test("name", function() {

    var coffee = new Backbone.Model({
      roaster: 'Counter Culture',
      name: 'Baroida',
      roastedOn: new Date(2012, 2, 28, 6, 30),
      acidic: true
    });

    var timepicker = new Backbone.UI.TimePicker({
      model : coffee,
      content : 'roastedOn',
      name : 'picker'
    }).render();

    //check name attribute is set
    equal($(timepicker.el).find('input').attr("name"),'picker');
    //check value based on id
    equal($(timepicker.el).find('#picker').val(),'06:30 am');

  });

});
