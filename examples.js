require(['jquery', 'backstrap'], function($, $$) {
    
    var bicycles = new $$.Collection([
        { type: 'mountain',   color: 'red',    purchased: new Date(2013, 12, 24) },
        { type: 'road',       color: 'silver', purchased: new Date(2013,  3, 11) },
        { type: 'cyclocross', color: 'blue',   purchased: new Date(2011, 10, 10) },
        { type: 'hybrid',     color: 'white',  purchased: new Date(2012,  7, 30) },
        { type: 'recumbent',  color: 'yellow', purchased: new Date(2012,  8,  1) }
    ]);
    
    var grid;
    
    $('body').append(
        $$.div({className: 'wrapper'},
            $$.pageHeader($$.h1('Backstrap Examples')),
            grid = $$.grid({ layout: [
                [ 12 ],
                [ 4, 4, 4 ],
                [ 12 ]
            ]})
        )
    );
    
    grid.getCell(1, 1).append($$.container(
        $$.jumbotron({bgcontext: 'primary'},
            'Some example text in a Jumbotron, including ',
            $$.span({context: 'warning'}, 'some text in a warning context color,'),
            'a ',
            $$.button('Button'),
            ' that doesn\'t do anything, and a star glyph: ',
            $$.glyph('star')
        ),
        $$.panel(
            $$.p("How it's done:"),
            $$.pre($$.code(
                "$$.jumbotron({bgcontext: 'primary'},\n" +
                "    'Some example text in a Jumbotron, including ',\n" +
                "    $$.span({context: 'warning'}, 'some text in a warning context color, '),\n" +
                "    'a ',\n" +
                "    $$.button('Button'),  \n" +
                "    ' that doesn\'t do anything, and a star glyph: ', \n" +
                "    $$.glyph('star')\n" +
                ")"
            ))
        ),
        $$.p('For the rest of the page, we will bind this dataset to various components:'),
        $$.blockquote($$.code($$.pre(
            "var bicycles = new $$.Collection([\n",
            "    { id: 1, type: 'mountain',   color: 'red',    purchased: new Date(2013, 12, 24) },\n",
            "    { id: 2, type: 'road',       color: 'silver', purchased: new Date(2013,  3, 11) },\n",
            "    { id: 3, type: 'cyclocross', color: 'blue',   purchased: new Date(2011, 10, 10) },\n",
            "    { id: 4, type: 'hybrid',     color: 'white',  purchased: new Date(2012,  7, 30) },\n",
            "    { id: 5, type: 'recumbent',  color: 'yellow', purchased: new Date(2012,  8,  1) }\n",
            "]);"
        ))),
        $$.p('Note that the widgets are all sharing the same data model objects, ',
            'so changing a value with one widget will cause changes in the other widgets.')
    ));
    
    grid.getCell(2, 1).append(
        $$.div({ context: 'primary' },
            $$.plain.label('Type: '),
            new $$.TextField({model: bicycles.at(0), content: 'type'}).render().el
        )
    );
    
    grid.getCell(2, 2).append(
        $$.div({ context: 'primary' },
            $$.plain.label('Purchased: '),
            new $$.DatePicker({model: bicycles.at(0), content: 'purchased'}).render().el
        )
    );
    
    grid.getCell(2, 3).append(
        $$.div({ context: 'primary' },
            $$.plain.label('Color: '),
            new $$.Badge({model: bicycles.at(0), content: 'color'}).render().el
        )
    );
    
    grid.getCell(3,1).append(
        $$.div({},
            "My ",
            new $$.Button({model: bicycles.at(0), content: 'type'}).render().el,
            " bike is ",
            new $$.Button({model: bicycles.at(0), content: 'color'}).render().el,
            "."
        )
    );
    
});
