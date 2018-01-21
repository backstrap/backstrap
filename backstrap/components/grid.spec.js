
require(['test/testing', '../core', './grid'], function (testing, $$, grid) {
    testing.appendTest(
        grid({layout: [[
                {
                    xs: 3,
                    content: $$.thumbnail(
                        $$.a($$.img({src: "https://www.princeton.edu/main/images/news/2014/2/alumniday_IndexPage.jpg",
                            style: 'width: 100px;'
                        }))
                    )
                },
                {
                    xs: 3,
                    content: $$.thumbnail(
                        $$.a($$.img({src: "https://www.princeton.edu/main/images/news/2014/2/alumniday_IndexPage.jpg",
                            style: 'width: 100px;'
                        }))
                    )
                }
            ]]
        }),
        {
            'div.container': 1,
            'div.container div.row': 1,
            'div.container div.col.col-xs-3': 2,
            'div.container div.col.col-xs-3 div.thumbnail': 2
        },
        'components.grid'
    );
});
