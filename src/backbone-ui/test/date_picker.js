$(document).ready(function() {

  QUnit.module("Backbone.UI.DatePicker");

  test("withoutDataBinding", function() {
    var datepicker = new Backbone.UI.DatePicker({
      date : new Date(2013, 2, 22)
    }).render();

    //click on 1st of march and check
    $(datepicker.el).find('input').click();
    datepicker._calendar.$('.row.first td a').eq(0).click();
    var date = $(datepicker.el).find('input').val();
    equal(date,'03/01/2013');

  });

  test("withDataBinding", function() {
    var coffee = new Backbone.Model({
      roaster: 'Counter Culture',
      name: 'Baroida',
      roastedOn: new Date(2012, 2, 28),
      acidic: true
    });

    var datepicker = new Backbone.UI.DatePicker({
      model: coffee,
      content: 'roastedOn'
    }).render();

    //check if date is set to model date
    var date = $(datepicker.el).find('input').val();
    equal(date,'03/28/2012');

    //update model and check time picker
    coffee.set({ roastedOn : new Date(2012,3,1)});
    date = $(datepicker.el).find('input').val();
    equal(date,'04/01/2012');

    //pick date and check model
    $(datepicker.el).find('input').click();
    datepicker._calendar.$('.row.last td a').eq(0).click();
    date = $(datepicker.el).find('input').val();
    equal(date,'04/29/2012');
    equal(coffee.get('roastedOn').getMonth(),'3');
    equal(coffee.get('roastedOn').getDate(),'29');
    equal(coffee.get('roastedOn').getFullYear(),'2012');

  });

  test("withDataBinding content empty", function() {
    var coffee = new Backbone.Model({
      roaster: 'Counter Culture',
      name: 'Baroida',
      roastedOn: null,
      acidic: true
    });

    var datepicker = new Backbone.UI.DatePicker({
      model: coffee,
      content: 'roastedOn'
    }).render();

    //check if date is set to model date
    var date = $(datepicker.el).find('input').val();
    equal(date,"");

    //update model and check time picker
    coffee.set({ roastedOn : new Date(2012,3,1)});
    date = $(datepicker.el).find('input').val();
    equal(date,'04/01/2012');

    //pick date and check model
    $(datepicker.el).find('input').click();
    datepicker._calendar.$('.row.last td a').eq(0).click();
    date = $(datepicker.el).find('input').val();
    equal(date,'04/29/2012');
    equal(coffee.get('roastedOn').getMonth(),'3');
    equal(coffee.get('roastedOn').getDate(),'29');
    equal(coffee.get('roastedOn').getFullYear(),'2012');

  });

  test("manually enter date", function() {
    var coffee = new Backbone.Model({
      roaster: 'Counter Culture',
      name: 'Baroida',
      roastedOn: null,
      acidic: true
    });

    var datepicker = new Backbone.UI.DatePicker({
      model: coffee,
      content: 'roastedOn'
    }).render();

    //type in datepicker and check if model updates
    $(datepicker.el).find('input').simulate("key-sequence", {sequence: "08/24/1981"});
    $(datepicker.el).find('input').simulate("key-sequence", {sequence: "{enter}"});

    //check model changed
    equal(coffee.get('roastedOn').getMonth(),'7');
    equal(coffee.get('roastedOn').getDate(),'24');
    equal(coffee.get('roastedOn').getFullYear(),'1981');

  });

  test("format", function() {
    var datepicker = new Backbone.UI.DatePicker({
      date : new Date(2013, 2, 22),
      format : 'YYYY-MM-DD HH:mm:ss'
    }).render();

    //check date format
    var date = $(datepicker.el).find('input').val();
    equal(date,'2013-03-22 00:00:00');
  });

});
