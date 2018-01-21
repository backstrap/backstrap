
require(['test/testing', './closeIcon'], function (testing, closeIcon) {
    testing.appendTest(closeIcon(), {
        'button.close': 1,
        'button.close span': 2,
        'button.close span[aria-hidden]': 1,
        'button.close span.sr-only': 1
    }, 'components.closeIcon');
});
