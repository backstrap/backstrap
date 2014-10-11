require(['jquery', 'backstrap', 'moment'],
    function($, $$, moment)
    {
        var example = '';
        var content = $$.div();
        
        var dataset = 
            "var bicycles = new $$.Collection([\n" +
            "    { id: 1, type: 'mountain',   color: 'red',    purchased: new Date(2013, 12, 24) },\n" +
            "    { id: 2, type: 'road',       color: 'silver', purchased: new Date(2013,  3, 11) },\n" +
            "    { id: 3, type: 'cyclocross', color: 'blue',   purchased: new Date(2011, 10, 10) },\n" +
            "    { id: 4, type: 'hybrid',     color: 'white',  purchased: new Date(2012,  7, 30) },\n" +
            "    { id: 5, type: 'recumbent',  color: 'yellow', purchased: new Date(2012,  8,  1) }\n" +
            "]);";
        eval(dataset);
        
        var showExample = function (title, code) {
            content.append($$.panel({context: 'info'},
                $$.h4(title),
                eval(code),
                $$.h4("How it's done:"),
                $$.pre($$.code(code))
            ));
        };
        
        $('body').append(
            $$.div({className: 'wrapper'},
                $$.pageHeader($$.h1('Backstrap Examples')),
                (content = $$.container())
            ),
            $$.div({className: 'footer'})
        );
        content = $(content);
        
        showExample("Example: Jumbotron, context, button, and glyph:",
            "$$.jumbotron({bgcontext: 'primary'},\n" +
            "    'Some example text in a Jumbotron, including ',\n" +
            "    $$.span({context: 'warning'}, 'some text in a warning context color,'),\n" +
            "    ' and a ',\n" +
            "    $$.button('Button'),  \n" +
            "    ' that doesn\\'t do anything, and a star glyph: ', \n" +
            "    $$.glyph('star')\n" +
            ")"
        );
    
        content.append($$.panel({context: 'info'},
            $$.h4('Example dataset'),
            $$.p('For the rest of the page, we will bind the following dataset to various components. ',
                'Note that the widgets are all sharing the same data objects, ',
                'so changing a value with one widget will cause changes in the other widgets.'
            ),
            $$.pre($$.code(dataset))
        ));
    
        showExample('Example: Show Data in a Table',
            "new $$.Table({\n" +
            "    striped: true,\n" +
            "    model: bicycles,\n" +
            "    columns: [\n" +
            "        { title: 'ID', content: 'id' }, \n" +
            "        { title: 'Bike type', content: 'type' }, \n" +
            "        { title: 'Color', content: 'color' } \n" +
            "    ]\n" +
            "}).render().el");
        
        showExample('Example: Show Data in a List',
            "new $$.List({\n" +
            "    model: bicycles,\n" +
            "    itemView: $$.View.extend({\n" +
            "        render: function () { \n" +
            "            this.$el.empty().append( \n" +
            "                    this.model.get('id') + ': ',\n" +
            "                    this.model.get('color') + ' ',\n" +
            "                    this.model.get('type') + ' bike ',\n" +
            "                    moment(this.model.get('purchased')).format('(MMM Do, YYYY)') \n" +
            "             ); \n" +
            "        }\n" +
            "    })\n" +
            "}).render().el");
        
        showExample('Example: Edit Widgets (change the values, and they change in the views above)',
            "$$.grid({\n" +
            "    fluid: true,\n" +
            "    layout: [[\n" +
            "        { md: 4, content: $$.div({ context: 'primary' },\n" +
            "            $$.plain.label('Type: '),\n" +
            "            new $$.TextField({model: bicycles.at(0), content: 'type'}).render().el)\n" +
            "        },\n" +
            "        { md: 4, content: $$.div({ context: 'primary' },\n" +
            "            $$.plain.label('Purchased: '),\n" +
            "            new $$.DatePicker({model: bicycles.at(0), content: 'purchased'}).render().el)\n" +
            "        },\n" +
            "        { md: 4, content: $$.div({ context: 'primary' },\n" +
            "            $$.plain.label('Color: '),\n" +
            "            new $$.Select({model: bicycles.at(0), content: 'color',\n" +
            "                   alternatives: [\n" +
            "                       { color: 'red', name: 'Red' },\n" +
            "                       { color: 'blue', name: 'Blue' },\n" +
            "                       { color: 'green', name: 'Green' },\n" +
            "                       { color: 'white', name: 'White' },\n" +
            "                       { color: 'silver', name: 'Silver' },\n" +
            "                       { color: 'yellow', name: 'Yellow' },\n" +
            "                       { color: 'titanium', name: 'Titanium' },\n" +
            "                       { color: 'pink', name: 'Pink' },\n" +
            "                       { color: 'chartreuse', name: 'Chartreuse' },\n" +
            "                       { color: 'celeste', name: 'Celeste' }\n" +
            "                   ],\n" +
            "                   altValueContent: 'color'\n" +
            "                   altLabelContent: 'name',\n" +
            "               }).render().el)\n" +
            "        }\n" + 
            "    ]]\n" + 
            "})");
    }
);
