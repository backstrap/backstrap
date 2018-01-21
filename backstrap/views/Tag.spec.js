require(
    ['../core', 'test/testing', './Tag'],
    function ($$, testing, Tag) {
        testing.testObj(new Tag({content: 'content'}), 'div', 'views.Tag');

        ['Div', 'Form', 'H1', 'H2', 'H3', 'H4', 'Li', 'Ol', 'P', 'Textarea', 'Ul'].forEach(function (tag) {
            testing.testObj(new ($$[tag])({content: 'content'}), tag.toLowerCase(), 'views.' + tag);
        });
    }
);
