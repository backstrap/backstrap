__webpack_require__.oe = window.onerror = function(e) {
    alert('' + e);
};
require(
    [
        'jquery',
        'jasmine-core/jasmine',
        'jasmine-core/jasmine-html',
        'jasmine-core/boot',
        'jasmine-core/jasmine.css'
    ], function () {
        // jasmine-ajax needs this.
        window.getJasmineRequireObj = (() => jasmine);
        require([
            'jasmine-jquery'
        ], function () {
            const requireSpecs = require.context('../backstrap/', true, /\.spec\.js$/);

            jasmine.getFixtures().fixturesPath = 'webpack/jasmine';
            requireSpecs.keys().forEach(requireSpecs);
        });
    }
);
