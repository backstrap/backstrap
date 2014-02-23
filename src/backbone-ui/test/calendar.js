$(document).ready(function() {

  module("Backbone.UI.Calendar");

  test("withoutDataBinding", function() {
    var calendar = new Backbone.UI.Calendar({
      date : new Date(2013, 2, 22, 6, 30)
    }).render();

    //check the month and year
    var monthYear = $(calendar.el).find('.title').text();
    equal(monthYear,'mar 2013');
    //check the day
    var day = $(calendar.el).find('.selected .day').text();
    equal(day,22);
  });

  test("withDataBinding", function() {
    var coffee = new Backbone.Model({
      roaster: 'Counter Culture',
      name: 'Baroida',
      roastedOn: new Date(2012, 2, 28, 6, 30),
      acidic: true
    });

    var calendar = new Backbone.UI.Calendar({
      model: coffee,
      content: 'roastedOn'
    }).render();

    //check the month and year
    var monthYear = $(calendar.el).find('.title').text();
    equal(monthYear,'mar 2012');
    //check the day
    var day = $(calendar.el).find('.selected .day').text();
    equal(day,28);

    // update the roastedOn property
    coffee.set({roastedOn : new Date(2011, 2, 1, 6, 30)});

    // date should have changed
    var monthYear = $(calendar.el).find('.title').text();
    equal(monthYear,'mar 2011');
    //check the day
    var day = $(calendar.el).find('.selected .day').text();
    equal(day,1);
  });

  test("weekStart", function() {
    var coffee = new Backbone.Model({
      roaster: 'Counter Culture',
      name: 'Baroida',
      roastedOn: new Date(2012, 2, 28, 6, 30),
      acidic: true
    });

    var calendar = new Backbone.UI.Calendar({
      model: coffee,
      content: 'roastedOn'
    }).render();

    var calendar = new Backbone.UI.Calendar({
      model: coffee,
      content: 'roastedOn',
      weekStart: 1
    }).render();

    //set roastedOn date of model
    coffee.set({roastedOn : new Date(2012, 2, 28, 6, 30)});

    //check that the week starts with monday
    var weeksStartDay = $(calendar.el).find('.days td').eq(0).text();
    equal(weeksStartDay,'m');

    // check first monday day
    var day = $(calendar.el).find('.row.first td').eq(0).text();
    equal(day,27);

  });

  test("onSelect", function() {
    var selectedDay = 0;

    var coffee = new Backbone.Model({
      roaster: 'Counter Culture',
      name: 'Baroida',
      roastedOn: new Date(2012, 2, 28, 6, 30),
      acidic: true
    });

    var calendar = new Backbone.UI.Calendar({
      model: coffee,
      content : 'roastedOn',
      onSelect: function(item) { 
        //set day to selected day
        selectedDay = item;
      }
    }).render();

    // check day changed
    $(calendar.el).find('.row.last td a').eq(0).click();
    deepEqual(selectedDay,new Date(2012,2,25));

  });

  test("date", function() {
    var selectedDay = 0;

    var coffee = new Backbone.Model({
      roaster: 'Counter Culture',
      name: 'Baroida',
      roastedOn: new Date(2012, 2, 28, 6, 30),
      acidic: true
    });

    var calendar = new Backbone.UI.Calendar({
      model: coffee,
      date : new Date(2012,3,1)
    }).render();

    //check the day
    var day = $(calendar.el).find('.selected .day').text();
    equal(day,1);

  });


});
